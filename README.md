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

## 🚀 Instalasi di VPS + aaPanel (Production)

Target deployment resmi proyek ini adalah **VPS + aaPanel** dengan project ditempatkan di root situs `/www/wwwroot/`. Arsitektur produksi: **Nginx (reverse proxy)** → **Node.js via PM2** (mode `standalone`) → **MySQL** (dikelola aaPanel).

### 1. Install aaPanel di VPS

Kebutuhan minimum: VPS dengan **Ubuntu 20.04+ / Debian 11+ / CentOS 7.9+**, akses root, dan 2 GB RAM.

```bash
# Ubuntu / Debian
wget -O install.sh https://www.aapanel.com/script/install_7.0_en.sh && sudo bash install.sh aapanel

# CentOS
yum install -y wget && wget -O install.sh https://www.aapanel.com/script/install_7.0_en.sh && bash install.sh aapanel
```

> Catatan: versi script instalasi dapat berubah sewaktu-waktu — cek halaman resmi **https://www.aapanel.com** untuk script terbaru. Setelah selesai, catat URL panel + username/password yang tampil, buka di browser, lalu login.

### 2. Install Nginx, MySQL, dan Node.js

Di panel (menu **App Store**):

1. **Nginx** — install versi terbaru (1.24+).
2. **MySQL** — install **MySQL 8.x** (wajib InnoDB untuk dukungan transaction/ACID ledger poin — jangan MyISAM).
3. **Node.js** — install plugin **Node.js Manager**, lalu install **Node 20 LTS** (Next.js 16 butuh Node 20.9+). PM2 sudah termasuk di plugin ini.

### 3. Deploy project ke `/www/wwwroot/`

Letakkan project di root situs aaPanel (`/www/wwwroot/`):

```bash
cd /www/wwwroot
git clone https://github.com/MalikSae/sailun.git
cd sailun
npm install
```

### 4. Buat database & konfigurasi `.env`

1. Di aaPanel: **Database → Add Database** — buat database `sailun_community` beserta user/password-nya.
2. Siapkan file env:
   ```bash
   cp .env.example .env
   nano .env
   ```
3. Sesuaikan isinya:
   ```env
   DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/sailun_community"
   NEXTAUTH_SECRET="<generate acak: openssl rand -base64 32>"
   NEXTAUTH_URL="https://demo.sailuncommunity.id"
   AUTH_URL="https://demo.sailuncommunity.id"
   UPLOAD_DIR="/public/uploads"
   ```
   Ganti `demo.sailuncommunity.id` dengan domain Anda, dan buat `NEXTAUTH_SECRET` via `openssl rand -base64 32`.

### 5. Jalankan migrasi & seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

Seed membuat akun admin default: **`admin@sailun.id` / `admin123`** — wajib diganti setelah login pertama.

### 6. Build production (mode standalone)

```bash
npm run build
```

### 7. Jalankan via PM2

`next.config.ts` memakai `output: "standalone"`, jadi hasil build berupa server mandiri di `.next/standalone`. Folder statis harus disalin agar semua aset ter-serve dengan benar:

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
pm2 start .next/standalone/server.js --name sailun --cwd /www/wwwroot/sailun
pm2 save
pm2 startup   # jalankan perintah setup systemd yang ditampilkan
```

Cek status dengan `pm2 status` — harus `online`. Aplikasi berjalan di port **3000** (ubah via env `PORT` bila perlu).

### 8. Reverse proxy Nginx (aaPanel)

1. **Website → Add Site**: isi domain Anda, root directory `sailun`, database **skip** (sudah dibuat di langkah 4).
2. Buka konfigurasi situs (`/www/server/panel/vhost/nginx/<domain>.conf`) lalu ganti isi `location /` dengan:

   ```nginx
   client_max_body_size 20m;

   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

   `client_max_body_size 20m` **wajib** — sesuai batas upload logo/proposal (20mb) di server action. Header `Upgrade`/`Connection` wajib agar WebSocket (mode development) tidak gagal handshake.
3. **SSL** (tab SSL pada situs): pasang sertifikat **Let's Encrypt** gratis → HTTPS aktif otomatis. Diperhatikan: kamera untuk QR scanner di layar dealer **wajib HTTPS** (tidak berfungsi di HTTP selain localhost).

### 9. Verifikasi & maintenance

- Buka `https://domain` → login sebagai admin → pastikan loop inti berjalan: klub → approval → event → registrasi member → transaksi dealer → poin/referral.
- **Backup rutin** folder `/www/wwwroot/sailun/public/uploads` (logo & proposal tersimpan di filesystem lokal, tidak ada redundansi cloud — lihat AGENTS.md §11).
- Update kode berikutnya:
  ```bash
  git pull && npm install && npx prisma migrate deploy && npm run build && pm2 restart sailun
  ```

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
