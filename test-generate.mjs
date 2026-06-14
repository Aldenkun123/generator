import { renderReceiptImage } from "./lib/generator/receipt.js"

async function test() {
  try {
    console.log("Generating receipt...")
    const { data, buffer } = await renderReceiptImage("png")
    
    // Simpan ke file
    const fs = await import("fs")
    fs.writeFileSync("/tmp/test_receipt.png", await buffer)
    
    console.log("✓ Receipt generated successfully!")
    console.log("Saved to: /tmp/test_receipt.png")
    console.log("Size:", (await buffer).length, "bytes")
    console.log("\nData:", JSON.stringify(data, null, 2).slice(0, 500))
  } catch (err) {
    console.error("✗ Error:", err.message)
    console.error(err.stack)
  }
}

test()
