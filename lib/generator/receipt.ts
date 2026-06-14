import { createCanvas, loadImage } from "@napi-rs/canvas"
import { drawWatermark } from "./watermark"
import { randomReceipt } from "./randomize"
import { signedQrDataUrl } from "../signature/sign"

const money = (n: number) => "Rp" + n.toLocaleString("id-ID")

export async function renderReceiptImage(format: "png" | "jpeg" = "png") {
  const data = randomReceipt()
  const W = 480, H = 760
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = "#000"; ctx.font = "bold 20px monospace"; ctx.textAlign = "center"
  ctx.fillText("DEMO STORE (SYNTHETIC)", W / 2, 40)
  ctx.font = "12px monospace"; ctx.textAlign = "left"
  let y = 90
  ctx.fillText(`ID  : ${data.id}`, 24, y); y += 18
  ctx.fillText(`Date: ${data.issuedAt}`, 24, y); y += 28
  for (const it of data.items) {
    ctx.fillText(`${it.qty}x ${it.name}`, 24, y)
    ctx.textAlign = "right"; ctx.fillText(money(it.line), W - 24, y)
    ctx.textAlign = "left"; y += 18
  }
  y += 10; ctx.textAlign = "right"
  ctx.fillText(`Subtotal ${money(data.subtotal)}`, W - 24, y); y += 18
  ctx.fillText(`Tax(11%) ${money(data.tax)}`, W - 24, y); y += 18
  ctx.font = "bold 14px monospace"
  ctx.fillText(`TOTAL ${money(data.total)}`, W - 24, y); y += 30

  const qr = await signedQrDataUrl({
    id: data.id, issuer: "DEMO", total: data.total,
    currency: "IDR", issuedAt: data.issuedAt, synthetic: true,
  })
  const qrImg = await loadImage(qr)
  ctx.drawImage(qrImg, W / 2 - 70, y, 140, 140)

  drawWatermark(ctx, W, H)
  return { data, buffer: format === "png" ? canvas.encode("png") : canvas.encode("jpeg", 80) }
}
