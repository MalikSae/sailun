# AGENTS.md — Panduan Kerja untuk Antigravity

Dokumen ini adalah **konteks tetap** yang harus dibaca dan dipatuhi Antigravity (atau coding agent lain) setiap kali mengerjakan project **Sailun Community Platform**. Simpan file ini di root repository.

> **Sumber kebenaran (source of truth) untuk kebutuhan produk**: `PRD.md` dan `Workflow.md`. **Sumber kebenaran untuk warna, tipografi, dan komponen UI**: `Design.md`. Jika ada instruksi di chat yang bertentangan dengan dokumen-dokumen itu, tanyakan dulu ke user sebelum melanjutkan — jangan asumsikan sendiri.

---

## 1. Ringkasan Proyek

Platform community commerce untuk Sailun Tire Indonesia × komunitas Mercedes-Benz Indonesia. Loop inti yang **wajib berjalan mulus end-to-end**:

```
Klub ajukan sponsorship → Admin approve → halaman invitation event ter-generate
→ Member registrasi & dapat QR card → Member belanja di dealer
→ Dealer scan QR & konfirmasi transaksi → diskon langsung + poin referral/klub otomatis
→ Redeem poin (approval admin) → semua data terlihat di dashboard admin
```

4 peran pengguna: **Admin/Brand**, **Klub**, **Member**, **Dealer**. Semua reward berbentuk **poin** (bukan uang riil) di MVP ini — kecuali diskon member yang tetap potongan harga langsung di kasir.

---

## 2. Tech Stack (Definitif — Jangan Diganti Tanpa Persetujuan)

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js** (App Router) | TypeScript wajib, bukan JavaScript biasa |
| Database | **MySQL** (InnoDB) | Wajib InnoDB untuk dukungan transaction/ACID — jangan pakai MyISAM |
| ORM | **Prisma** | Migration, type-safety, dan `$transaction` untuk operasi atomik ledger poin |
| Auth | **Auth.js (NextAuth v5)** dengan Credentials Provider | Role-based session (admin/klub/dealer/member) |
| Styling | **Tailwind CSS** | Theme di `tailwind.config.js` **wajib** dipetakan 1:1 dari token `Design.md` — lihat §3.1 |
| Icon | **lucide-react** | Icon library resmi — dipakai di seluruh UI, bukan emoji (§3.2) |
| Image processing | **sharp** | Untuk auto-compress/resize logo klub saat upload |
| QR generate | **qrcode** (npm) | Generate QR card member sisi server |
| QR scan | **html5-qrcode** atau **@zxing/browser** | Sisi client, akses kamera browser di layar dealer |
| Process manager (produksi) | **PM2** | Dikelola lewat aaPanel Node.js Manager |
| Reverse proxy | **Nginx** (via aaPanel) | Bukan Vercel |

### Yang secara eksplisit TIDAK dipakai
- ❌ Vercel Blob Storage, Vercel Image Optimization API, Vercel Edge Runtime/Middleware — target deploy adalah **VPS + aaPanel**, bukan Vercel. Fitur proprietary ini tidak portabel.
- ❌ Database NoSQL murni (Firestore, dsb.) untuk data transaksi/poin — modul ledger butuh relasional + ACID.
- ❌ ORM lain (TypeORM, Sequelize, Drizzle) kecuali disetujui ulang — konsistensi tim lebih penting daripada preferensi.

---

## 3. Struktur Folder (Konvensi)

```
/app
  /(public)/              → landing page, formulir pengajuan, halaman invitation
  /(auth)/                → login, register
  /(admin)/                → dashboard admin, approval, manajemen
  /(club)/                 → dashboard klub
  /(member)/                → dashboard member, QR card
  /(dealer)/                → scan QR, input transaksi
  /api/                     → route handlers (jika tidak pakai Server Actions)
/components
  /ui/                      → komponen reusable (button, table, form)
  /{role}/                  → komponen spesifik per role
/lib
  /db.ts                    → Prisma client singleton
  /auth.ts                  → konfigurasi Auth.js
  /points.ts                → SEMUA logika ledger poin terpusat di sini (lihat §5)
  /upload.ts                → helper compress & simpan file
/prisma
  /schema.prisma
  /migrations/
/public/uploads              → storage lokal (logo klub, dsb.) — lihat §7
```

**Aturan**: logika bisnis kritis (distribusi poin, void, redeem) **harus** melalui fungsi terpusat di `/lib/points.ts` — jangan tulis ulang logic yang sama di banyak route/component secara terpisah. Ini mencegah inkonsistensi saat aturan poin berubah.

> **KRITIS — route group TIDAK menghasilkan prefix URL (ditemukan sebagai build-breaking bug di Fase 6-7).** Folder `(admin)`, `(club)`, `(member)`, `(dealer)` di Next.js App Router **diabaikan** saat membentuk URL — dipakai murni untuk mengelompokkan layout. Ini artinya `app/(admin)/dashboard/page.tsx` dan `app/(club)/dashboard/page.tsx` **SAMA-SAMA** menghasilkan URL `/dashboard` dan Next.js akan **menolak build total** ("two parallel pages resolve to the same path"). ATURAN WAJIB: setiap halaman di dalam route group role manapun **HARUS** punya folder literal bernama role tersebut sebagai segment URL nyata — pola yang benar:
> ```
> app/(admin)/admin/dashboard/page.tsx   → URL: /admin/dashboard
> app/(admin)/admin/approval/page.tsx    → URL: /admin/approval
> app/(club)/club/dashboard/page.tsx     → URL: /club/dashboard
> app/(member)/member/dashboard/page.tsx → URL: /member/dashboard (atau app/member/ literal, sama hasilnya)
> app/(dealer)/dealer/scan/page.tsx      → URL: /dealer/scan
> ```
> **TIDAK ADA PENGECUALIAN** — termasuk halaman yang namanya terasa unik saat ini (mis. `/approval`), karena nama yang unik sekarang bisa collide nanti begitu role lain kebetulan pakai nama serupa. Konsistensi penuh dari awal mencegah build error berulang. Sebelum membuat page.tsx baru di role manapun, PASTIKAN sudah ada di dalam folder literal `{role}/` — bukan langsung di root route group.

---

## 3.1 Aturan Styling & Design Token — WAJIB DIPATUHI DI SETIAP IMPLEMENTASI

Sumber kebenaran untuk seluruh warna, tipografi, radius, spacing, dan komponen UI adalah **`Design.md`**. Dua aturan berikut tidak bisa ditawar:

### Aturan 1 — Tidak ada warna hardcoded

- [ ] **Dilarang** menulis hex/rgb/hsl langsung di kode (`className="bg-[#FF7A1A]"`, `style={{ color: '#0A1F3D' }}`, CSS custom dengan hex literal, dsb).
- [ ] Semua warna **wajib** diakses lewat token Tailwind yang sudah dipetakan dari `Design.md`, bukan nilai arbitrary Tailwind (`bg-[#...]`).
- [ ] Token warna didefinisikan **satu kali** di `tailwind.config.js` (via `theme.extend.colors`) dan/atau `app/globals.css` (via CSS custom properties), lalu dipakai ulang di seluruh komponen.
- [ ] Jika satu warna dibutuhkan tapi belum ada di `Design.md`, **jangan** menambahkannya sendiri secara ad-hoc di komponen — laporkan ke user bahwa token baru dibutuhkan, biar `Design.md` diperbarui dulu sebagai sumber kebenaran, baru dipakai di kode.

Mapping wajib dari `Design.md` v2.0 ke `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: "#F5F3EF",
        card: "#FFFFFF",
        ink: "#15171A",
        body: "#5B5D62",
        muted: "#94969B",
        hairline: "#E7E4DE",
        "hairline-strong": "#D8D4CC",
        graphite: "#0E2A4D",
        "graphite-soft": "#173A63",
        "graphite-text": "#8A9BB5",
        "graphite-text-strong": "#F0F3F8",
        accent: "#F5760F",
        "accent-soft": "#FDEEE0",
        "accent-hover": "#D4640D",
        "on-accent": "#FDFCFA",
        success: "#3F6B4A",
        "success-soft": "#EBF2EC",
        warning: "#9A6B1F",
        "warning-soft": "#FBF1DF",
        danger: "#9B3A34",
        "danger-soft": "#FAECEA",
        info: "#3F5E70",
        "info-soft": "#E8EEF0",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
    },
  },
};
```

> **PENTING — perubahan v2.1**: hanya 7 nilai hex yang berubah dari v2.0 (`graphite`, `graphite-soft`, `graphite-text`, `graphite-text-strong`, `accent`, `accent-soft`, `accent-hover`) — diambil dari deck resmi Sailun untuk warna brand yang lebih otentik. **Nama token TIDAK berubah** (masih `bg-graphite`, `text-accent`, dst — sama seperti v2.0), jadi ini murni ganti nilai di `tailwind.config.js`, TIDAK perlu cari-ganti nama class di seluruh codebase seperti migrasi v1→v2 kemarin. Verifikasi tetap wajib: grep untuk memastikan tidak ada hex lama (`#C6560F`, `#17191C`, dsb) yang ter-hardcode di luar `tailwind.config.js` (kalau ada, itu pelanggaran Aturan 1 yang sudah ada sejak awal, bukan hal baru). 21 token warna lain (canvas, card, ink, body, muted, hairline, success/warning/danger/info + soft variants) TIDAK berubah dari v2.0.

> **PENTING — tambahan v2.2 (gradient-graphite)**: elemen berlatar navy (`sidebar-nav`, `member-qr-card`, `referral-share-card`, `footer`, `qr-scan-viewport`) sekarang WAJIB pakai gradasi, bukan `bg-graphite` solid. Karena Tailwind `colors` tidak bisa menyimpan CSS gradient langsung sebagai warna, implementasikan salah satu cara berikut (pilih satu, konsisten):
> 1. **Tailwind gradient utilities** (disarankan, tanpa CSS custom): `className="bg-gradient-to-br from-graphite to-graphite-soft"` — pastikan arah (`to-br` ≈ 160°) sesuai mockup yang disetujui, sesuaikan ke `to-b`/`to-bl` kalau hasil visualnya lebih dekat ke gradasi asli.
> 2. **CSS custom property** di `app/globals.css`: `--gradient-graphite: linear-gradient(160deg, #0E2A4D 0%, #173A63 100%);` lalu dipakai via `style={{ background: 'var(--gradient-graphite)' }}` di komponen yang membutuhkan — hanya kalau opsi 1 tidak cukup presisi.
>
> JANGAN tulis `linear-gradient(...)` dengan hex literal langsung di className/inline style komponen manapun — itu pelanggaran Aturan 1 (harus lewat token, bukan hardcode). Screenshot kelima komponen di atas setelah diterapkan, bandingkan arah & warna gradasinya dengan `mockup-v2.1-navy-orange-asli.html` yang sudah disetujui.

### Aturan 2 — Wajib pakai komponen standar, bukan elemen ad-hoc

- [ ] Setiap elemen UI berulang (tombol, badge status, kartu, tabel, input, dsb.) **wajib** dibangun sebagai komponen reusable di `/components/ui/` yang mengikuti definisi di `Design.md` §Components (`button-primary`, `status-badge`, `data-table`, `stat-card`, `member-qr-card`, dsb — lihat daftar lengkap di sana).
- [ ] **Dilarang** menulis styling one-off langsung di halaman (`<div className="bg-blue-900 rounded-xl p-4 ...">` yang tidak merujuk komponen manapun) untuk kebutuhan yang sebenarnya sudah punya padanan komponen standar.
- [ ] Sebelum membuat komponen baru, cek dulu apakah kebutuhan itu sudah tercakup salah satu komponen di `Design.md`. Kalau sudah ada → pakai/impor komponen itu. Kalau benar-benar belum ada padanannya → buat komponen baru **mengikuti token yang sudah ditetapkan** (warna, radius, tipografi dari mapping di atas), lalu beri tahu user bahwa komponen baru ini sebaiknya didokumentasikan balik ke `Design.md` agar tidak dibuat ulang berbeda-beda di lain waktu.
- [ ] `status-badge` **wajib** dipakai untuk setiap representasi status (`PENDING`/`APPROVED`/`REJECTED`/`VOIDED`/`FULFILLED`) di seluruh sistem — tidak boleh ada halaman yang menampilkan status sebagai teks polos atau styling warna berbeda sendiri.

### Aturan 3 — Ukuran font wajib scaling per breakpoint, bukan flat di semua device

- [ ] Token display (`display-xl`/`display-lg`/`display-md`/`display-sm`) dan `stat-number` **wajib** diterapkan dengan ukuran berbeda per breakpoint sesuai tabel "Scaling Tipografi per Breakpoint" di `Design.md` §Responsive Behavior. Dilarang memakai satu ukuran font tetap yang identik di mobile dan desktop untuk token-token ini.
- [ ] Token UI kecil (`body-md`/`body-sm`/`caption`/`label-uppercase`/`button`/`nav-link`) tetap **flat** di semua breakpoint sesuai tabel yang sama — jangan diturunkan lebih kecil lagi di mobile, karena berisiko di bawah ambang keterbacaan.
- [ ] Dua teknik implementasi yang diperbolehkan (pilih satu, konsisten dalam satu codebase):
  1. **Tailwind responsive token classes** — varian ukuran per breakpoint didefinisikan sebagai named `fontSize` di `tailwind.config.js` (bukan arbitrary value), dipakai dengan prefix responsif: `className="text-display-xl-mobile md:text-display-xl-tablet lg:text-display-xl"`.
  2. **CSS `clamp()` dalam satu token** — `fontSize` token didefinisikan langsung sebagai `clamp(min, preferred, max)` di `tailwind.config.js`, sehingga satu class (`text-display-xl`) otomatis scaling fluid tanpa perlu prefix responsif di tiap komponen — mengurangi risiko developer lupa menambahkan varian mobile.
- [ ] Jika memilih teknik `clamp()`, titik minimum & maksimum **wajib** sama persis dengan nilai Mobile & Desktop di tabel `Design.md` — bukan angka bebas hasil kira-kira.
- [ ] Verifikasi wajib sebelum klaim selesai: render halaman di lebar viewport <768px dan ≥1024px, pastikan ukuran font token display/stat-number **benar-benar berbeda** secara terukur (bukan cuma container yang menyempit sementara font tetap sama).

### Aturan 4 — Wajib pakai komponen `PageContainer` bersama, bukan lebar manual per halaman

Latar belakang: pola bug lebar konten tidak konsisten terjadi **empat kali berulang** (`/admin/approval/[id]`, `/club/pengajuan/[id]`, `/member/dashboard` — dua kali, sempat "diperbaiki" tapi dicocokkan ke halaman pembanding yang ternyata SALAH juga). Pendekatan "bandingkan manual dengan satu halaman lain" **terbukti tidak cukup** — className bisa diketik ulang berbeda tanpa disadari. Solusinya struktural: satu komponen wrapper, bukan disiplin manual.

- [ ] **Wajib** pakai `components/ui/page-container.tsx` (atau nama yang sudah disepakati saat komponen ini dibuat) untuk membungkus konten SETIAP halaman di route group `(admin)`, `(club)`, `(dealer)`, `member` — **dilarang** menulis `className="max-w-... "` manual langsung di `page.tsx` manapun.
- [ ] Kalau `PageContainer` belum ada saat sesi ini berjalan — itu tandanya belum dibuat, buat dulu (lihat riwayat kerja perbaikan lebar konten terakhir untuk nilai `max-w` yang sudah disepakati sebagai standar), JANGAN lanjut menulis halaman baru dengan lebar manual sambil menunggu.
- [ ] Untuk elemen visual lain (card, badge, tombol, warna, radius) — tetap berlaku Aturan 2 (komponen standar `Design.md`), tidak berubah.
- [ ] Laporan penyelesaian halaman baru **wajib** menyebutkan eksplisit: "menggunakan PageContainer" — bukan lagi "dibandingkan dengan halaman X" (perbandingan manual sudah terbukti gagal mencegah drift).

### Kenapa ini penting
Dengan 4 peran pengguna dan 18 layar (PRD §7), tanpa disiplin ini setiap developer/sesi Antigravity akan cenderung menulis warna & styling sendiri-sendiri per halaman — hasilnya oranye yang sedikit beda rona di satu dashboard dibanding dashboard lain, radius yang tidak konsisten, atau badge status yang terlihat berbeda antara layar admin dan layar klub. Satu sumber token + satu set komponen standar mencegah drift visual ini sejak awal, dan membuat perubahan desain di kemudian hari (mis. update hex resmi brand) menjadi perubahan satu file, bukan proyek cari-ganti manual.

---

## 3.2 Gaya Komunikasi & Laporan — Icon, Bukan Emoji

**Tidak ada emoji** (karakter unicode berwarna seperti ✅ ❌ ⏳ 🎉) di mana pun — baik di UI aplikasi maupun laporan progres Antigravity. Sebagai gantinya:

**Di UI aplikasi**: pakai komponen icon dari **lucide-react** (tambahkan ke dependencies jika belum ada) — ini icon library resmi project, konsisten dengan stack React/Next.js. Contoh: `<CheckCircle />` untuk status berhasil/approved, `<XCircle />` untuk gagal/rejected, `<Clock />` untuk pending, bukan karakter emoji ✅❌⏳ yang ditulis langsung sebagai teks/string.

**Di laporan progres/chat Antigravity** (markdown biasa, tidak bisa render komponen React): pakai sintaks checklist markdown standar — `- [x] Selesai` untuk berhasil, `- [ ] Belum` untuk belum/gagal (opsional tambahkan keterangan setelahnya, mis. `- [ ] Gagal — lihat detail di bawah`). Ini konvensi umum di tooling development, bukan emoji, dan tetap mudah dipindai secara visual.

Untuk tabel status di laporan, kolom status boleh berisi kata singkat ("Berhasil"/"Gagal"/"Pending") DAN tetap gunakan format checklist di ringkasan akhir — dua-duanya boleh dipakai bersamaan, yang dilarang murni simbol emoji berwarna.

---

## 4. Entitas Data Inti (Ringkasan — Detail Lengkap di PRD §7 & Workflow.md)

> **Catatan penamaan (dikonfirmasi dari `schema.prisma` aktual, Fase 6)**: model Prisma di project ini memakai **lowercase murni** (`user`, `club`, `sponsorshipapplication`, `event`, `member`, `dealer`, `dealerstaff`, `transaction`, `pointledger`, `redemptioncatalog`, `redemption`, `pointsetting`) — BUKAN PascalCase standar Prisma (`User`, `SponsorshipApplication`, dst) seperti konvensi umum. Tabel di bawah tetap ditulis PascalCase untuk keterbacaan dokumen, tapi saat menulis kode (`db.user.findMany()`, dst), **WAJIB pakai nama lowercase persis seperti di schema.prisma** — cek schema.prisma langsung sebelum menulis query, jangan asumsikan PascalCase. Penyimpangan ini sudah terjadi sejak Fase 1 dan sempat menyebabkan 18 type error saat build di Fase 6 karena kode baru ditulis dengan asumsi PascalCase.
>
> **Catatan `id`**: semua model MEMAKAI `@default(cuid())` (ditambahkan via migration di Fase 6) — **JANGAN** generate `id` manual (`crypto.randomUUID()`) di kode, biarkan Prisma yang generate otomatis. **PENGECUALIAN: `transaction.id` TIDAK punya default** — ini disengaja, karena `id` di model itu dipakai sebagai idempotency key yang WAJIB diisi manual dari client (lihat §5 aturan bisnis #1-2 dan mekanisme di `/lib/points.ts`). Jangan tambahkan `@default(cuid())` ke `transaction.id`.

Gunakan Prisma schema dengan entitas berikut sebagai baseline. Nama tabel/kolom boleh disesuaikan konvensi tim, tapi relasi & aturan di bawah **wajib** dipertahankan:

| Entitas (nama aktual di schema) | Field kunci | Catatan |
|---|---|---|
| `User` (`user`) | id, email/phone, passwordHash, role (`ADMIN`/`CLUB`/`DEALER`/`MEMBER`) | Satu tabel auth, terhubung ke profil per role |
| `Club` (`club`) | namaKomunitas, jumlahAnggota, tahunMobilMulai, tahunMobilAkhir, namaKetua, logoUrl, status (`unverified`/`active`/`inactive`), slug | |

> **Catatan display vs enum — WAJIB DIPERHATIKAN**: enum `club.status` di database/kode TETAP `unverified`/`active`/`inactive` (JANGAN diubah, tidak ada migration untuk ini). TAPI di UI, badge untuk nilai `active` **menampilkan teks "VERIFIED"** (bukan "ACTIVE") — supaya rangkaian status terbaca koheren sebagai satu konsep verifikasi: UNVERIFIED → VERIFIED → INACTIVE. Ini murni pemetaan tampilan di `status-badge`, logic kode (`if (club.status === "active")`, dst) TIDAK BERUBAH. Jangan bingung kalau lihat kode pakai `active` tapi layar menampilkan "Verified" — itu memang disengaja.
| `SponsorshipApplication` (`sponsorshipapplication`) | clubId, namaAcara, tanggalAcara, danaDiajukan, benefitDitawarkan, tierRekomendasi, tierFinal, status (`PENDING`/`APPROVED`/`REJECTED`/`EXPIRED`) | Satu klub bisa punya banyak pengajuan |
| `Event` (`event`) | sponsorshipApplicationId, slug (untuk URL invitation), status | Dibuat otomatis saat pengajuan `APPROVED` |
| `Member` (`member`) | userId, nama, usia, telepon, email, tipeMobil, tahunMobil, gender, clubId, eventAsalId, referralCode, referredByMemberId, qrCardId | telepon & email unik. `referredByMemberId` diisi SEKALI saat registrasi (permanen), lihat aturan bisnis #4 |
| `Dealer` (`dealer`) | namaDealer, alamat, status | |
| `DealerStaff` (`dealerstaff`) | userId, dealerId | |
| `Transaction` (`transaction`) | memberId, dealerId, produk, nominal, diskon, status (`DRAFT`/`CONFIRMED`/`VOIDED`), catatanAdmin | `id` TANPA default, lihat catatan di atas. Field `referralCodeUsed` DEPRECATED — referral sekarang dari `member.referredByMemberId`, bukan input per-transaksi, boleh dihapus dari schema atau dibiarkan nullable tak terpakai |
| `PointLedger` (`pointledger`) | targetType (`MEMBER`/`CLUB`), targetId, transactionId, redemptionId, jumlah, tipe (`CREDIT`/`HOLD`/`DEBIT`/`REVERSAL`), tanggalKedaluwarsa | **Append-only** — lihat §5 |
| `RedemptionCatalog` (`redemptioncatalog`) | nama, deskripsi, hargaPoin, aktif | |
| `Redemption` (`redemption`) | targetType, targetId, catalogItemId, status (`PENDING`/`APPROVED`/`REJECTED`/`FULFILLED`) | |
| `PointSetting` (`pointsetting`) | key, value | Parameter poin (besaran referral, besaran klub, masa berlaku) — dikonfigurasi admin lewat UI sejak Fase 6, bukan hardcode |

---

## 5. Aturan Bisnis Kritis — WAJIB DIPATUHI DI SETIAP IMPLEMENTASI

Ini bukan saran, ini kontrak fungsional dari PRD & workflow. Antigravity **harus** menegakkan aturan ini di level kode, bukan hanya di UI:

1. **Ledger poin bersifat append-only.** Saldo poin (member/klub) **tidak pernah** disimpan sebagai satu angka yang di-overwrite. Saldo = hasil agregasi (`SUM`) dari `PointLedger`. Setiap perubahan poin = baris baru di ledger.
2. **Distribusi poin harus atomik dengan konfirmasi transaksi.** Gunakan `prisma.$transaction([...])` untuk membungkus: update status `Transaction` → `CONFIRMED` + insert baris `PointLedger` terkait, dalam satu unit. Tidak boleh ada state di mana transaksi `CONFIRMED` tapi ledger belum tercatat, atau sebaliknya.
3. **Diskon member = potongan harga langsung**, bukan poin. Jangan konversi diskon jadi poin.
4. **Referral ditentukan permanen saat registrasi, bukan per-transaksi.** `member.referredByMemberId` diisi SEKALI saat member daftar (dari parameter `?ref=` di link klub, lihat workflow W3a/W3b), tidak pernah diketik ulang di form transaksi dealer. **Self-referral otomatis mustahil terjadi secara struktural** — member baru tidak bisa mereferensikan kode dirinya sendiri yang belum ada saat dia daftar, jadi TIDAK PERLU pengecekan self-referral eksplisit di `confirmTransaction()`.
5. **Referrer yang tidak ditemukan = transaksi tetap lanjut** tanpa poin referral, secara senyap (tidak perlu notifikasi ke dealer — dealer tidak tahu-menahu soal referral sama sekali). Jangan pernah memblokir transaksi karena masalah referral apapun. Kasus ini seharusnya sangat jarang (cuma kalau data `referredByMemberId` menunjuk ke member yang entah bagaimana terhapus).
6. **Void transaksi = entri ledger pembalik**, bukan hapus data. Set `Transaction.status = VOIDED` + insert baris `PointLedger` tipe `REVERSAL` senilai negatif dari entri asal. Data asli tidak boleh dihapus (audit trail).
7. **Redeem memakai mekanisme HOLD.** Saat member/klub mengajukan redeem: insert `PointLedger` tipe `HOLD` (mengunci poin agar tidak dipakai dobel) → admin approve → `HOLD` dikonversi jadi `DEBIT` permanen → admin reject → `HOLD` dibalik (poin kembali).
8. **Redeem memakai FIFO** — poin dengan `tanggalKedaluwarsa` terdekat dipakai lebih dulu saat kalkulasi saldo terpakai.
9. **Perubahan `PointSetting` tidak retroaktif.** Transaksi lama tetap memakai parameter yang berlaku saat transaksi terjadi (simpan snapshot nilai poin di `PointLedger`, jangan hanya referensi ke `PointSetting` yang bisa berubah).
10. **Approval sponsorship membuat entitas, bukan hanya ubah status.** Saat `SponsorshipApplication` di-approve: buat `Event` baru dengan slug unik + jika `Club` masih `unverified`, ubah jadi `active`.
11. **Registrasi member wajib validasi**: format email, format nomor telepon Indonesia, tahun mobil 4 digit numerik, gender hanya `Laki-laki`/`Perempuan`. Telepon & email harus unik.
12. **Role-based access ketat**: dealer hanya bisa lihat transaksi dealernya sendiri; klub hanya bisa lihat data klubnya sendiri; member hanya bisa lihat datanya sendiri. Tegakkan ini di level query (filter berdasar session), bukan hanya sembunyikan di UI.

Jika instruksi dari user/chat bertentangan dengan salah satu dari 12 aturan ini, **konfirmasi dulu** sebelum implementasi — kemungkinan besar itu perubahan aturan bisnis yang harus disadari, bukan sekadar detail teknis.

---

## 6. Autentikasi & Role

- Satu tabel `User` dengan kolom `role`. Session Auth.js membawa `role` + `id` terkait profil (clubId/dealerId/memberId).
- Middleware akses (`proxy.ts` — nama resmi pengganti `middleware.ts` sejak Next.js 16, lihat [catatan versi](#catatan-versi-nextjs-16)) memeriksa role sebelum mengizinkan akses ke masing-masing folder route group (`(admin)`, `(club)`, `(dealer)`, `(member)`).
- Password di-hash dengan `bcrypt`. Jangan pernah simpan plaintext.
- Akun Klub & Dealer dibuat otomatis oleh sistem (lihat workflow W1, W10) — bukan self-register bebas seperti member.

> **Catatan versi Next.js 16**: `middleware.ts` deprecated sejak Next.js 16, digantikan `proxy.ts` (ekspor fungsi `proxy`, bukan `middleware`) — dikonfirmasi via dokumentasi resmi & codemod `npx @next/codemod@canary middleware-to-proxy` saat verifikasi Fase 1. Semua instruksi implementasi di dokumen ini maupun prompt Antigravity sejak Fase 1 memakai `proxy.ts`.

> **KRITIS — `proxy.ts` wajib exclude path internal Next.js.** `proxy.ts` HARUS mengecualikan `/_next/*` (dan path internal lain seperti `/api/auth/*` untuk callback Auth.js) dari pengecekan role-based access. Kalau tidak, request internal Next.js (termasuk WebSocket HMR ke `/_next/webpack-hmr`) ikut tercegat dan di-redirect ke `/login`, menyebabkan HMR gagal dengan gejala membingungkan ("unexpected response from server") yang terlihat seperti masalah proxy/network padahal sebenarnya RBAC kita sendiri yang salah tangkap. Ini dikonfirmasi sebagai salah satu dari tiga akar masalah saga debugging WebSocket di Fase 2-3 (dua lainnya: lihat catatan `next.config.ts` di bawah). Pakai `matcher` di config export `proxy.ts` untuk mengecualikan path ini secara eksplisit, jangan hanya mengandalkan urutan pengecekan di dalam fungsi.

> **KRITIS — Konfigurasi `next.config.ts` yang terbukti benar (Next.js 16)**: setelah beberapa putaran debugging Fase 2-3, dua setting berikut WAJIB ada dan sudah terverifikasi bekerja — JANGAN diubah tanpa alasan kuat, dan kalau terpaksa diubah, verifikasi dulu ke dokumentasi resmi (bukan menebak struktur seperti kesalahan pertama kita):
> ```ts
> const nextConfig = {
>   experimental: {
>     serverActions: {
>       bodySizeLimit: "20mb", // default 1MB terlalu kecil untuk upload logo/foto dari HP
>     },
>   },
>   allowedDevOrigins: ["sailun.test", "*.sailun.test"], // top-level, BUKAN di dalam experimental — tanpa ini, Next.js 16 menolak request dev resource dari domain custom Laragon
>   output: "standalone", // untuk kesiapan deployment VPS, AGENTS.md §11
> };
> ```

---

## 7. Upload File & Kompresi Logo

- Logo klub: **tanpa batas ukuran file di sisi validasi**, tapi **wajib** di-resize/compress otomatis di server sebelum disimpan (target: maks. 1024×1024 px, format WebP atau PNG teroptimasi) menggunakan `sharp`.
- Simpan file di `/public/uploads/` (filesystem lokal VPS) dengan nama file ter-hash (bukan nama asli, untuk hindari konflik & path traversal).
- Validasi format: hanya terima `.jpg`, `.jpeg`, `.png` (`.svg` opsional — jika diterima, jangan proses lewat `sharp` raster, simpan langsung dengan sanitasi karena SVG bisa mengandung script).
- Tampilkan progress indicator di UI untuk upload file besar — proses kompresi tidak boleh membuat request timeout terasa seperti gagal.

---

## 8. QR Code

- **Generate** (member card): buat saat registrasi member berhasil, encode `memberId` (bukan data pribadi mentah) → simpan sebagai gambar atau generate on-the-fly saat halaman dashboard member dibuka.
- **Scan** (layar dealer): akses kamera lewat `html5-qrcode`/`@zxing/browser`, wajib **HTTPS** (kamera browser tidak berfungsi di HTTP kecuali localhost). Sediakan fallback input ID member manual jika kamera gagal/tidak tersedia.

---

## 9. Environment Variables

```env
DATABASE_URL="mysql://user:password@localhost:3306/sailun_community"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://sailun.test"
UPLOAD_DIR="/public/uploads"
```

> **Catatan diagnosis (bukan aturan)**: saat debugging Fase 2, akses lewat `sailun.test` sempat menunjukkan error WebSocket handshake gagal di console (HMR tidak konek) — kemungkinan konfigurasi reverse proxy Laragon (vhost Apache/Nginx) untuk domain ini belum meneruskan header `Upgrade`/`Connection` yang dibutuhkan WebSocket. Diagnosis (`localhost:3000` vs `sailun.test`) di Fase 2 membuktikan kode aplikasi sendiri tidak bermasalah — jadi ini murni PR konfigurasi vhost, bukan alasan untuk berhenti pakai `sailun.test`. Lihat langkah perbaikan di bawah.

Jangan hardcode kredensial apa pun di kode. Semua parameter poin (besaran referral, besaran klub, masa berlaku) disimpan di tabel `PointSetting`, **bukan** di `.env` — karena harus bisa diubah admin lewat UI tanpa redeploy.

---

## 10. Perintah Development

```bash
npm install                        # install dependencies
npx prisma migrate dev             # jalankan migration (development)
npx prisma studio                  # GUI database untuk cek data
npm run dev                        # jalankan dev server
npm run build                      # build production
npm run start                      # jalankan hasil build (mode standalone)
npx prisma migrate deploy          # migration di production/VPS
```

Sebelum menjalankan `prisma migrate dev` yang mengubah schema, **selalu tampilkan preview perubahan** ke user dan konfirmasi jika perubahan bersifat destruktif (drop column/table).

> **Catatan operasional — menambah kolom unique/required ke tabel yang sudah berisi data.** Ini akan terjadi berulang di Fase 4-6 (menambah field ke `Transaction`, `PointLedger`, dsb). Prisma akan minta salah satu: beri nilai default, atau reset database. Sebelum memilih **reset** (seperti yang terjadi saat menambah `Club.slug` di Fase 3), pertimbangkan dulu apakah data uji yang ada masih dibutuhkan untuk regresi manual (mis. klub/event hasil approval yang sudah pernah diverifikasi). Kalau reset dipilih, **laporkan eksplisit ke user sebagai keputusan, bukan catatan sampingan** — sertakan bahwa seed ulang (admin, dsb) sudah dijalankan, dan data uji sebelumnya (klub/member/transaksi manual) perlu dibuat ulang untuk lanjut verifikasi.

---

## 11. Target Deployment: VPS + aaPanel

- Build Next.js dengan `output: 'standalone'` di `next.config.js` agar bisa dijalankan sebagai proses Node mandiri (bukan bergantung fitur serverless Vercel).
- Jalankan lewat **PM2** (dikelola dari aaPanel Node.js Manager) — bukan `next dev`, dan bukan asumsi ada auto-scaling serverless.
- Nginx (via aaPanel) sebagai reverse proxy ke port Node.js app + terminasi HTTPS (Let's Encrypt lewat aaPanel).
- MySQL dikelola langsung di aaPanel (Database Manager) — gunakan kredensial yang sama dengan `DATABASE_URL`.
- Domain/subdomain untuk staging (mis. `demo.sailuncommunity.id`) diarahkan langsung ke IP VPS yang sama — tidak perlu Vercel di alur mana pun.
- File upload disimpan di filesystem VPS (`/public/uploads`) — **backup rutin folder ini** menjadi bagian dari maintenance, karena tidak ada redundansi cloud storage otomatis seperti di layanan managed.

---

## 12. Prinsip Kerja untuk Antigravity

### Batasi scope dengan tegas
Jangan mengerjakan lebih dari yang diminta dalam satu sesi. Jika instruksi menyebut satu halaman/fitur, implementasikan **hanya** itu — jangan sekaligus membangun fitur terkait yang belum diminta ("selagi di sini, saya buatkan juga...").

### Jangan asumsikan, konfirmasi
Jika instruksi ambigu (mis. field mana yang wajib, bagaimana perilaku saat error), **tanyakan** sebelum menulis kode, terutama jika menyangkut salah satu dari 12 aturan bisnis di §5.

### Validasi & gate akses ditulis eksplisit
Jangan menulis "pastikan hanya pemilik yang bisa akses" sebagai komentar — implementasikan sebagai pengecekan kode nyata, contoh:
```ts
if (transaction.dealerId !== session.user.dealerId) {
  throw new Error("Forbidden");
}
```

### Verifikasi bertahap, bukan asumsi selesai
Setelah implementasi, jalankan/cek satu per satu dan laporkan hasilnya — jangan klaim "sudah selesai" tanpa verifikasi konkret (build sukses, migration jalan, halaman render tanpa error, dsb).

### Sebelum redesign/refactor besar
Identifikasi file yang akan dihapus/diganti secara eksplisit dan konfirmasi dulu — jangan menghapus file yang tidak disebutkan secara langsung.

### Rollback, bukan tumpuk perbaikan
Jika satu pendekatan gagal, jangan menambal di atas kode yang sudah berantakan. Kembalikan (`git checkout` / revert) ke kondisi terakhir yang berfungsi, baru coba pendekatan lain.

---

## 13. Anti-Pattern yang Harus Dihindari

| ❌ Jangan | ✅ Lakukan |
|---|---|
| Menyimpan saldo poin sebagai kolom yang di-update langsung | Selalu insert baris baru ke `PointLedger`, hitung saldo via agregasi |
| Update status transaksi tanpa membungkus dengan insert ledger dalam satu `$transaction` | Bungkus keduanya dalam satu operasi atomik Prisma |
| Memakai fitur Vercel Blob/Edge Runtime/Image Optimization API | Pakai filesystem lokal + `sharp`, jalankan sebagai Node standar |
| Hardcode besaran poin/diskon di kode | Baca dari tabel `PointSetting`, snapshot nilainya di setiap transaksi |
| Blokir transaksi karena kode referral invalid | Lanjutkan transaksi tanpa poin referral, cukup beri notifikasi |
| Hapus data saat void transaksi | Set status `VOIDED` + insert ledger `REVERSAL` |
| Implementasi fitur besar sekaligus tanpa scope jelas | Satu halaman/fitur per sesi, verifikasi, baru lanjut |
| Klaim "selesai" tanpa menjalankan/menguji | Verifikasi konkret tiap langkah, laporkan hasil nyata |
| Menulis warna hex/rgb langsung di className atau inline style | Pakai token Tailwind dari `tailwind.config.js` (§3.1), merujuk `Design.md` |
| Membuat styling one-off di halaman untuk kebutuhan yang sudah ada komponen standarnya | Pakai/impor komponen dari `/components/ui/` sesuai `Design.md` §Components |
| Melaporkan halaman baru selesai tanpa membandingkan wrapper/komponen dengan halaman sejenis yang sudah ada | Wajib audit konsistensi dulu sesuai §3.1 Aturan 4, sebutkan hasil perbandingannya di laporan |
| Ukuran font display/stat-number sama persis di mobile & desktop | Terapkan tabel scaling `Design.md` §Responsive Behavior via Tailwind responsive classes atau `clamp()` |

---

## 14. Referensi Dokumen Proyek

- `PRD.md` — kebutuhan produk lengkap, requirement P0/P1/P2, open questions.
- `Workflow.md` — alur kerja detail per aktor (W1–W10), state machine, matriks traceability layar.
- `Design.md` — design token & komponen standar (warna, tipografi, radius, spacing) — sumber kebenaran untuk §3.1.
- Dokumen ini (`AGENTS.md`) — panduan teknis & aturan implementasi.

Jika keempat dokumen ini tidak sinkron dengan kondisi kode saat ini, laporkan ketidaksesuaian ke user alih-alih memilih salah satu secara sepihak.
