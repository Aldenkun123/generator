import type { VercelRequest, VercelResponse } from "@vercel/node"
import { verifySigned } from "../lib/signature/verify"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "use POST" })
    return
  }
  const ok = verifySigned(req.body)
  res.json({ valid: ok })
}
