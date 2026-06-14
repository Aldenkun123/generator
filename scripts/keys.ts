import { generateKeyPairSync } from "node:crypto"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const priv = privateKey.export({ type: "pkcs8", format: "pem" }).toString()
const pub = publicKey.export({ type: "spki", format: "pem" }).toString()

// Encode Base64 supaya aman di env var (tidak ada newline)
const privB64 = Buffer.from(priv).toString("base64")
const pubB64 = Buffer.from(pub).toString("base64")

console.log("\n=== Tambahkan ke Vercel Environment Variables ===\n")
console.log("RECEIPT_PRIVATE_KEY=" + privB64)
console.log("\nRECEIPT_PUBLIC_KEY=" + pubB64)
console.log("\nPaste apa adanya — ini Base64, satu baris, tanpa spasi.")
