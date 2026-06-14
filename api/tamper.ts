import type { VercelRequest, VercelResponse } from "@vercel/node"
import { renderReceiptImage } from "../lib/generator/receipt"
import { applyTamper, ALL_OPS, type TamperOp } from "../lib/tamper/harness"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const op = String(req.query.op ?? "recompress") as TamperOp
  if (!ALL_OPS.includes(op)) {
    res.status(400).json({ error: "unknown op", allowed: ALL_OPS })
    return
  }
  const { buffer } = await renderReceiptImage("jpeg")
  const out = await applyTamper(await buffer, op)
  res.setHeader("Content-Type", "image/jpeg")
  res.send(out)
}
