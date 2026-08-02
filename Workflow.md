# Workflow — MVP Sailun Community Platform

| | |
|---|---|
| **Dokumen** | Workflow lengkap website MVP |
| **Versi** | v1.0 — turunan dari PRD v1.1 |
| **Tanggal** | 31 Juli 2026 |
| **Referensi** | PRD.md v1.1 |

Dokumen ini menjabarkan seluruh alur kerja (workflow) platform dari sisi setiap aktor: **Publik/Klub, Admin, Member, Dealer**. Setiap workflow memuat: aktor, pemicu, prasyarat, langkah utama (happy path), alur alternatif/error, dan hasil akhir.

---

## 0. Peta Alur Utama (Loop Inti)

```
[W1] Klub daftar & ajukan sponsorship
        │
        ▼
[W2] Admin review → APPROVED → halaman invitation event ter-generate
        │
        ▼
[W3] Member registrasi via invitation/QR → dapat QR card + kode referral
        │
        ▼
[W4] Member belanja di dealer → dealer scan QR → input transaksi → konfirmasi
        │
        ▼
[W5] Sistem otomatis: diskon tercatat + poin referral (jika ada) + poin klub
        │
        ▼
[W6] Member/klub redeem poin → approval admin → fulfillment
        │
        ▼
[W8] Semua data terlihat di dashboard admin → evaluasi → event berikutnya
```

Loop inti ini adalah definisi sukses MVP (PRD §2). Semua workflow lain (W7 void, W9 auth, W10 manajemen) adalah pendukung agar loop ini berjalan aman.

---

## W1 — Registrasi Klub & Pengajuan Sponsorship

**Aktor**: Pengurus klub (publik, belum tentu punya akun)
**Pemicu**: Klub punya acara dan ingin mengajukan sponsorship
**Prasyarat**: —
**Layar terkait**: Landing page (#1), Formulir registrasi & pengajuan (#2)

### Happy path
1. Pengurus membuka landing page → klik **"Ajukan Sponsorship"**.
2. Sistem memeriksa: apakah pengurus login sebagai klub terdaftar?
   - **Belum terdaftar** → formulir gabungan: **Profil Klub** (nama komunitas, jumlah anggota, rentang tahun mobil [2 input: mulai & akhir], nama ketua, upload logo) + **Data Acara** (nama acara, tanggal, dana diajukan, benefit yang ditawarkan, kontak PIC).
   - **Sudah terdaftar & login** → formulir hanya **Data Acara**; profil klub terisi otomatis.
3. Upload logo: validasi format (JPG/PNG, SVG opsional), **tanpa batas ukuran** → sistem auto-compress/resize sisi server (normalisasi maks. 1024×1024 px) dengan progress indicator.
4. Validasi field: numerik untuk jumlah anggota & dana, tahun 4 digit, tahun akhir ≥ tahun mulai.
5. Submit → sistem:
   - Membuat/memperbarui entitas **Klub** (jika baru: status `unverified`).
   - Membuat entitas **Pengajuan Sponsorship** status `PENDING`.
   - Menghitung **rekomendasi tier otomatis** (Micro/Small/Medium/Big) berdasar jumlah member & skala acara.
   - Membuat akun klub (kredensial dikirim ke kontak PIC) jika klub baru.
6. Layar konfirmasi: "Pengajuan diterima, tim kami akan meninjau" + nomor pengajuan.

### Alur alternatif / error
- **A1. Nama komunitas sudah terdaftar** → sistem tawarkan login sebagai klub tersebut, bukan membuat duplikat.
- **A2. Upload logo gagal/format salah** → pesan error spesifik; pengajuan tidak boleh hilang (data form dipertahankan).
- **A3. Klub daftar tanpa acara** (hanya ingin registrasi) → diizinkan: submit profil klub saja, pengajuan sponsorship menyusul kapan pun dari dashboard klub.

**Hasil**: Klub terdaftar + pengajuan berstatus `PENDING`, terlihat di antrean admin (W2) dan dashboard klub (#11).

---

## W2 — Review & Approval Sponsorship (Admin)

**Aktor**: Admin Sailun/HipPro
**Pemicu**: Ada pengajuan `PENDING` di antrean
**Layar terkait**: Approval sponsorship (#15)

### Happy path
1. Admin membuka antrean approval → melihat daftar pengajuan `PENDING` dengan ringkasan: klub, acara, tanggal, dana diajukan, **rekomendasi tier sistem**.
2. Admin membuka detail → memeriksa kelengkapan & kewajaran (profil klub, benefit yang ditawarkan).
3. Admin memutuskan:
   - **APPROVE** → pilih tier final (boleh berbeda dari rekomendasi) + catatan opsional.
   - **REJECT** → wajib isi alasan.
4. Jika `APPROVED`, sistem otomatis:
   - Mengubah status klub `unverified` → `active` (jika pengajuan pertamanya).
   - **Men-generate halaman invitation event** dengan URL unik (mis. `/e/{slug-acara}`) + QR event untuk dicetak/dibagikan.
   - Mencatat tier & paket sponsorship pada event.
5. Status baru terlihat di dashboard klub; klub mendapat link invitation untuk disebarkan.

### State machine pengajuan
```
PENDING ──approve──▶ APPROVED ──(event selesai)──▶ COMPLETED
   │
   └──reject──▶ REJECTED (final; klub boleh ajukan ulang sebagai pengajuan baru)
```

### Alur alternatif / error
- **A1. Data kurang** → admin dapat mengembalikan dengan catatan (status tetap `PENDING`, ada flag "butuh revisi") — klub mengedit dan resubmit.
- **A2. Tanggal acara lewat sebelum direview** → sistem menandai `EXPIRED` otomatis; admin bisa reaktivasi bila tanggal diubah klub.

> **Catatan konsistensi copy**: UI publik tidak menjanjikan "auto-approve <5 detik". Yang otomatis adalah *asesmen tier*; keputusan tetap admin (PRD §9.3).

**Hasil**: Event `APPROVED` + halaman invitation live → masuk W3.

---

## W3 — Registrasi Member & Konfirmasi Kehadiran Event

> **Revisi besar**: W3 semula menyatukan "jadi member" dan "hadir di event" sebagai satu aksi. Sejak fitur `EventAttendance` ditambahkan, keduanya **entitas terpisah** — satu member bisa terikat ke satu klub secara permanen, sekaligus mencatat kehadiran ke banyak event berbeda dari waktu ke waktu. Password sekarang **dipilih sendiri oleh user** (bukan digenerate sistem) di semua sub-alur registrasi.

### W3a — Registrasi Member via Profil Klub (`/k/[clubSlug]`)

**Aktor**: Calon member (publik)
**Pemicu**: Menerima link/QR profil klub (bukan event tertentu)
**Prasyarat**: Klub `active`
**Layar terkait**: Halaman profil klub (#3-varian), Dashboard member (#5)
**Sifat**: **Tanpa batas waktu** — terbuka kapan saja, tidak terikat satu acara.

1. Calon member membuka `/k/[clubSlug]` → form: nama, usia, telepon, email, tipe mobil, tahun mobil, gender, **password + konfirmasi password** (dipilih sendiri).
2. Validasi: format email, format telepon Indonesia, tahun 4 digit, password ≥8 karakter & cocok dengan konfirmasi; **telepon & email unik**.
3. Submit → sistem membuat **Member** baru: asosiasi ke `clubId` dari slug klub, `eventAsalId` = `NULL` (tidak berasal dari event manapun), QR card + kode referral pribadi ter-generate.
4. Member diarahkan ke dashboard: QR card, saldo poin (0), kode referral. **Tidak ada tiket event** — alur ini murni keanggotaan.

**Alur alternatif**: telepon/email sudah terdaftar → arahkan ke login, bukan buat akun ganda.

**Hasil**: Member `active` terikat ke klub, siap masuk W4 (transaksi dealer) kapan saja.

---

### W3b — Konfirmasi Kehadiran Event via Invitation (`/e/[slug]`)

**Aktor**: Calon member ATAU member existing dari klub penyelenggara
**Pemicu**: Menerima link/QR invitation event
**Prasyarat**: Event `APPROVED`, **tanggal acara belum lewat**
**Layar terkait**: Halaman invitation event (#3), Login (#4), Dashboard member (#5)
**Sifat**: **Berbatas waktu** — pendaftaran/konfirmasi otomatis tertutup begitu `tanggalAcara` terlewati, berlaku sama untuk pengunjung yang sudah login maupun belum.

**Langkah 0 — Gate waktu (berlaku sebelum apapun lain):**
Sistem cek `tanggalAcara` event vs waktu sekarang.
- **Sudah lewat** → tampilkan "Pendaftaran Ditutup", **tidak ada form/tombol sama sekali**, untuk siapa pun. Alur berhenti di sini.
- **Belum lewat** → lanjut ke Langkah 1.

**Langkah 1 — Cabang berdasar status login:**
- **Belum login** → tampil dua pilihan: "Sudah Punya Akun? Login" (lanjut W3b-Alur A) atau "Belum? Daftar di Sini" (lanjut W3b-Alur B).
- **Sudah login** → langsung ke W3b-Alur A.

**W3b-Alur A (member existing, login diperlukan):**
1. Kalau belum login saat klik "Login" → redirect ke `/login?callbackUrl=/e/[slug]`, otomatis kembali ke halaman invitation setelah sukses login.
2. Sistem (di dalam fungsi `confirmAttendance()`, bukan hanya di UI — pertahanan berlapis) cek:
   - Role harus `MEMBER` (role lain ditolak dengan pesan jelas).
   - `member.clubId` **harus sama** dengan klub penyelenggara event — member klub lain ditolak, tidak bisa konfirmasi hadir ke event klub yang berbeda.
   - Event belum lewat tanggal (re-cek di server, bukan cuma percaya hasil cek client).
3. Kalau member ini **belum pernah** konfirmasi ke event ini → insert `EventAttendance` baru → tampilkan **tiket event** (`event-ticket`, QR encode `eventattendance.id`).
4. Kalau **sudah pernah** (idempotent, dicek via `findUnique` lalu ditangkap juga di `catch` untuk kasus race P2002 saat request bersamaan) → langsung tampilkan tiket yang sudah ada, tanpa insert baru, tanpa error.

**W3b-Alur B (belum punya akun, registrasi baru):**
1. Reuse form registrasi member (field sama seperti W3a, ditambah **password dipilih sendiri**).
2. Submit → **satu `$transaction`**: create User + create Member (`clubId` = klub penyelenggara, `eventAsalId` = event ini, sebagai atribusi asal) + create `EventAttendance` sekaligus.
3. Layar sukses: **tiket event saja** (bukan info member card — itu baru terlihat nanti setelah mereka login ke dashboard).

**Hasil**: Member (baru atau existing) punya `EventAttendance` untuk event tersebut + tiket digital siap dipakai dasar fitur check-in di fase mendatang.

---

## W4 — Transaksi di Dealer

> **Revisi besar (pasca-fitur `referredByMemberId`)**: referral **tidak lagi diketik dealer per-transaksi**. Referral sekarang ditentukan **sekali, permanen, saat member pertama kali daftar** (via `?ref=` di link klub — lihat W3a/W3b), tersimpan di `member.referredByMemberId`. Dealer HANYA menangani member yang **sudah terdaftar** — alur "daftarkan member baru di dealer" **dihapus total** untuk menjaga alur dealer tetap singkat. Kalau pembeli belum member, dealer mengarahkan mereka mendaftar sendiri (device sendiri, link klub/event), bukan diproses lewat form di layar dealer.

**Aktor**: Petugas dealer + member
**Pemicu**: Pembeli (member terdaftar) datang ke dealer resmi untuk membeli ban Sailun
**Prasyarat**: Dealer terdaftar & petugas login; pembeli **sudah** member terdaftar
**Layar terkait**: Scan QR + input transaksi (#8)

### Happy path
1. Petugas dealer login → buka layar **Scan QR**.
2. Scan QR card member via kamera browser. **Fallback**: input ID member manual.
3. Sistem menampilkan kartu verifikasi: nama member, klub, status keanggotaan, **besaran diskon yang berlaku** (parameter dari admin — nominal/persentase sesuai keputusan stakeholder).
4. Petugas menginput: produk (pilih dari daftar) + nominal transaksi (sebelum diskon). **Tidak ada kolom kode referral** — dealer tidak perlu tahu/tanya siapa yang mereferensikan pembeli ini.
5. Sistem menghitung & menampilkan: harga − diskon member = **harga final**. Petugas mencocokkan dengan kasir.
6. Petugas menekan **Konfirmasi Transaksi**.
7. Sistem (atomik, satu kesatuan): mencatat transaksi `CONFIRMED` → cek `member.referredByMemberId` secara otomatis di belakang layar → memicu W5 (distribusi poin).
8. Layar sukses menampilkan ringkasan: diskon diberikan, poin klub terdistribusi (poin referral ke pengajak terjadi diam-diam, tidak perlu ditampilkan detail ke dealer).

### Alur alternatif / error
- **A1. QR tidak terbaca** (rusak/layar retak) → input ID member manual; sistem tetap menampilkan kartu verifikasi sebelum lanjut.
- **A2. Member tidak ditemukan / status nonaktif** → transaksi **tidak bisa diproses**. Petugas informasikan ke pembeli untuk mendaftar sendiri lewat link klub mereka (device pembeli sendiri) — **tidak ada** form registrasi di layar dealer. Transaksi dealer berhenti di sini sampai pembeli sudah jadi member (bisa lain waktu, bukan wajib di kunjungan yang sama).
- **A3. Koneksi putus saat konfirmasi** → transaksi tidak boleh tercatat ganda (idempotent per sesi scan); petugas melihat status jelas: tersimpan atau tidak.

*(Alur A3-A5 versi lama — "daftarkan member baru di dealer", "kode referral tidak valid", "self-referral" — sudah tidak relevan lagi. Self-referral kini mustahil terjadi secara struktural: member baru tidak bisa mereferensikan kode dirinya sendiri yang belum ada saat dia daftar.)*

### State machine transaksi
```
DRAFT (sedang diinput) ──konfirmasi──▶ CONFIRMED ──void admin──▶ VOIDED
```

**Hasil**: Transaksi `CONFIRMED` dengan atribusi lengkap (member, klub, dealer, produk, nominal, diskon) → poin terdistribusi (W5), termasuk poin referral otomatis kalau member ini punya `referredByMemberId`.

---

## W5 — Distribusi Poin Otomatis (Sistem)

**Aktor**: Sistem (tanpa campur tangan manusia)
**Pemicu**: Transaksi berubah menjadi `CONFIRMED` (W4 langkah 6–7)

### Aturan (parameter dikonfigurasi admin, PRD §5)
| Kondisi | Diskon member | Poin referral (ke `referredByMemberId`) | Poin klub |
|---|---|---|---|
| Member `referredByMemberId` = NULL (organik, tanpa pereferensi) | ✅ langsung di kasir | — | ✅ (mis. 20 poin) |
| Member `referredByMemberId` TERISI (direferensikan saat daftar) | ✅ langsung di kasir | ✅ (mis. 50 poin) — **BERULANG, setiap transaksi member ini seterusnya**, bukan cuma sekali | ✅ (mis. 20 poin) |

### Langkah sistem
1. Baca parameter poin aktif (besaran flat per transaksi, masa berlaku 12 bulan) — snapshot nilainya ke transaksi, bukan referensi live.
2. Cek `member.referredByMemberId` pada member yang bertransaksi (BUKAN dari input form — field ini ditentukan permanen sejak registrasi, lihat W3a/W3b).
3. Tulis entri **ledger poin (append-only)**:
   - `+20` ke klub member pembeli, referensi: ID transaksi — SELALU, terlepas ada referrer atau tidak.
   - `+50` ke member pemilik `referredByMemberId` (kalau field ini terisi) — referensi: ID transaksi. Terjadi **setiap kali** member ini transaksi, bukan cuma transaksi pertama (keputusan bisnis: referral adalah hubungan permanen, pengajak dapat manfaat berkelanjutan dari member yang direkrutnya, bukan cuma bonus sekali).
4. Saldo member/klub = agregasi ledger (tidak pernah di-overwrite langsung).
5. Setiap entri menyimpan: tanggal perolehan + tanggal kedaluwarsa (12 bulan).

### Ketentuan penting
- **Poin klub mengikuti klub si pembeli**, bukan klub pengajak (jika berbeda klub). *(Bisa diubah jadi parameter bila stakeholder minta.)*
- **Referrer yang sudah tidak ada/dihapus** (edge case langka): kalau `referredByMemberId` menunjuk ke member yang entah bagaimana tidak lagi ditemukan, SKIP pemberian poin referral secara senyap — transaksi tetap `CONFIRMED` normal, jangan sampai gagal karena ini.
- Nominal transaksi selalu tersimpan meski poin flat — kesiapan skema proporsional & konversi uang riil di Fase 2 (PRD Non-Goals & P2).
- Distribusi harus **atomik** dengan konfirmasi transaksi: tidak boleh ada transaksi `CONFIRMED` tanpa entri ledger-nya, atau sebaliknya.

**Hasil**: Saldo poin member & klub ter-update seketika; terlihat di dashboard masing-masing dan dashboard admin.

---

## W6 — Redeem Poin (Member & Klub)

**Aktor**: Member atau pengurus klub → Admin
**Pemicu**: Member/klub memilih item dari katalog redeem
**Prasyarat**: Saldo poin mencukupi
**Layar terkait**: Katalog & pengajuan redeem (#7), Poin & riwayat redeem klub (#13), Manajemen poin & redeem admin (#18)

### Happy path
1. Member/klub membuka katalog redeem (merchandise, voucher ban, dukungan event klub) → pilih item → **Ajukan Redeem**.
2. Sistem memeriksa saldo (dengan memperhitungkan poin yang belum kedaluwarsa, **FIFO — poin tertua terpakai lebih dulu**).
3. Poin sejumlah item **di-hold** (entri ledger `HOLD`) agar tidak dobel-pakai selama menunggu approval.
4. Pengajuan berstatus `PENDING` masuk antrean admin.
5. Admin **APPROVE** → status `APPROVED`; poin hold dikonversi jadi `DEBIT` permanen.
6. Fulfillment offline (kirim merchandise / terbitkan voucher / salurkan dukungan event) → admin tandai `FULFILLED` + catatan.
7. Status setiap tahap terlihat oleh pengaju.

### State machine redeem
```
PENDING ──approve──▶ APPROVED ──fulfilled──▶ FULFILLED
   │
   └──reject──▶ REJECTED (poin hold dikembalikan otomatis)
```

### Alur alternatif / error
- **A1. Saldo tidak cukup** → tombol ajukan nonaktif + info kekurangan poin.
- **A2. Reject oleh admin** → wajib alasan; poin hold otomatis kembali (entri ledger pembalik).
- **A3. Poin kedaluwarsa saat pengajuan pending** → poin yang sudah di-hold tidak ikut hangus (hold membekukan masa berlaku).

**Hasil**: Redeem terpenuhi & tercatat; poin terpotong akurat di ledger.

---

## W7 — Void Transaksi (Anti-Fraud)

**Aktor**: Admin
**Pemicu**: Transaksi mencurigakan (pola tidak wajar, laporan dealer, transaksi keliru)
**Layar terkait**: Dashboard/manajemen admin (#14, #18)

### Langkah
1. Admin membuka detail transaksi `CONFIRMED` → klik **Void** → wajib isi alasan.
2. Sistem otomatis:
   - Status transaksi → `VOIDED`.
   - Menulis **entri ledger pembalik** untuk semua poin yang lahir dari transaksi itu (referral + klub).
3. Jika poin sudah terlanjur dipakai redeem → saldo boleh **negatif** (tercatat sebagai piutang poin) dan admin mendapat flag untuk tindak lanjut manual.
4. Riwayat void terlihat di audit trail (siapa, kapan, alasan).

**Hasil**: Data bersih & dapat diaudit; angka dashboard tidak menghitung transaksi void.

---

## W8 — Monitoring & Dashboard (Admin)

**Aktor**: Admin Sailun
**Pemicu**: Rutin / menjelang review KPI (roadmap 30-60-90)
**Layar terkait**: Dashboard analitik (#14)

### Alur
1. Admin membuka dashboard → metrik dasar: **member baru, jumlah & nilai transaksi, poin beredar/terpakai**.
2. Filter: per event / per klub / per dealer / periode.
3. Export **CSV** untuk rekonsiliasi dengan dealer & laporan manajemen.
4. Data dashboard hanya menghitung transaksi `CONFIRMED` (void dikecualikan).

**Hasil**: Bahan review KPI hari-90 tanpa rekap manual — pembuktian janji "data-backed growth".

---

## W9 — Autentikasi & Akses per Peran

**Layar terkait**: Login/Register (#4)

| Peran | Cara mendapat akun | Cara login | Batas akses |
|---|---|---|---|
| Admin | Dibuat manual saat setup | Email + password | Semua data |
| Klub | Otomatis dari W1 (kredensial ke PIC) | Email + password | Hanya data klubnya |
| Dealer | Dibuat admin (W10) per petugas | Email + password | Hanya transaksi tokonya |
| Member | Registrasi W3 | Nomor telepon/email (password atau magic link — keputusan teknis dev) | Hanya datanya sendiri |

Aturan: dealer tidak dapat melihat dealer lain; klub tidak dapat melihat klub lain; member tidak dapat melihat member lain (PRD R6). Sesi login dealer di perangkat toko sebaiknya berumur panjang (remember device) agar alur scan cepat.

---

## W10 — Manajemen Master Data (Admin)

**Layar terkait**: Manajemen klub (#16), dealer (#17), poin & redeem (#18)

1. **Dealer**: admin menambah dealer + akun petugas → dealer siap menerima scan (prasyarat W4). Nonaktifkan dealer = tidak bisa mencatat transaksi baru; riwayat tetap ada.
2. **Klub**: admin dapat mengedit/menonaktifkan klub. Nonaktif = invitation & registrasi member klub itu berhenti; data historis tetap.
3. **Parameter poin**: besaran poin referral & klub, besaran/bentuk diskon member, masa berlaku poin. Perubahan parameter **hanya berlaku untuk transaksi setelahnya** (tidak retroaktif).
4. **Katalog redeem**: CRUD item (nama, deskripsi, harga poin, stok/kuota opsional, aktif/nonaktif).

---

## Ringkasan Status & Notifikasi

### Status per entitas
| Entitas | Status |
|---|---|
| Pengajuan sponsorship | `PENDING → APPROVED → COMPLETED` / `REJECTED` / `EXPIRED` |
| Klub | `unverified → active → inactive` |
| Member | `active → inactive` |
| Transaksi | `DRAFT → CONFIRMED → VOIDED` |
| Redeem | `PENDING → APPROVED → FULFILLED` / `REJECTED` |
| Entri ledger poin | `CREDIT` / `HOLD` / `DEBIT` / `REVERSAL` (+ tanggal kedaluwarsa) |
| EventAttendance | Tanpa status bertahap — keberadaan record = "hadir/konfirmasi tercatat". Unique per (`eventId`, `memberId`), dibuat idempotent lewat `confirmAttendance()` (W3b) |

### Notifikasi MVP (minimal — P1 di PRD)
| Peristiwa | Penerima | Kanal MVP |
|---|---|---|
| Pengajuan sponsorship berubah status | PIC klub | Email (atau manual WA oleh admin bila email belum siap) |
| Redeem berubah status | Pengaju | Email / terlihat di dashboard |
| Kredensial akun klub/dealer dibuat | PIC | Email |

Push notification & PWA = Fase 2 (PRD Non-Goals).

---

## Matriks Workflow × Layar (Traceability)

| Workflow | Layar (PRD §7) |
|---|---|
| W1 | #1, #2 |
| W2 | #15, #11 |
| W3 | #3, #4, #5 |
| W4 | #8, #9 |
| W5 | (sistem) → tampak di #5, #6, #10, #13, #14 |
| W6 | #7, #13, #18 |
| W7 | #14, #18 |
| W8 | #14 |
| W9 | #4 |
| W10 | #16, #17, #18 |

Seluruh 18 layar PRD tercakup; tidak ada layar tanpa workflow, tidak ada workflow tanpa layar.
