import { sign as edSign, createPrivateKey } from "node:crypto"
import QRCode from "qrcode"

export type ReceiptPayload = {
  id: string
  issuer: string
  total: number
  currency: string
  issuedAt: string
  synthetic: true
}

// Decode Base64 → PEM. Ini yang fix error ERR_OSSL_UNSUPPORTED.
function loadPem(envName: string): string {
  const v = process.env[envName]
  if (!v) throw new Error(`Missing env var: ${envName}`)
  return Buffer.from(v, "base64").toString("utf-8")
}

export function canonical(obj: Record<string, unknown>) {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

export function signPayload(payload: ReceiptPayload) {
  const key = createPrivateKey(loadPem("RECEIPT_PRIVATE_KEY"))
  const sig = edSign(null, Buffer.from(canonical(payload)), key).toString("base64url")
  return { payload, sig }
}

export async function signedQrDataUrl(payload: ReceiptPayload) {
  return QRCode.toDataURL(JSON.stringify(signPayload(payload)), { errorCorrectionLevel: "M" })
}
