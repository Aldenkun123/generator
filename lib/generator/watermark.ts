import type { SKRSContext2D } from "@napi-rs/canvas"

export function drawWatermark(ctx: SKRSContext2D, w: number, h: number) {
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(-Math.PI / 6)
  ctx.globalAlpha = 0.18
  ctx.fillStyle = "#d00"
  ctx.font = "bold 48px sans-serif"
  ctx.textAlign = "center"
  for (let i = -2; i <= 2; i++) ctx.fillText("SYNTHETIC • TEST ONLY", 0, i * 120)
  ctx.restore()
}
