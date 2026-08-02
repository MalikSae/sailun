# Sailun Community Platform

Platform community commerce untuk Sailun Tire Indonesia × komunitas Mercedes-Benz Indonesia. Platform ini memfasilitasi loop bisnis inti: dari pengajuan sponsorship oleh klub, approval oleh brand, distribusi invitation event, registrasi member dengan QR Card, hingga konfirmasi transaksi oleh dealer dan sistem poin/referral yang terintegrasi.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) dengan TypeScript
- **Database:** MySQL (InnoDB)
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth v5) dengan role-based session
- **Styling:** Tailwind CSS (dengan tema 1:1 dari dokumen desain)
- **Icons:** lucide-react
- **QR:** qrcode (server), html5-qrcode (client)

## 📋 Prasyarat

- Node.js (v18+)
- MySQL (v8.0+)
- npm / pnpm / yarn

## 🚀 Langkah Setup Lokal

1. **Clone repository**
   ```bash
   git clone https://github.com/MalikSae/sailun.git
   cd sailun
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Copy `.env.example` ke `.env` lalu sesuaikan konfigurasi Anda (database credentials, NextAuth secret, dll):
   ```bash
   cp .env.example .env
   ```

4. **Jalankan migrasi Prisma & Seed database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Jalankan dev server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.

## 📖 Dokumen Governance (Wajib Dibaca)

Pengembangan proyek ini sangat bergantung pada standar dokumen berikut yang berada di root folder:

- **`PRD.md`**: Dokumen Product Requirements (Sumber kebenaran untuk kebutuhan dan spesifikasi bisnis).
- **`Workflow.md`**: Penjabaran workflow langkah-demi-langkah (alur user flow dari hulu ke hilir).
- **`Design.md`**: Sumber kebenaran untuk desain (colors, typography, components, dll). Segala pengembangan UI wajib mengikuti pedoman token ini.
- **`AGENTS.md`**: Panduan kerja wajib untuk AI/Agent dan developer. Ini adalah konteks tetap untuk proyek yang mendikte standar teknis (struktur folder, entitas data, aturan poin, dll).
- **`Sprint.md`**: Catatan riwayat sprint/pekerjaan yang sudah dilakukan.

Developer baru wajib membaca dan mengikuti pedoman di dokumen-dokumen di atas sebelum membuat perubahan kode apapun.

## ☁️ Deployment Target

- **OS/Panel:** VPS + aaPanel
- **Process Manager:** PM2 (via Node.js Manager aaPanel)
- **Web Server:** Nginx (Reverse proxy)

*(Tidak ditujukan untuk Vercel, sehingga semua arsitektur meminimalisir dependensi proprietary Vercel).*
