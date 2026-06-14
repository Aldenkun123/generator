import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas"
import { join } from "node:path"
import { randomReceipt } from "./randomize"
import { signedQrDataUrl } from "../signature/sign"

// Register Roboto fonts - coba multiple paths untuk compatibility (lokal + Vercel)
const tryRegisterFont = (filename: string, family: string) => {
  const paths = [
    join(process.cwd(), "fonts", filename),
    join(__dirname, "../../fonts", filename),
    join("/var/task", "fonts", filename), // Vercel deployment path
  ]
  for (const p of paths) {
    try {
      GlobalFonts.registerFromPath(p, family)
      break
    } catch {
      // Font sudah terdaftar atau path tidak ada, lanjut ke path berikutnya
    }
  }
}

tryRegisterFont("Roboto-Regular.ttf", "Roboto")
tryRegisterFont("Roboto-Bold.ttf", "Roboto-Bold")

const W = 640
const PAD = 20
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID")

// Word-wrap helper
function wrap(ctx: any, text: string, maxW: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let cur = ""
  for (const w of words) {
    const test = cur ? cur + " " + w : w
    if (cur && ctx.measureText(test).width > maxW) { lines.push(cur); cur = w }
    else cur = test
  }
  if (cur) lines.push(cur)
  return lines
}

export async function renderReceiptImage(format: "png" | "jpeg" = "png") {
  const data = randomReceipt()

  // ── Two-pass: draw on tall canvas, then crop ──
  const TALL = 2400
  const canvas = createCanvas(W, TALL)
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, W, TALL)

  let y = 0

  // ── TOP COLOR BAR ──
  ctx.fillStyle = "#1a56db"; ctx.fillRect(0, y, W * 0.55, 8)
  ctx.fillStyle = "#e02424"; ctx.fillRect(W * 0.55, y, W * 0.10, 8)
  ctx.fillStyle = "#e3a008"; ctx.fillRect(W * 0.65, y, W * 0.35, 8)
  y += 20

  // ── STORE BADGE ──
  ctx.font = "bold 10px Roboto"
  ctx.fillStyle = "#1a56db"
  const bw = ctx.measureText(data.storeLabel).width + 16
  ctx.strokeStyle = "#1a56db"; ctx.lineWidth = 1.5
  ctx.strokeRect(PAD, y - 12, bw, 18)
  ctx.fillText(data.storeLabel, PAD + 8, y)
  y += 18

  // ── STORE NAME ──
  ctx.font = "bold 22px Roboto"
  ctx.fillStyle = "#111"
  ctx.textAlign = "left"
  for (const line of wrap(ctx, `${data.storeName} ${data.storeNumber}`, W - PAD * 2)) {
    ctx.fillText(line, PAD, y); y += 28
  }
  y += 4

  // ── ADDRESS ──
  ctx.font = "12px Roboto"
  ctx.fillStyle = "#555"
  for (const line of wrap(ctx, data.address, W - PAD * 2)) { ctx.fillText(line, PAD, y); y += 17 }
  ctx.fillText(`Kecamatan ${data.kecamatan}, Kabupaten ${data.kabupaten}`, PAD, y); y += 17
  ctx.fillText(`${data.province} ${data.postal}`, PAD, y); y += 17
  ctx.fillText(`Telp. ${data.telp}`, PAD, y); y += 17
  ctx.fillText(`Gerai: ${data.areaStore} | Area: ${data.areaName}`, PAD, y); y += 22

  // ── INFO TABLE ──
  const infoRows: [string, string][] = [
    ["No Order", data.orderId],
    ["Kode Struk", data.kodeStruk],
    ["Kasir", data.kasir],
    ["Member", data.member],
    ["Tanggal", data.tanggal],
  ]
  const boxY = y
  const rowH = 26
  const boxH = infoRows.length * rowH + 12
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 1
  ctx.strokeRect(PAD, boxY, W - PAD * 2, boxH)
  y = boxY + 20
  for (let i = 0; i < infoRows.length; i++) {
    const [label, value] = infoRows[i]
    ctx.font = "12px Roboto"; ctx.fillStyle = "#666"; ctx.textAlign = "left"
    ctx.fillText(label, PAD + 12, y)
    ctx.font = "bold 12px Roboto"; ctx.fillStyle = "#111"; ctx.textAlign = "right"
    ctx.fillText(value, W - PAD - 12, y)
    if (i < infoRows.length - 1) {
      ctx.strokeStyle = "#eee"; ctx.beginPath()
      ctx.moveTo(PAD + 1, y + 8); ctx.lineTo(W - PAD - 1, y + 8); ctx.stroke()
    }
    y += rowH
  }
  y += 12

  // ── ITEMS ──
  for (const item of data.items) {
    ctx.font = "bold 13px Roboto"; ctx.fillStyle = "#111"; ctx.textAlign = "left"
    for (const line of wrap(ctx, item.name, W - PAD * 2)) { ctx.fillText(line, PAD, y); y += 18 }
    ctx.font = "11px Roboto"; ctx.fillStyle = "#888"; ctx.textAlign = "left"
    ctx.fillText(item.cat, PAD, y)
    ctx.fillStyle = "#555"; ctx.textAlign = "right"
    ctx.fillText(`${item.qty} x ${rp(item.price)}`, W - PAD, y)
    y += 18
    ctx.font = "bold 12px Roboto";
    ctx.fillStyle = "#111"; ctx.textAlign = "right"
    ctx.fillText(rp(item.line), W - PAD, y)
    y += 18
    ctx.strokeStyle = "#eee"; ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke()
    ctx.setLineDash([])
    y += 12
  }

  // ── TOTALS BOX ──
  const totRows: [string, string, string][] = [
    ["Subtotal", rp(data.subtotal), "#111"],
    ["Diskon", `-${rp(data.diskon)}`, "#e02424"],
    ["Pajak", rp(data.tax), "#111"],
    ["Ongkir Internal", rp(data.ongkir), "#111"],
  ]
  const tboxY = y
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 1
  ctx.strokeRect(PAD, tboxY, W - PAD * 2, totRows.length * rowH + 12)
  y = tboxY + 20
  for (const [label, value, color] of totRows) {
    ctx.font = "12px Roboto"; ctx.fillStyle = "#555"; ctx.textAlign = "left"
    ctx.fillText(label, PAD + 12, y)
    ctx.font = "12px Roboto"; ctx.fillStyle = color; ctx.textAlign = "right"
    ctx.fillText(value, W - PAD - 12, y); y += rowH
  }
  y += 4

  // ── TOTAL ROW ──
  ctx.fillStyle = "#1e3a5f"
  ctx.fillRect(PAD, y, W - PAD * 2, 44)
  ctx.font = "bold 15px Roboto"; ctx.fillStyle = "#fff"; ctx.textAlign = "left"
  ctx.fillText("TOTAL BELANJA", PAD + 14, y + 28)
  ctx.fillStyle = "#e3a008"; ctx.textAlign = "right"
  ctx.fillText(rp(data.total), W - PAD - 14, y + 28)
  y += 56

  // ── PAYMENT INFO ──
  ctx.font = "12px Roboto"; ctx.fillStyle = "#555"; ctx.textAlign = "center"
  ctx.fillText(`Metode: ${data.payment}`, W / 2, y); y += 20
  ctx.fillText(`Status: ${data.payStatus}`, W / 2, y); y += 20
  ctx.fillText("Kode Pengiriman Internal Toko:", W / 2, y); y += 20
  ctx.font = "bold 12px Roboto"; ctx.fillStyle = "#111"
  ctx.fillText(data.shipCode, W / 2, y); y += 30

  // ── QR CODE ──
  const qr = await signedQrDataUrl({
    id: data.id, issuer: "DEMO", total: data.total,
    currency: "IDR", issuedAt: data.issuedAt, synthetic: true,
  })
  const qrImg = await loadImage(qr)
  ctx.drawImage(qrImg, W / 2 - 55, y, 110, 110)
  y += 126

  // ── FOOTER ──
  ctx.font = "10px Roboto"; ctx.fillStyle = "#aaa"; ctx.textAlign = "center"
  ctx.fillText(data.kodeStruk, W / 2, y); y += 16
  ctx.fillText("Dokumen ini dibuat otomatis untuk administrasi internal", W / 2, y); y += 16
  ctx.fillText("Barang yang sudah dibeli dicek di kasir sebelum meninggalkan gerai.", W / 2, y)
  y += 24

  // ── OUTER BORDER ──
  ctx.strokeStyle = "#1a56db"; ctx.lineWidth = 4
  ctx.strokeRect(2, 2, W - 4, y - 2)

  // ── WATERMARK (sangat transparan) ──
  ctx.save(); ctx.globalAlpha = 0.05; ctx.fillStyle = "#d00"
  ctx.font = "bold 36px Roboto"; ctx.textAlign = "center"
  ctx.translate(W / 2, y / 2); ctx.rotate(-Math.PI / 6)
  for (let i = -3; i <= 3; i++) ctx.fillText("SYNTHETIC • TEST ONLY", 0, i * 100)
  ctx.restore()

  // ── CROP TO CONTENT ──
  const final = createCanvas(W, y + 10)
  final.getContext("2d").drawImage(canvas, 0, 0)

  return { data, buffer: format === "png" ? final.encode("png") : final.encode("jpeg", 92) }
}
