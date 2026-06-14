import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const dir = join(process.cwd(), "fonts")
const reg = readFileSync(join(dir, "Roboto-Regular.ttf")).toString("base64")
const bold = readFileSync(join(dir, "Roboto-Bold.ttf")).toString("base64")

mkdirSync(join(process.cwd(), "lib"), { recursive: true })
writeFileSync(
  join(process.cwd(), "lib", "fonts.ts"),
  `// AUTO-GENERATED — jangan edit manual
export const ROBOTO_REGULAR_B64 = "${reg}"
export const ROBOTO_BOLD_B64 = "${bold}"
`
)
console.log("lib/fonts.ts dibuat. Regular:", reg.length, "| Bold:", bold.length, "chars")
