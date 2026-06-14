import { renderReceiptPdf } from "./lib/generator/pdf.js"
import { writeFileSync } from "fs"

async function test() {
  try {
    console.log("Generating PDF receipt...")
    const buffer = await renderReceiptPdf()
    
    writeFileSync("/tmp/test_receipt.pdf", buffer)
    
    console.log("✓ PDF generated successfully!")
    console.log("Saved to: /tmp/test_receipt.pdf")
    console.log("Size:", buffer.length, "bytes")
  } catch (err) {
    console.error("✗ Error:", err.message)
    console.error(err.stack)
  }
}

test()
