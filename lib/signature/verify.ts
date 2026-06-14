import { verify as edVerify, createPublicKey } from "node:crypto"
import { canonical, type ReceiptPayload } from "./sign"

export function verifySigned(data: { payload: ReceiptPayload; sig: string }): boolean {
  try {
    const pem = (process.env.RECEIPT_PUBLIC_KEY ?? "").replace(/\\n/g, "\n")
    const key = createPublicKey(pem)
    return edVerify(null, Buffer.from(canonical(data.payload)), key, Buffer.from(data.sig, "base64url"))
  } catch {
    return false
  }
}
