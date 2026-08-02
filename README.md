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

## 🚀 Instalasi di VPS + aaPanel (Production) — Step-by-Step

Target deployment resmi proyek ini adalah **VPS + aaPanel** dengan project ditempatkan di root situs `/www/wwwroot/`. Arsitektur produksi: **Nginx (reverse proxy)** → **Node.js via PM2** (mode `standalone`) → **MySQL** (dikelola aaPanel). Panduan ini mengasumsikan **aaPanel sudah terinstall** — mulai dari clone sampai aplikasi hidup di `https://sailun.nalaros.my.id`.

### 1. Siapkan DNS (record A)

Di panel DNS domain `nalaros.my.id` (registrar/Cloudflare), buat record:

| Tipe | Name | Value |
|---|---|---|
| A | `sailun` | `<IP_VPS>` |

Cek propagasinya dari komputer Anda:

```bash
ping sailun.nalaros.my.id
nslookup sailun.nalaros.my.id
```

Harus sudah merespons ke IP VPS sebelum lanjut ke langkah Nginx (langkah 8).

### 2. Install Nginx, MySQL, dan Node.js di aaPanel

Buka panel aaPanel (menu **App Store**):

1. **Nginx** → Install versi terbaru (1.24+).
2. **MySQL** → Install **MySQL 8.x** (wajib InnoDB untuk dukungan transaction/ACID ledger poin — jangan MyISAM).
3. **Node.js** → Install plugin **Node.js Manager**, lalu install **Node 20 LTS** (Next.js 16 butuh Node 20.9+).
4. Buka **Node.js Manager → PM2 Manager** → install **PM2** (atau jalankan `npm install -g pm2` via SSH).

### 3. Deploy project (clone ke `/www/wwwroot/`)

SSH ke VPS sebagai root, lalu:

```bash
cd /www/wwwroot
git clone https://github.com/MalikSae/sailun.git
cd sailun
npm install
```

### 4. Buat database (lewat UI aaPanel)

1. Menu **Database → Add Database**.
2. Isi:
   - **Database name:** `sailun_community`
   - **Username:** `sailun_user` (bebas, jangan root)
   - **Password:** bebas, tapi kuat (dipakai di `.env`)
   - **Note (opsional):** `sailun`
3. Klik **Submit** — catat nama DB, user, dan password.

### 5. Konfigurasi `.env`

```bash
cp .env.example .env
nano .env
```

Isi sesuai data yang sudah dibuat:

```env
DATABASE_URL="mysql://sailun_user:PASSWORD_ANDA@localhost:3306/sailun_community"
NEXTAUTH_SECRET="<generate acak: openssl rand -base64 32>"
NEXTAUTH_URL="https://sailun.nalaros.my.id"
AUTH_URL="https://sailun.nalaros.my.id"
UPLOAD_DIR="/public/uploads"
```

Catatan:
- Ganti `PASSWORD_ANDA` dengan password database dari langkah 4.
- Generate `NEXTAUTH_SECRET` dengan perintah `openssl rand -base64 32`.
- `NEXTAUTH_URL`/`AUTH_URL` pakai domain final (HTTPS) — jangan `localhost`.

### 6. Jalankan migrasi & seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

Seed membuat akun admin default: **`admin@sailun.id` / `admin123`** — wajib diganti setelah login pertama.

### 7. Build production (mode standalone)

```bash
npm run build
```

### 8. Jalankan via PM2

`next.config.ts` memakai `output: "standalone"`, jadi hasil build berupa server mandiri di `.next/standalone`. Folder statis wajib disalin agar semua aset (gambar, QR, dsb) ter-serve:

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

Repo sudah menyertakan `ecosystem.config.js` yang menjalankan server standalone dengan flag `--env-file=.env` — ini memastikan `.env` di project root **selalu terbaca** (mode standalone tidak memuat `.env` sendiri secara andal), sehingga semua pengaturan (database, auth, port) dikendalikan dari satu file `.env`:

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "sailun",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      interpreter: "node",
      interpreter_args: "--env-file=.env",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production", HOSTNAME: "0.0.0.0" },
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # jalankan perintah setup systemd yang ditampilkan
```

Cek:

```bash
pm2 status          # harus "online"
pm2 logs sailun     # lihat log/error kalau ada
```

**Port bebas diganti** — default 3000, cukup tambahkan di `.env`:

```env
PORT=3001
```

lalu `pm2 restart sailun` (jangan lupa sesuaikan `proxy_pass` di Nginx langkah 9). Syarat: Node.js ≥ 20.6 (dibutuhkan flag `--env-file`).

> **Alternatif lewat UI aaPanel:** Node.js Manager → PM2 Manager → **Add Project** → Project path `/www/wwwroot/sailun` → Run command `./node_modules/.bin/next start` (bukan mode standalone), atau tetap pakai CLI di atas agar dapat mode `standalone` yang lebih ringan.

### 9. Buat situs Nginx + reverse proxy (aaPanel)

1. Menu **Website → Add Site**:
   - **Domain:** `sailun.nalaros.my.id`
   - **Root directory:** biarkan default (`/www/wwwroot/sailun`)
   - **Database:** skip (sudah dibuat di langkah 4)
   - **PHP version:** skip / tidak dipakai
   - **SSL:** skip (dipasang di langkah 10)
2. Setelah situs jadi, buka **Website → sailun.nalaros.my.id → Config** (atau edit langsung file `/www/server/panel/vhost/nginx/sailun.nalaros.my.id.conf`).
3. Ganti seluruh isi `server { }` dengan:

   ```nginx
   server {
       listen 80;
       server_name sailun.nalaros.my.id;
       index index.html index.htm;
       root /www/wwwroot/sailun;

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
   }
   ```

   Keterangan:
   - `client_max_body_size 20m` **wajib** — sesuai batas upload logo/proposal (20mb) di server action.
   - Header `Upgrade`/`Connection` wajib agar WebSocket (mode development) tidak gagal handshake.
4. Klik **Save** lalu **Reload** Nginx (atau `nginx -s reload` via SSH).

### 10. Pasang SSL Let's Encrypt (aaPanel)

1. **Website → sailun.nalaros.my.id → SSL**.
2. Pilih **Let's Encrypt**, centang domain `sailun.nalaros.my.id`, klik **Apply**.
3. Aktifkan **Force HTTPS** (paksa redirect HTTP → HTTPS). Ini penting karena kamera QR scanner di layar dealer **wajib HTTPS** (tidak berfungsi di HTTP selain localhost).

### 11. Verifikasi akhir

1. Buka `https://sailun.nalaros.my.id` → harus tampil halaman landing.
2. Login sebagai admin (`admin@sailun.id` / `admin123`), lalu ganti password.
3. Pastikan loop inti berjalan: klub → approval → event → registrasi member → transaksi dealer → poin/referral.

**Troubleshooting cepat:**

| Gejala | Cek |
|---|---|
| Error 502 Bad Gateway | `pm2 status` (app mati?) → `pm2 logs sailun` |
| Upload logo gagal | `client_max_body_size` sudah 20m? Folder `public/uploads` writable? |
| Error 500 / Prisma | `DATABASE_URL` di `.env` benar? Database sudah dibuat di langkah 4? |
| Kamera QR tidak jalan | Pastikan sudah HTTPS (langkah 10) |

### 12. Update kode berikutnya (deploy ulang)

```bash
cd /www/wwwroot/sailun
git pull && npm install && npx prisma migrate deploy && npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
pm2 restart sailun
```

> **Backup rutin** folder `/www/wwwroot/sailun/public/uploads` (logo & proposal tersimpan di filesystem lokal, tidak ada redundansi cloud — lihat AGENTS.md §11).

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
