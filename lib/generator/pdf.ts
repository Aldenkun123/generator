import PDFDocument from "pdfkit"
import { randomReceipt } from "./randomize"

export function renderReceiptPdf(): Promise<Buffer> {
  const data = randomReceipt()
  const doc = new PDFDocument({ size: [360, 560], margin: 24 })
  const chunks: Buffer[] = []
  return new Promise((resolve) => {
    doc.on("data", (c) => chunks.push(c as Buffer))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.fontSize(14).text("DEMO STORE (SYNTHETIC)", { align: "center" })
    doc.moveDown().fontSize(9).text(`ID: ${data.id}`)
    doc.text(`Date: ${data.issuedAt}`).moveDown()
    data.items.forEach((it) => doc.text(`${it.qty}x ${it.name}   Rp${it.line.toLocaleString("id-ID")}`))
    doc.moveDown().text(`TOTAL Rp${data.total.toLocaleString("id-ID")}`, { align: "right" })
    doc.save().rotate(-30, { origin: [180, 280] }).fillOpacity(0.18).fontSize(28).fillColor("red")
      .text("SYNTHETIC • TEST ONLY", 10, 260).restore()
    doc.end()
  })
}
