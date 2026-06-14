import sharp from "sharp"

export type TamperOp =
  | "recompress" | "crop" | "contrast" | "rotate" | "noise" | "copyMovePatch"

export async function applyTamper(input: Buffer, op: TamperOp): Promise<Buffer> {
  const img = sharp(input)
  switch (op) {
    case "recompress": return img.jpeg({ quality: 35 }).toBuffer()
    case "crop": {
      const m = await img.metadata()
      return img.extract({ left: 0, top: 0, width: Math.floor((m.width ?? 100) * 0.85), height: Math.floor((m.height ?? 100) * 0.9) }).toBuffer()
    }
    case "contrast": return img.linear(1.4, -30).toBuffer()
    case "rotate": return img.rotate(3, { background: "#fff" }).toBuffer()
    case "noise": return img.blur(0.4).modulate({ brightness: 1.05 }).toBuffer()
    case "copyMovePatch": {
      const m = await img.metadata()
      const w = Math.floor((m.width ?? 100) * 0.3)
      const patch = await sharp(input).extract({ left: 10, top: 10, width: w, height: 40 }).toBuffer()
      return img.composite([{ input: patch, left: 40, top: 200 }]).toBuffer()
    }
  }
}

export const ALL_OPS: TamperOp[] = ["recompress", "crop", "contrast", "rotate", "noise", "copyMovePatch"]
