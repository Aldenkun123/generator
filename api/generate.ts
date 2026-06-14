import type { VercelRequest, VercelResponse } from "@vercel/node"
import { renderReceiptImage } from "../lib/generator/receipt"
import { renderReceiptPdf } from "../lib/generator/pdf"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fmt = String(req.query.format ?? "png")
    
    console.log(`[generate.ts] Generating receipt in format: ${fmt}`)
    
    if (fmt === "pdf") {
      console.log("[generate.ts] Generating PDF...")
      const buf = await renderReceiptPdf()
      console.log(`[generate.ts] PDF generated, size: ${buf.length} bytes`)
      res.setHeader("Content-Type", "application/pdf")
      res.send(buf)
      return
    }
    
    console.log(`[generate.ts] Generating ${fmt} image...`)
    const { data, buffer } = await renderReceiptImage(fmt === "jpeg" ? "jpeg" : "png")
    const buf = await buffer
    console.log(`[generate.ts] Image generated, size: ${buf.length} bytes`)
    console.log(`[generate.ts] Receipt ID: ${data.id}`)
    
    res.setHeader("Content-Type", fmt === "jpeg" ? "image/jpeg" : "image/png")
    res.send(buf)
  } catch (error: any) {
    console.error("[generate.ts] Error:", error.message)
    console.error("[generate.ts] Stack:", error.stack)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
}
