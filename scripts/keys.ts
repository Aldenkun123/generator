import { generateKeyPairSync } from "node:crypto"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const priv = privateKey.export({ type: "pkcs8", format: "pem" }).toString()
const pub = publicKey.export({ type: "spki", format: "pem" }).toString()

console.log("\n=== Tambahkan ke Vercel Environment Variables ===\n")
console.log("RECEIPT_PRIVATE_KEY=\n" + priv)
console.log("RECEIPT_PUBLIC_KEY=\n" + pub)
console.log("Catatan: JANGAN commit private key ke GitHub.")
