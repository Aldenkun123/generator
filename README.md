# Receipt Test Kit (Vercel)

Synthetic (watermarked) receipt generator + tamper harness + Ed25519 QR signature
untuk menguji detektor keaslian struk. Output selalu bertanda SYNTHETIC/TEST.

## Deploy
1. npm i
2. npm run keys           # salin RECEIPT_PRIVATE_KEY & RECEIPT_PUBLIC_KEY
3. Import repo ke Vercel, isi 2 env var tsb, lalu Deploy.

## Endpoint
- GET  /api/generate?format=png|jpeg|pdf
- GET  /api/tamper?op=recompress|crop|contrast|rotate|noise|copyMovePatch
- POST /api/verify   { payload, sig }
