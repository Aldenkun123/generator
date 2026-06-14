import { generateKeyPairSync } from "node:crypto"
import * as fs from "node:fs"

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const priv = privateKey.export({ type: "pkcs8", format: "pem" }).toString()
const pub = publicKey.export({ type: "spki", format: "pem" }).toString()

// Tulis ke file
fs.writeFileSync('/tmp/receipt_keys.txt', `RECEIPT_PRIVATE_KEY=${priv}

RECEIPT_PUBLIC_KEY=${pub}
`)

console.log("Keys saved to /tmp/receipt_keys.txt")
console.log("Public Key:", pub)
