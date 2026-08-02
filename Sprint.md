# Sprint Plan — MVP Sailun Community Platform

| | |
|---|---|
| **Project** | `C:\laragon\www\sailun` (seluruh dokumen `.md` disimpan di root project) |
| **Versi** | v1.1 |
| **Tanggal** | 31 Juli 2026 |
| **Referensi** | `PRD.md` v1.1, `Workflow.md`, `AGENTS.md`, `Design.md` |
| **Cakupan** | 7 fase pengembangan **lokal** (build & uji di environment development, mis. Laragon) — deployment ke VPS produksi adalah aktivitas terpisah di luar dokumen ini, lihat `AGENTS.md` §11 saat waktunya tiba |

Dokumen ini menerjemahkan roadmap PRD §11 menjadi fase pengembangan yang bisa langsung dieksekusi secara lokal. Setiap fase mencantumkan **layar PRD** yang selesai, **workflow** yang diimplementasikan, dan **aturan bisnis `AGENTS.md` §5** yang mulai berlaku — supaya progres selalu bisa diverifikasi terhadap dokumen sumber kebenaran yang sudah ada.

---

## 0. Asumsi & Batasan Perencanaan

- **Tim kecil, sekuensial.** Fase disusun berurutan (bukan banyak jalur paralel) karena budget Rp 12 juta (termasuk maintenance 3 bulan) mengindikasikan tim inti kecil. Kalau tim lebih besar dari asumsi ini, beberapa fase bisa digabung — lihat catatan "Bisa Diparalelkan" di tiap fase.
- **Fase adalah milestone berbasis fitur, bukan time-box tetap.** Satu fase dianggap selesai ketika seluruh tugas & Definition of Done-nya terpenuhi — bukan karena tanggal tertentu sudah lewat. Durasi tiap fase menyesuaikan kompleksitas kerja tim.
- **Disiplin scope P0 saja.** Fase 1–6 **hanya** mengerjakan requirement P0 dari PRD §8. Item P1 (notifikasi email, filter lanjutan, dsb.) hanya masuk sebagai **fast-follow** di Fase 7 kalau waktu memungkinkan — tidak boleh menyusup ke fase sebelumnya (lihat prinsip *Scope Management* di PRD).
- **Definisi "selesai" konsisten.** Setiap fase memakai Definition of Done yang sama (§4) — bukan sekadar "kode sudah ditulis", tapi terverifikasi jalan sesuai 12 aturan bisnis di `AGENTS.md` §5 dan 3 aturan styling di `AGENTS.md` §3.1.
- **Semua kerja di dokumen ini adalah lokal.** Setup server, MySQL, dan menjalankan aplikasi dilakukan di environment development (mis. Laragon di `C:\laragon\www\sailun`) — bukan di VPS. Deployment produksi (VPS + aaPanel) baru relevan setelah Fase 7 selesai, dan bukan bagian dari sprint plan ini.

---

## 1. Ringkasan Fase

| Fase | Fokus | Workflow | Layar PRD Selesai |
|---|---|---|---|
| **1** | Fondasi teknis: schema, auth, design token, komponen dasar | W9 (fondasi) | — (infrastruktur) |
| **2** | Alur klub: microsite, pengajuan, approval admin | W1, W2 | #1, #2, #11, #15 |
| **3** | Registrasi member & QR card | W3 | #3, #4, #5 |
| **4** | Transaksi dealer & ledger poin (fase berisiko tertinggi) | W4, W5 | #6, #8, #9 |
| **5** | Redeem poin, void, notifikasi dasar | W6, W7 | #7, #13, #18 (sebagian) |
| **6** | Dashboard admin & manajemen master data | W8, W10 | #12, #14, #16, #17, #18 (lengkap) |
| **7** | QA, polish responsif, audit, UAT | Semua (regresi) | Seluruh 18 layar — polish final |

---

## 2. Rincian Fase

### Fase 1 — Fondasi Teknis & Setup

**Goal**: Infrastruktur & fondasi kode siap dipakai fase berikutnya — tidak ada fitur user-facing yang selesai di fase ini, dan itu wajar.

**Tugas:**
- [ ] Setup environment development lokal (Laragon): Node.js, MySQL lokal (InnoDB), pastikan versi kompatibel dengan Prisma.
- [ ] Inisialisasi repo Next.js (App Router, TypeScript) sesuai struktur folder `AGENTS.md` §3.
- [ ] Tulis `prisma/schema.prisma` lengkap untuk seluruh 11 entitas di `AGENTS.md` §4 (`User`, `Club`, `SponsorshipApplication`, `Event`, `Member`, `Dealer`, `DealerStaff`, `Transaction`, `PointLedger`, `RedemptionCatalog`, `Redemption`, `PointSetting`) + migration pertama ke MySQL lokal.
- [ ] Implementasi `tailwind.config.js` sesuai mapping token `Design.md` (`AGENTS.md` §3.1 Aturan 1) — warna, `fontFamily` (Archivo/JetBrains Mono/Inter), `borderRadius`.
- [ ] Setup Auth.js (NextAuth v5) dengan Credentials Provider + `middleware.ts` role-based per route group (`AGENTS.md` §6).
- [ ] Bangun komponen dasar di `/components/ui/`: `button-primary`, `button-secondary`, `button-danger`, `button-ghost`, `button-icon`, `text-input`, `select-dropdown`, `status-badge`, `data-table` (shell kosong), `form-card`, `top-nav`, `sidebar-nav`, `bottom-nav-mobile`.
- [ ] Halaman login kosong (belum ada user nyata untuk register — akun pertama dibuat manual via seed untuk role Admin).

**Workflow terkait**: W9 (fondasi autentikasi — belum ada alur registrasi role lain, itu menyusul).

**Aturan bisnis relevan**: #12 (role-based access) — mulai ditegakkan di level middleware, walau belum ada data untuk diuji penuh.

**Dependency**: Tidak ada (titik awal).

**Definition of Done tambahan fase ini**: `npm run build` sukses tanpa error, migration Prisma jalan di MySQL lokal, minimal satu halaman placeholder bisa diakses di `localhost`.

---

### Fase 2 — Alur Klub & Sponsorship

**Goal**: Klub bisa mengajukan sponsorship dari microsite publik, admin bisa me-review dan approve, sistem otomatis membuat event + URL invitation.

**Tugas:**
- [ ] Landing page microsite (`hero-photo-band`, `benefit-card` 3-up, `social-proof-strip`) sesuai copy final revisi 28 Jul (headline "Sponsorship untuk Komunitasmu").
- [ ] Formulir registrasi klub + pengajuan sponsorship (satu formulir gabungan untuk klub baru, formulir ringkas untuk klub yang sudah terdaftar) — field sesuai `PRD` §7.7.
- [ ] Upload logo klub: integrasi `sharp` untuk auto-compress/resize (`AGENTS.md` §7), pakai `file-upload-dropzone` dengan progress indicator.
- [ ] Validasi form: numerik untuk jumlah anggota & dana, tahun 4 digit, tahun akhir ≥ tahun mulai (workflow W1 alur alternatif A2).
- [ ] Logika rekomendasi tier otomatis (Micro/Small/Medium/Big) berdasar jumlah member & skala acara.
- [ ] Halaman approval admin (`data-table` antrean `PENDING`, detail pengajuan, tombol approve/reject dengan `confirmation-modal`).
- [ ] Logika approval: buat `Event` baru + slug unik, ubah `Club.status` `unverified` → `active` jika pertama kali (aturan bisnis #10).
- [ ] Dashboard klub dasar: `club-profile-card`, `application-status-timeline`, riwayat pengajuan.
- [ ] Halaman invitation event (`#3`) — versi awal: tampilkan info event saja (form registrasi member menyusul Fase 3).

**Workflow terkait**: W1 (Registrasi Klub & Pengajuan Sponsorship), W2 (Review & Approval Sponsorship).

**Aturan bisnis relevan**: #10 (approval membuat entitas, bukan hanya ubah status).

**Dependency**: Fase 1 (auth, schema, komponen dasar, token Tailwind).

**Risiko & Mitigasi**: Logika rekomendasi tier otomatis berpotensi ambigu tanpa aturan jelas dari Sailun (lihat PRD Open Question #1–3, masih ada yang belum final). Mitigasi: implementasikan sebagai fungsi terpisah & mudah diubah (`/lib/`), jangan hardcode di komponen, supaya aturan tier bisa disesuaikan begitu keputusan final dari Sailun turun.

**Bisa Diparalelkan (tim lebih besar)**: Landing page (front-end murni) bisa dikerjakan paralel dengan logika approval admin (back-end) oleh dua orang berbeda.

---

### Fase 3 — Registrasi Member & QR Card

**Goal**: Calon member bisa mendaftar dari halaman invitation, mendapat kartu member digital dengan QR code dan kode referral.

**Tugas:**
- [ ] Lengkapi halaman invitation event (`#3`) dengan formulir member: nama, usia, telepon, email, tipe mobil, tahun pembuatan mobil, gender (`radio-group`).
- [ ] Validasi: format email, format telepon Indonesia, tahun 4 digit; **telepon & email unik** (aturan bisnis #11).
- [ ] Logika asosiasi otomatis member ke klub + event asal dari invitation yang dipakai (workflow W3 langkah 4).
- [ ] Generate `member-qr-card` (integrasi `qrcode`, encode `memberId` saja — bukan data pribadi mentah, per `AGENTS.md` §8).
- [ ] Generate kode/link referral pribadi per member.
- [ ] Dashboard member (`#5`): tampilkan `member-qr-card`, `points-balance-widget` (saldo 0 di fase ini — belum ada transaksi), `referral-share-card`.
- [ ] Halaman riwayat transaksi & poin member (`#6`) — shell UI, data kosong (transaksi nyata baru ada di Fase 4).
- [ ] Alur registrasi via QR komunitas (bukan hanya invitation event) — workflow W3 alur alternatif A2.
- [ ] Alur A1: telepon/email sudah terdaftar → arahkan ke login, bukan buat akun baru.

**Workflow terkait**: W3 (Registrasi Member).

**Aturan bisnis relevan**: #11 (registrasi member wajib validasi).

**Dependency**: Fase 2 (harus ada `Event` berstatus `APPROVED` untuk diuji end-to-end).

**Risiko & Mitigasi**: Target waktu registrasi <2 menit (PRD Success Metrics) bisa meleset kalau form terlalu panjang di layar kecil. Mitigasi: uji alur registrasi di viewport mobile sejak fase ini juga (jangan tunda ke Fase 7), pakai scaling tipografi `Design.md` §Responsive Behavior dari awal.

---

### Fase 4 — Transaksi Dealer & Ledger Poin

**Goal**: Dealer bisa scan QR member, input transaksi, dan sistem otomatis mendistribusikan diskon + poin secara atomik. **Fase dengan risiko teknis tertinggi** — inti dari seluruh janji "100% tertrack, respons otomatis".

**Tugas:**
- [ ] Layar scan QR dealer (`#8`): integrasi `html5-qrcode`/`@zxing/browser`, `qr-scan-viewport` dengan frame overlay oranye. Wajib HTTPS di lingkungan yang mendukungnya (di lokal, kamera browser umumnya tetap berfungsi di `localhost` tanpa HTTPS).
- [ ] Fallback input ID member manual (workflow W4 alur alternatif A1).
- [ ] Kartu verifikasi member pasca-scan: nama, klub, status, besaran diskon berlaku.
- [ ] Form input transaksi: produk, nominal, kolom kode referral opsional.
- [ ] **Implementasi `/lib/points.ts` sebagai satu-satunya tempat logika distribusi poin** (`AGENTS.md` §3 aturan folder).
- [ ] Distribusi poin atomik via `prisma.$transaction()`: update `Transaction.status` → `CONFIRMED` + insert `PointLedger` dalam satu unit (aturan bisnis #1, #2).
- [ ] Self-referral ditolak otomatis (aturan bisnis #4); kode referral invalid tidak memblokir transaksi (aturan bisnis #5).
- [ ] Diskon tetap potongan harga langsung, tidak dikonversi poin (aturan bisnis #3).
- [ ] Alur A3 (pembeli non-member dengan kode referral wajib registrasi dulu di tempat — workflow W4).
- [ ] Alur A6: idempotency saat koneksi putus — transaksi tidak boleh tercatat ganda.
- [ ] Riwayat transaksi dealer (`#9`).
- [ ] Riwayat transaksi & poin member (`#6`) sekarang menampilkan data nyata.

**Workflow terkait**: W4 (Transaksi di Dealer), W5 (Distribusi Poin Otomatis).

**Aturan bisnis relevan**: #1, #2, #3, #4, #5 — lima dari dua belas aturan bisnis kritis, semuanya harus lolos verifikasi eksplisit sebelum fase ditutup, bukan diasumsikan benar dari membaca kode.

**Dependency**: Fase 3 (member dengan QR card harus ada untuk pengujian nyata).

**Risiko & Mitigasi**: Ini fase paling rawan bug tersembunyi (kondisi race saat konfirmasi bersamaan, ledger tidak konsisten). Mitigasi: alokasikan waktu eksplisit untuk pengujian manual skenario per alur alternatif di `Workflow.md` W4 (A1–A6) satu per satu sebelum fase ditutup — jangan hanya uji happy path.

**Bisa Diparalelkan**: Tidak disarankan — logika ledger butuh satu pemilik jelas untuk menghindari implementasi ganda yang saling bertentangan (lihat `AGENTS.md` §3 aturan sentralisasi `/lib/points.ts`).

---

### Fase 5 — Redeem Poin, Void & Notifikasi Dasar

**Goal**: Member/klub bisa menukar poin, admin bisa membatalkan transaksi bermasalah, dan status penting terkirim lewat notifikasi dasar.

**Tugas:**
- [ ] Katalog redeem sisi member (`#7`): `redeem-catalog-card` grid, ajukan redeem.
- [ ] Katalog redeem sisi klub — bagian dari `#13` (Poin & riwayat redeem klub).
- [ ] Mekanisme HOLD: insert `PointLedger` tipe `HOLD` saat pengajuan, konversi ke `DEBIT` saat admin approve, dibalik saat reject (aturan bisnis #7).
- [ ] Kalkulasi saldo terpakai memakai FIFO berdasar `tanggalKedaluwarsa` (aturan bisnis #8).
- [ ] Sisi admin: antrean approval redeem, tombol approve/reject/fulfilled (bagian dari `#18`).
- [ ] Fitur void transaksi admin: `confirmation-modal` + insert `PointLedger` tipe `REVERSAL` (aturan bisnis #6) — data asli tidak dihapus.
- [ ] Tangani kasus saldo negatif jika poin sudah terlanjur dipakai redeem saat transaksi di-void (workflow W7).
- [ ] `PointSetting` — parameter poin (besaran referral, besaran klub, masa berlaku) dikonfigurasi admin; perubahan **tidak retroaktif**, snapshot nilai disimpan di setiap entri ledger (aturan bisnis #9).
- [ ] Notifikasi email dasar (P1 — fast-follow kalau waktu cukup): perubahan status pengajuan sponsorship & redeem.

**Workflow terkait**: W6 (Redeem Poin), W7 (Void Transaksi).

**Aturan bisnis relevan**: #6, #7, #8, #9.

**Dependency**: Fase 4 (ledger poin harus sudah berjalan nyata untuk redeem/void punya sesuatu untuk dioperasikan).

**Risiko & Mitigasi**: Aturan #9 (snapshot nilai poin, bukan referensi langsung ke `PointSetting`) mudah terlewat kalau developer tergesa — cek eksplisit di code review bahwa `PointLedger` menyimpan nilai final, bukan pointer ke setting yang bisa berubah nanti.

---

### Fase 6 — Dashboard Admin & Manajemen Master Data

**Goal**: Admin punya visibilitas penuh (dashboard analitik) dan kendali penuh (manajemen klub/dealer/katalog/parameter) tanpa perlu akses database langsung.

**Tugas:**
- [x] Dashboard analitik admin (`#14`): `stat-card` untuk member baru, jumlah & nilai transaksi, poin beredar, plus section "Butuh Perhatian" dan trend 7-hari. Filter event/klub/dealer/periode **dihapus dari scope** (keputusan pasca-Fase 6 — lihat PRD R5).
- [ ] Export CSV untuk rekonsiliasi.
- [ ] Manajemen klub (`#16`): CRUD, edit/nonaktifkan klub.
- [ ] Manajemen dealer (`#17`): CRUD dealer + akun petugas (`DealerStaff`).
- [ ] Manajemen anggota klub (`#12`) di sisi dashboard klub — daftar member per klub.
- [ ] Manajemen poin & redeem admin (`#18`) — lengkapi bagian yang belum selesai di Fase 5 (parameter poin, katalog redeem CRUD penuh).
- [ ] Uji filter dashboard menghitung hanya transaksi `CONFIRMED` (void dikecualikan) — konsisten dengan workflow W8.

**Workflow terkait**: W8 (Monitoring & Dashboard), W10 (Manajemen Master Data).

**Aturan bisnis relevan**: #12 (role-based access) — sekarang diuji penuh karena semua data lintas peran sudah ada untuk memastikan isolasi data benar (dealer tidak lihat dealer lain, klub tidak lihat klub lain).

**Dependency**: Fase 1–5 — dashboard butuh data mengalir dari seluruh alur sebelumnya agar bermakna saat diuji.

**Setelah fase ini**: Seluruh 18 layar PRD §7 sudah punya implementasi fungsional (belum tentu sempurna secara polish/responsif — itu tugas Fase 7).

---

### Fase 7 — QA, Polish Responsif & Audit

**Goal**: Platform siap secara fungsional dan patuh terhadap seluruh aturan governance yang sudah ditetapkan di `AGENTS.md` dan `Design.md` — siap untuk tahap deployment terpisah (di luar cakupan dokumen ini).

**Tugas:**
- [ ] **Audit token warna** (`AGENTS.md` §3.1 Aturan 1): cek seluruh codebase untuk hex/rgb hardcoded, pastikan semua warna lewat token Tailwind.
- [ ] **Audit komponen standar** (Aturan 2): pastikan tidak ada styling one-off untuk kebutuhan yang sudah punya komponen standar; `status-badge` dipakai konsisten di semua tempat status ditampilkan.
- [ ] **Audit scaling font** (Aturan 3): render tiap layar di <768px dan ≥1024px, verifikasi token `display-*`/`stat-number` benar-benar berbeda ukurannya.
- [ ] **Audit 12 aturan bisnis** (`AGENTS.md` §5): checklist manual satu per satu, terutama ledger append-only (#1), atomicity (#2), dan role-based access (#12) — ini tiga yang paling berisiko kalau ada yang lolos tanpa sadar.
- [ ] Regresi end-to-end loop inti secara lokal: klub daftar → approve → member daftar → transaksi dealer → poin terdistribusi → redeem → terlihat di dashboard (satu skenario penuh, bukan per-fitur terpisah).
- [ ] Uji seluruh alur alternatif/error di `Workflow.md` W1–W7 yang belum sempat diuji detail di fase sebelumnya.
- [ ] Sesi UAT (User Acceptance Testing) bersama Sailun/HipPro — dijalankan di environment lokal/demo, kumpulkan feedback, prioritaskan perbaikan blocking vs. bisa menyusul.
- [ ] Dokumentasi ringkas hal-hal yang perlu disiapkan sebelum deployment (referensi ke `AGENTS.md` §11 untuk detail teknis VPS/aaPanel saat waktunya tiba) — deployment itu sendiri tidak termasuk cakupan fase ini.

**Workflow terkait**: Regresi seluruh W1–W10.

**Aturan bisnis relevan**: Audit penuh #1–#12.

**Dependency**: Fase 1–6 selesai fungsional.

**Risiko & Mitigasi**: Audit menyeluruh di akhir bisa terasa padat kalau ditumpuk semua di fase ini. Mitigasi: mulai audit token/komponen/font (item pertama di atas) sejak paruh kedua Fase 6 secara paralel dengan development, bukan menunggu Fase 7 dimulai — supaya Fase 7 fokus ke bug fixing & UAT.

---

## 3. Isu Lintas-Fase — Wajib Dijaga Konsisten Sepanjang Development

Hal-hal berikut **tidak selesai di satu fase** — harus terus diperiksa di setiap fase berikutnya, bukan hanya dianggap "sudah beres" setelah pertama kali diimplementasikan:

| Isu | Fase asal | Wajib dicek ulang di |
|---|---|---|
| Token warna tidak hardcode (`AGENTS.md` §3.1 Aturan 1) | Fase 1 | Setiap fase — terutama saat menambah komponen baru |
| Reuse komponen standar, bukan styling one-off (Aturan 2) | Fase 1 | Setiap fase |
| Scaling font per breakpoint (Aturan 3) | Fase 2 (landing page pertama kali dibangun) | Setiap fase yang menambah layar baru |
| Role-based access di level query, bukan hanya UI (aturan bisnis #12) | Fase 1 (middleware) | Fase 4–6 (saat data lintas peran mulai banyak) |
| Ledger append-only, tidak pernah overwrite saldo (#1) | Fase 4 | Fase 5 (redeem), Fase 6 (dashboard baca saldo) |
| Mobile-first untuk alur member & dealer (PRD workflow) | Fase 3 (member), Fase 4 (dealer) | Fase 7 (audit final) |

---

## 4. Definition of Done (Checklist Umum per Fitur)

Sebelum satu tugas di fase manapun ditandai selesai, semua ini harus terpenuhi — bukan hanya "kode sudah ditulis":

- [ ] Fitur berjalan sesuai happy path **dan** minimal satu alur alternatif/error yang relevan dari `Workflow.md`.
- [ ] Tidak ada warna/ukuran font hardcoded — memakai token dari `Design.md` via `tailwind.config.js`.
- [ ] Memakai komponen standar dari `/components/ui/`, bukan styling one-off, kecuali memang belum ada padanannya (dan itu dilaporkan untuk didokumentasikan balik ke `Design.md`).
- [ ] Validasi & gate akses ditulis eksplisit di kode (bukan komentar/asumsi) — lihat `AGENTS.md` §12.
- [ ] Diuji di viewport mobile (<768px) dan desktop (≥1024px) untuk fitur yang punya tampilan.
- [ ] `npm run build` sukses tanpa error/warning baru.
- [ ] Jika mengubah `schema.prisma`: migration sudah dijalankan & preview perubahan sudah dikonfirmasi (`AGENTS.md` §10).
- [ ] Tidak melanggar satu pun dari 12 aturan bisnis kritis `AGENTS.md` §5 yang relevan dengan fitur tersebut.

---

## 5. Matriks Traceability — Fase × Layar PRD × Workflow

| Fase | Layar PRD §7 | Workflow | Aturan Bisnis (`AGENTS.md` §5) |
|---|---|---|---|
| 1 | — (infrastruktur) | W9 (fondasi) | #12 (fondasi) |
| 2 | #1, #2, #11, #15, #3 (parsial) | W1, W2 | #10 |
| 3 | #3 (lengkap), #4, #5, #6 (shell) | W3 | #11 |
| 4 | #6 (lengkap), #8, #9 | W4, W5 | #1, #2, #3, #4, #5 |
| 5 | #7, #13, #18 (parsial) | W6, W7 | #6, #7, #8, #9 |
| 6 | #12, #14, #16, #17, #18 (lengkap) | W8, W10 | #12 (pengujian penuh) |
| 7 | Seluruh 18 layar — polish & audit | Regresi semua | Audit #1–#12 |

Seluruh 18 layar PRD dan 10 workflow tercakup di rencana fase ini — tidak ada yang menggantung, konsisten dengan matriks traceability di `Workflow.md`.

---

## 6. Kondisi Keluar (Exit Criteria) per Tahapan

**Tahap Fondasi (akhir Fase 2)**: Klub bisa mengajukan sponsorship dan menerima approval end-to-end secara lokal; halaman invitation ter-generate otomatis. Belum perlu member/transaksi nyata.

**Tahap Aktivasi (akhir Fase 5)**: Loop inti penuh berjalan secara lokal — klub → member → transaksi dealer → poin → redeem — bisa didemokan end-to-end dengan data uji nyata, bukan mock data.

**Tahap Skala (akhir Fase 7)**: Seluruh fitur MVP selesai diuji secara lokal, dashboard admin siap dipakai untuk laporan KPI pertama (PRD §10), minimal 1 sesi UAT selesai dengan feedback blocking sudah ditindaklanjuti. Platform siap masuk tahap deployment terpisah (VPS + aaPanel, `AGENTS.md` §11) — deployment itu sendiri bukan bagian dari exit criteria dokumen ini.

---

## 7. Catatan Risiko Proyek

- **Budget sangat ketat** (Rp 12 juta termasuk maintenance 3 bulan) — rencana fase ini mengasumsikan tidak ada scope creep. Setiap permintaan fitur baru di tengah jalan harus dicek dulu terhadap PRD §3 (Non-Goals) sebelum diterima.
- **Open Questions PRD belum final** (§12 — terutama #1–3 soal besaran diskon, skema dealer, taksonomi tier) berpotensi menunda Fase 2. Sebaiknya dikonfirmasi ke Sailun **sebelum** Fase 2 dimulai, bukan ditengah fase berjalan.
- **Fase 4 adalah titik kritis** — kalau meleset, seluruh fase setelahnya (redeem, dashboard) ikut mundur karena bergantung pada ledger poin yang berfungsi benar. Prioritaskan perhatian ekstra di fase ini kalau harus memilih mana yang didahulukan.
