const rand = (mn: number, mx: number) => Math.random() * (mx - mn) + mn
const ri = (mn: number, mx: number) => Math.floor(rand(mn, mx + 1))
const pick = <T,>(a: T[]) => a[ri(0, a.length - 1)]

const STORE_TYPES = ["DEPOT KUE", "TOKO SEMBAKO", "MINIMARKET", "SUPERMARKET"]
const STORE_NAMES = ["UTARA MANDIRI", "JAYA ABADI", "MAJU BERSAMA", "SEJAHTERA", "HARAPAN INDAH"]
const CITIES = ["LAMPUNG", "SURABAYA", "BANDUNG", "MEDAN", "MAKASSAR", "SEMARANG"]
const STREETS = ["Kebun Merdeka", "Raya Industri", "Pasar Baru", "Intan Permai", "Jendral Ahmad"]
const KECAMATAN = ["Rawa", "Indah", "Makmur", "Jaya", "Permai", "Utama"]
const KABUPATEN = ["Bukit Permai", "Ciamis", "Subang", "Gowa", "Demak"]
const PROVINCES = ["Nusa Tenggara Timur", "Jawa Barat", "Jawa Tengah", "Sumatera Selatan"]
const GERAI_TYPES = ["GERAI RETAIL", "GERAI SEMBAKO", "TOKO MODERN"]
const AREA_STORES = ["Toko Kelontong", "Supermarket", "Minimarket"]
const AREAS = ["Jawa Barat", "Jawa Timur", "Papua", "Kalimantan", "Sulawesi"]
const PAYMENT = ["Tunai", "QRIS", "Kartu Debit", "Transfer Bank"]

const PRODUCTS = [
  { name: "TEPUNG TERIGU PASARKITA RASA RENDANG 450 G RENTENG", cat: "Sembako", price: 25000 },
  { name: "PELANGISARI PASTA GIGI EDISI TORAJA RUMPUT LAUT 125 ML", cat: "Perawatan Diri", price: 13000 },
  { name: "TEDUHCARE COKELAT BATANG ORIGINAL 150 G KALENG", cat: "Snack", price: 10000 },
  { name: "SUSUBUMI PEMPEK BEKU 6 PCS WANGI KEMASAN STRIP", cat: "Frozen Food", price: 32500 },
  { name: "BERAS PULEN HARUM PREMIUM 5 KG", cat: "Sembako", price: 68000 },
  { name: "MIE INSTAN GORENG SPESIAL ISI 5 PCS", cat: "Sembako", price: 15000 },
  { name: "SABUN CAIR ANTIBAKTERI LAVENDER 400 ML", cat: "Perawatan Diri", price: 22000 },
  { name: "KOPI SUSU SACHET PREMIUM ISI 10", cat: "Minuman", price: 18000 },
  { name: "ROTI TAWAR GANDUM UTUH 400 G", cat: "Roti & Kue", price: 14500 },
  { name: "MINYAK GORENG SAWIT KEMASAN 1 LITER", cat: "Sembako", price: 19000 },
]

function receiptCode(d: Date) {
  const dd = d.toISOString().slice(0, 10).replace(/-/g, "")
  const num = String(ri(100000, 999999))
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `STK-IDN-PA-PLK-${dd}-${num}-${rnd}`
}

export function randomReceipt() {
  const now = new Date()
  const n = ri(2, 5)
  const items = Array.from({ length: n }, () => {
    const p = pick(PRODUCTS)
    const qty = ri(1, 4)
    const serial = String(ri(1000000, 9999999))
    return { name: `${p.name} SERI ${serial}`, cat: p.cat, price: p.price, qty, line: qty * p.price }
  })
  const subtotal = items.reduce((s, it) => s + it.line, 0)
  const diskon = Math.round(subtotal * ri(1, 5) / 100 / 100) * 100
  const tax = Math.round((subtotal - diskon) * 0.077)
  const ongkir = ri(0, 1) ? ri(52, 500) : 0
  const total = subtotal - diskon + tax + ongkir
  const kodeStruk = receiptCode(now)
  const timeStr = [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()),
  ].join("/") + " " + [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join(".")
  const payment = pick(PAYMENT)
  return {
    id: `ORD-${now.getFullYear()}-${String(ri(100000, 999999))}`,
    kodeStruk,
    storeLabel: pick(GERAI_TYPES),
    storeName: `${pick(STORE_TYPES)} ${pick(STORE_NAMES)}`,
    storeNumber: String(ri(100, 9999)).padStart(4, "0"),
    city: pick(CITIES),
    address: `Jalan ${pick(STREETS)} No. ${ri(1, 999)}`,
    kecamatan: pick(KECAMATAN),
    kabupaten: pick(KABUPATEN),
    province: pick(PROVINCES),
    postal: String(ri(10000, 99999)),
    telp: `0800-00${ri(10, 99)}-${ri(1000, 9999)}`,
    areaStore: pick(AREA_STORES),
    areaName: pick(AREAS),
    orderId: `ORD-${now.getFullYear()}-${String(ri(100000, 999999))}`,
    kasir: `Kasir ${String(ri(1, 10)).padStart(2, "0")}`,
    member: `MBR-${ri(1000, 9999)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    tanggal: timeStr,
    items,
    subtotal, diskon, tax, ongkir, total,
    payment,
    payStatus: payment === "Tunai" ? "Menunggu Bayar" : "Lunas",
    shipCode: `SHP-INHOUSE-${now.getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    issuedAt: now.toISOString(),
  }
}
