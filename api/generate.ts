import type { VercelRequest, VercelResponse } from "@vercel/node"
import { renderReceiptImage } from "../lib/generator/receipt"
import { renderReceiptPdf } from "../lib/generator/pdf"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fmt = String(req.query.format ?? "png")
  if (fmt === "pdf") {
    const buf = await renderReceiptPdf()
    res.setHeader("Content-Type", "application/pdf")
    res.send(buf)
    return
  }
  const { buffer } = await renderReceiptImage(fmt === "jpeg" ? "jpeg" : "png")
  res.setHeader("Content-Type", fmt === "jpeg" ? "image/jpeg" : "image/png")
  res.send(await buffer)
}
