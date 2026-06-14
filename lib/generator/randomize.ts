const PRODUCTS = ["Item A", "Item B", "Item C", "Item D", "Item E", "Item F"]
const rand = (min: number, max: number) => Math.random() * (max - min) + min
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

export function randomReceipt() {
  const n = Math.floor(rand(2, 8))
  const items = Array.from({ length: n }, () => {
    const qty = Math.floor(rand(1, 4))
    const price = Math.round(rand(5000, 90000) / 500) * 500
    return { name: pick(PRODUCTS), qty, price, line: qty * price }
  })
  const subtotal = items.reduce((s, it) => s + it.line, 0)
  const tax = Math.round(subtotal * 0.11)
  return {
    id: `TEST-${Date.now()}-${Math.floor(rand(1000, 9999))}`,
    items, subtotal, tax, total: subtotal + tax,
    issuedAt: new Date().toISOString(),
  }
}
