# PRD — MVP Sailun Community Platform

| | |
|---|---|
| **Produk** | Sailun Community Platform (Community Commerce Ecosystem) |
| **Versi Dokumen** | v1.1 — Draft MVP (update: spesifikasi field formulir dari HipPro × MB Club INA) |
| **Tanggal** | 31 Juli 2026 |
| **Pemilik** | HipPro (vendor) × PT Sailun Tire Indonesia (brand) |
| **Referensi** | Deck "Strategic Community Activation Program", Penawaran Platform Community Activation, Revisi Copy Microsite (28 Jul 2026), Catatan Diskusi Formulir HipPro × MB Club INA |
| **Status** | Menunggu review |

---

## 1. Latar Belakang & Problem Statement

Sailun Tire Indonesia ingin bertransformasi dari sekadar *event sponsor* menjadi **Official Community Commerce Partner** bagi komunitas otomotif (dimulai dari komunitas Mercedes-Benz Indonesia: 22 tahun, 118 klub, ±12.000 member). Masalah yang dipecahkan:

1. **Bagi Sailun** — sponsorship konvensional tidak terukur: tidak ada data siapa yang membeli karena event, tidak ada database pelanggan, ROI berbasis asumsi.
2. **Bagi klub** — proses pengajuan sponsorship tidak terstruktur (proposal bebas via WA/email), lambat, dan tidak ada benefit berkelanjutan setelah event selesai.
3. **Bagi member** — tidak ada insentif nyata untuk membeli produk sponsor komunitasnya.
4. **Bagi dealer** — tidak ada mekanisme untuk mengenali dan melayani member komunitas secara berbeda.

Tanpa platform, janji utama proposal ("100% transaksi tertrack", "automated referral system", "data-backed growth") tidak dapat dibuktikan.

---

## 2. Tujuan MVP (Goals)

MVP dianggap berhasil jika **satu loop inti berjalan mulus dari ujung ke ujung**:

> **Klub mengajukan sponsorship → disetujui → halaman invitation event ter-generate → member mendaftar & mendapat QR card → member belanja di dealer → dealer scan QR → diskon terpasang → poin otomatis terdistribusi (member pengajak + klub) → seluruh transaksi terlihat di dashboard admin.**

Tujuan terukur:

1. **Pembuktian tracking** — 100% transaksi member melalui platform tercatat dan dapat diaudit per event/klub/dealer.
2. **Akuisisi member** — funnel dari halaman invitation event menghasilkan registrasi member digital dengan data terstruktur (target awal ditetapkan bersama Sailun, mis. 500 member dalam 90 hari pertama).
3. **Standardisasi pengajuan sponsorship** — 100% pengajuan klub masuk lewat formulir microsite (menggantikan proposal tak terstruktur).
4. **Distribusi reward otomatis** — poin referral & poin klub terkredit otomatis saat transaksi dikonfirmasi dealer, tanpa administrasi manual.
5. **Dashboard keputusan** — admin Sailun dapat melihat member baru, jumlah & nilai transaksi, dan poin beredar per event/klub tanpa rekap manual.

---

## 3. Non-Goals (Di Luar Scope MVP)

| Non-Goal | Alasan |
|---|---|
| **Reward berbentuk uang riil / cashback** (mis. Rp 50rb ke rekening member) | Butuh mekanisme settlement dengan dealer & aspek finansial/pajak. MVP memakai **poin**. Desain data harus siap dikonversi ke uang di fase berikutnya. |
| **Integrasi POS dealer** | Kompleksitas integrasi tinggi & beragam antar dealer. MVP memakai input transaksi manual oleh dealer setelah scan QR. |
| **Berita/artikel, direktori publik klub & dealer** | Nice-to-have, tidak membuktikan loop inti. Fase 2. |
| **Push notification & PWA penuh** | Fase 2. MVP cukup web responsive + notifikasi email/WA manual bila perlu. |
| **Analitik ROI mendalam (funnel, kohort, LTV)** | Fase 2. MVP cukup metrik dasar (member, transaksi, poin). |
| **Redeem otomatis / katalog e-commerce** | Redeem MVP bersifat **semi-manual dengan approval admin**. |
| **Multi-brand / white-label** | Platform MVP khusus Sailun. |

---

## 4. Pengguna & Peran

| Peran | Deskripsi | Akses |
|---|---|---|
| **Admin/Brand (Sailun)** | Tim Sailun/HipPro yang mengelola program | Dashboard admin penuh |
| **Klub/Komunitas** | Pengurus klub otomotif (mis. MB Club chapter) | Dashboard klub |
| **Member** | Anggota klub yang terdaftar di platform | Dashboard member + QR card |
| **Dealer** | Dealer resmi Sailun yang berpartisipasi | Halaman scan & transaksi |
| **Publik** | Pengunjung microsite / calon klub & member | Landing page, formulir pengajuan, halaman invitation |

---

## 5. Ekonomi Poin (Keputusan Kunci)

Semua reward di MVP berbentuk **poin**, kecuali diskon member yang tetap berupa **potongan harga langsung** di kasir (ini "hook" utama di titik transaksi — jika diskon pun jadi poin, insentif tunjukkan-QR hilang).

| Pihak | Reward | Bentuk MVP |
|---|---|---|
| Member (pembeli) | Diskon member (mis. sesuai skema, contoh deck: Rp 300rb) | **Diskon harga langsung** — dicatat sistem, ditanggung skema Sailun–dealer |
| Member (pengajak/referral) | Contoh deck: Rp 50rb | **50 poin** ke akun pengajak |
| Klub | Contoh deck: Rp 20rb | **20 poin** ke saldo klub |

**Aturan poin (parameter, dapat dikonfigurasi admin):**

1. **Nilai acuan**: 1 poin ≈ Rp 1.000 (konsisten dengan angka contoh di deck).
2. **Basis perhitungan**: flat per transaksi terkonfirmasi (bukan proporsional nominal) — sederhana untuk MVP. Nominal transaksi tetap dicatat untuk analitik & kesiapan skema proporsional di fase 2.
3. **Pembelian langsung tanpa referral**: member tetap dapat diskon; poin klub tetap terkredit; tidak ada poin referral.
4. **Masa berlaku poin**: 12 bulan sejak diperoleh.
5. **Redeem**: dari katalog sederhana (merchandise, voucher ban, dukungan event klub) → diajukan member/klub → **approval admin** → fulfillment offline → status tercatat.
6. **Anti-fraud minimal**: satu transaksi hanya dari satu sesi scan yang dikonfirmasi dealer; admin dapat melakukan *void* transaksi (poin terkait ditarik kembali otomatis).

---

## 6. User Stories

### Publik / Klub
- Sebagai **pengurus klub**, saya ingin mengajukan sponsorship acara lewat formulir online agar prosesnya cepat dan statusnya jelas.
- Sebagai **pengurus klub**, saya ingin melihat status pengajuan (pending/approved/rejected) agar tidak perlu bertanya via WA.
- Sebagai **pengurus klub**, saya ingin halaman invitation event otomatis tersedia setelah disetujui agar mudah menyebarkan link registrasi ke anggota.
- Sebagai **pengurus klub**, saya ingin melihat saldo poin klub dan riwayatnya agar tahu kontribusi transaksi anggota kami.

### Member
- Sebagai **anggota klub**, saya ingin mendaftar lewat halaman invitation event (atau QR komunitas) dalam <2 menit agar tidak repot.
- Sebagai **member**, saya ingin punya kartu member digital ber-QR agar bisa klaim diskon di dealer.
- Sebagai **member**, saya ingin punya kode/link referral pribadi agar mendapat poin saat mengajak orang lain membeli.
- Sebagai **member**, saya ingin melihat saldo poin, riwayat transaksi, dan status redeem saya.

### Dealer
- Sebagai **petugas dealer**, saya ingin scan QR member dan menginput transaksi (nominal + produk) dalam satu alur singkat agar antrean tidak terhambat.
- Sebagai **petugas dealer**, saya ingin sistem menampilkan besaran diskon member secara otomatis agar tidak salah hitung.
- Sebagai **dealer**, saya ingin melihat riwayat transaksi toko saya untuk rekonsiliasi dengan Sailun.

### Admin/Brand
- Sebagai **admin Sailun**, saya ingin meninjau pengajuan sponsorship dengan klasifikasi tier otomatis (berdasar jumlah member & skala acara) agar keputusan cepat dan konsisten.
- Sebagai **admin**, saya ingin mengelola data klub, dealer, katalog redeem, dan parameter poin.
- Sebagai **admin**, saya ingin meng-approve/menolak pengajuan redeem.
- Sebagai **admin**, saya ingin dashboard ringkas: member baru, transaksi (jumlah & nilai), poin beredar. *(Filter per event/klub/dealer/periode DIHAPUS dari scope MVP — lihat catatan di R5.)*
- Sebagai **admin**, saya ingin dapat mem-void transaksi mencurigakan dan poinnya tertarik otomatis.

---

## 7. Scope Fitur & Screen Inventory

### 7.1 Publik (Microsite)
| # | Halaman | Keterangan |
|---|---|---|
| 1 | **Landing page Community Sponsorship** | Sesuai revisi copy 28 Jul: headline "Sponsorship untuk Komunitasmu", 3 benefit (diskon member, pemeriksaan ban gratis, merchandise eksklusif), CTA "Ajukan Sponsorship". Section social proof "Keluarga Sailun di Seluruh Indonesia" berupa **logo klub** (bukan tabel nominal pengajuan — data sensitif). |
| 2 | **Formulir registrasi & pengajuan sponsorship** | Dua entitas terpisah: **(a) Profil klub** — diisi sekali (lihat §7.7 Formulir Komunitas); **(b) Pengajuan sponsorship** — per event: nama acara, tanggal acara, dana diajukan, benefit yang ditawarkan, kontak PIC. Pengajuan pertama sekaligus membuat profil klub; pengajuan berikutnya cukup memilih klub yang sudah terdaftar. Sistem memberi klasifikasi tier otomatis sebagai rekomendasi. |
| 3 | **Halaman invitation event** (per event, auto-generate) | Info event + tombol registrasi member. Mesin akuisisi member. |

### 7.2 Auth
| # | Halaman | Keterangan |
|---|---|---|
| 4 | **Login / Register** | Register member via invitation/QR komunitas; login semua role (admin, klub, dealer, member) dengan role-based access. |

### 7.3 Member
| # | Halaman | Keterangan |
|---|---|---|
| 5 | **Dashboard member + QR card** | Kartu digital ber-QR (ID member), saldo poin, kode/link referral pribadi. |
| 6 | **Riwayat transaksi & poin** | Transaksi, diskon diterima, poin masuk/keluar, masa berlaku. |
| 7 | **Katalog & pengajuan redeem** | Pilih item → ajukan → status (pending/approved/rejected/fulfilled). |

### 7.4 Dealer
| # | Halaman | Keterangan |
|---|---|---|
| 8 | **Scan QR + input transaksi** | Scan via kamera browser → data member tampil (nama, klub, status) → input nominal & produk → diskon otomatis tampil → konfirmasi → poin terdistribusi. Fallback: input manual ID member. |
| 9 | **Riwayat transaksi dealer** | Daftar transaksi toko, filter tanggal. |

### 7.5 Klub
| # | Halaman | Keterangan |
|---|---|---|
| 10 | **Dashboard klub** | Profil klub, saldo poin klub, ringkasan anggota terdaftar. |
| 11 | **Pengajuan & status sponsorship** | Riwayat pengajuan + status; link ke halaman invitation event yang sudah approved. |
| 12 | **Manajemen anggota** | Daftar member klub (nama, tanggal daftar, status). |
| 13 | **Poin & riwayat redeem klub** | Riwayat poin masuk + pengajuan redeem klub. |

### 7.6 Admin/Brand
| # | Halaman | Keterangan |
|---|---|---|
| 14 | **Dashboard analitik** | Metrik dasar: member baru, transaksi (jumlah & nilai), poin beredar/terpakai. Termasuk section "Butuh Perhatian" (pengajuan & redeem menunggu) dan trend 7-hari per metrik. *(Filter event/klub/dealer/periode dihapus — lihat R5.)* |
| 15 | **Approval sponsorship** | Antrean pengajuan + rekomendasi tier otomatis + approve/reject + catatan. Approval memicu auto-generate halaman invitation. |
| 16 | **Manajemen klub** | CRUD klub, status keanggotaan program. |
| 17 | **Manajemen dealer** | CRUD dealer + akun petugas. |
| 18 | **Manajemen poin & redeem** | Katalog redeem, approval redeem, parameter poin (besaran, masa berlaku), void transaksi. |

### 7.7 Spesifikasi Field Formulir (input HipPro × MB Club INA)

**Formulir Komunitas** — registrasi profil klub (diisi sekali):

| Field | Tipe | Validasi |
|---|---|---|
| Nama komunitas | Teks | Wajib, unik (cth. "Mercedes-Benz Club Bandung") |
| Jumlah anggota | Numerik | Wajib, >0 |
| Rentang tipe/tahun mobil komunitas | 2 input: tahun mulai & tahun akhir | Numerik 4 digit, tahun akhir ≥ tahun mulai |
| Nama ketua komunitas | Teks | Wajib |
| Logo klub | Upload | Format JPG/PNG (SVG opsional). **Tanpa batas ukuran file** — sistem melakukan **auto-compress/resize sisi server saat upload** (mis. dinormalisasi ke maks. 1024×1024 px, WebP/PNG teroptimasi) sebelum disimpan. |

Logo klub dari formulir ini sekaligus menjadi aset section social proof "Keluarga Sailun di Seluruh Indonesia" di landing page (dengan persetujuan klub).

**Formulir Member** — registrasi anggota via halaman invitation:

| Field | Tipe | Validasi |
|---|---|---|
| Nama member | Teks | Wajib |
| Usia | Numerik | Wajib, rentang wajar (mis. 17–100) |
| Nomor telepon | Teks | Format nomor Indonesia, unik (identitas login/OTP potensial) |
| Alamat email | Teks | Format email valid, unik |
| Tipe mobil | Teks/dropdown | Wajib |
| Tahun pembuatan mobil | Numerik | 4 digit |
| Gender | Pilihan tetap | Laki-laki / Perempuan |

Data kendaraan (tipe & tahun mobil) adalah **inti dari janji "premium customer database"** di deck — memungkinkan Sailun memetakan kebutuhan ban per segmen kendaraan. Field ini wajib, bukan opsional.

> **Total: 18 layar** dalam 6 kelompok. Ini superset dari 13 halaman di dokumen penawaran, dengan penyesuaian: berita/artikel, direktori publik, push notification, dan PWA dipindah ke Fase 2.

---

## 8. Requirements

### P0 — Must-Have (MVP tidak bisa rilis tanpa ini)

**R1. Pengajuan & approval sponsorship**
- [ ] Formulir publik tersimpan sebagai entitas Klub + Event (bukan email); profil klub (termasuk logo, ketua, rentang tahun mobil — §7.7) dan pengajuan sponsorship adalah entitas terpisah: satu klub dapat memiliki banyak pengajuan.
- [ ] Upload logo menerima file ukuran berapa pun (validasi format saja), di-auto-compress/resize otomatis saat upload, lalu tampil di profil klub; proses kompresi tidak boleh membuat upload gagal untuk file besar (progress indicator bila perlu).
- [ ] Sistem menghitung rekomendasi tier otomatis dari jumlah member & skala acara; keputusan akhir tetap admin (hybrid — konsisten dengan copy microsite "tim kami langsung bantu prosesnya").
- [ ] Status pengajuan (pending/approved/rejected) terlihat oleh klub.
- [ ] Approval otomatis men-generate halaman invitation event dengan URL unik.

**R2. Registrasi & QR card member**
- [ ] Member dapat mendaftar dari halaman invitation atau QR komunitas dalam satu alur (<2 menit, mobile-first) dengan field sesuai §7.7: nama, usia, nomor telepon, email, tipe mobil, tahun pembuatan mobil, gender.
- [ ] Validasi dasar berjalan: format email, format nomor telepon Indonesia, tahun numerik; nomor telepon & email unik per member.
- [ ] Setiap member mendapat ID unik + QR card digital + kode referral pribadi.
- [ ] Member otomatis terasosiasi ke klub asal (dari invitation yang dipakai).

**R3. Transaksi di dealer**
- [ ] Dealer scan QR member (kamera browser) atau input ID manual sebagai fallback.
- [ ] Sistem menampilkan identitas member + besaran diskon yang berlaku.
- [ ] Dealer menginput nominal & produk, lalu konfirmasi.
- [ ] Given transaksi dikonfirmasi, When ada kode referral terlampir, Then poin referral terkredit ke pengajak DAN poin klub terkredit ke klub — otomatis, tanpa langkah admin.
- [ ] Given transaksi dikonfirmasi tanpa referral, Then diskon tetap berlaku dan poin klub tetap terkredit.
- [ ] Semua transaksi tercatat: member, klub, dealer, event asal registrasi, nominal, diskon, poin.

**R4. Poin & redeem**
- [ ] Saldo & riwayat poin akurat untuk member dan klub (ledger append-only; saldo = hasil agregasi, bukan angka yang di-overwrite).
- [ ] Pengajuan redeem dari katalog → approval admin → status fulfillment tercatat.
- [ ] Void transaksi oleh admin menarik kembali poin terkait secara otomatis.

**R5. Dashboard admin**
- [x] Metrik: member baru, jumlah & nilai transaksi, poin beredar.
- [x] Section "Butuh Perhatian" (jumlah pengajuan sponsorship & redeem berstatus PENDING, dengan link aksi) — TETAP tampil walau angkanya 0.
- [x] Trend 7-hari per metrik (delta vs periode sebelumnya).
- [x] Export CSV sederhana untuk rekonsiliasi.
- [ ] ~~Filter per event/klub/dealer/periode~~ — **DIHAPUS dari scope MVP** (keputusan user, dashboard Fase 6). Alasan: kompleksitas menyinkronkan filter ke section "Butuh Perhatian" & trend (yang secara semantik tidak semuanya cocok difilter per dealer/event — pengajuan PENDING belum punya Event, misalnya) dinilai tidak sepadan untuk MVP. Dashboard cukup menampilkan data all-time. Filter bisa dipertimbangkan lagi di fase pasca-MVP kalau kebutuhan riil muncul.

**R6. Fondasi**
- [ ] Role-based access (5 peran) — dealer tidak bisa melihat data dealer lain; klub tidak bisa melihat data klub lain.
- [ ] Web responsive (mobile-first untuk member & dealer).
- [ ] Bahasa Indonesia, tone "kamu" yang akrab — konsisten dengan revisi copy microsite di seluruh platform.

### P1 — Nice-to-Have (fast follow bila waktu memungkinkan)
- Notifikasi email otomatis untuk perubahan status pengajuan & redeem.
- Halaman detail event dengan galeri/deskripsi kaya.
- Filter & pencarian lanjutan di tabel admin.
- Widget statistik di dashboard klub (transaksi anggota per bulan).

### P2 — Future Considerations (desain harus tidak menghalangi ini)
- Konversi poin → benefit uang riil / settlement dealer (karenanya: nominal transaksi selalu dicatat, ledger poin menyimpan referensi transaksi).
- Integrasi POS dealer.
- Skema poin proporsional terhadap nominal.
- PWA + push notification.
- Berita/artikel & direktori publik klub/dealer.
- Analitik ROI mendalam; e-warranty & CX tools (disebut di deck slide platform).
- Multi-komunitas di luar Mercedes-Benz.

---

## 9. Keputusan Desain & Konsistensi

1. **Taksonomi tier harus disatukan sebelum development.** Deck memakai *Micro/Small/Medium/Big* (paket sponsorship), microsite memakai badge *Gold/Silver/Bronze*. Rekomendasi: **Micro–Big = tier paket sponsorship (internal, sisi admin)**; Gold/Silver/Bronze **tidak dipakai di MVP** untuk menghindari dua taksonomi — atau ditetapkan sebagai status klub terpisah bila Sailun menginginkannya. ⚠️ Butuh keputusan stakeholder.
2. **Sponsorship pool tidak menampilkan nominal pengajuan klub lain** di halaman publik (data sensitif) — diganti logo klub sebagai social proof.
3. **Klaim otomasi di copy = hybrid nyata**: asesmen tier otomatis sebagai rekomendasi, keputusan admin. Jangan menjanjikan "auto-approve <5 detik" di UI bila alurnya menunggu admin.
4. **Diskon member**: besaran ditetapkan Sailun (deck memberi contoh Rp 300rb; microsite menyebut 38%) — angka final adalah parameter yang dikonfigurasi admin, bukan hardcode. ⚠️ Butuh keputusan stakeholder: nominal tetap vs persentase.

---

## 10. Success Metrics

| Kategori | Metrik | Target Awal (usulan, difinalkan bersama Sailun) |
|---|---|---|
| Leading | Registrasi member via invitation | ≥500 member dalam 90 hari |
| Leading | Waktu registrasi member | <2 menit (p90) |
| Leading | Waktu alur scan→konfirmasi di dealer | <60 detik (p90) |
| Leading | Pengajuan sponsorship via platform | 100% pengajuan baru lewat formulir |
| Leading | Tingkat keberhasilan scan QR | ≥95% tanpa fallback manual |
| Lagging | Transaksi member tercatat | Tumbuh bulan-ke-bulan; menjadi baseline ROI |
| Lagging | Klub aktif (≥1 transaksi anggota/bulan) | ≥10 klub dalam 90 hari |
| Lagging | Redeem terpenuhi | ≥80% pengajuan redeem selesai <14 hari |

Evaluasi: review KPI hari-90 bersama manajemen Sailun (selaras roadmap 30-60-90 di deck).

---

## 11. Timeline & Phasing

Selaras roadmap 30-60-90 hari di deck proposal:

| Fase | Periode | Deliverable Platform |
|---|---|---|
| **30 hari — Build the Foundation** | Bulan 1 | Microsite + formulir pengajuan + approval admin + auto-generate invitation. Registrasi member + QR card. Setup dealer & pelatihan. |
| **60 hari — Launch & Activate** | Bulan 2 | Alur scan & transaksi dealer live. Distribusi poin otomatis. Aktivasi di event skala Micro–Medium. Mulai kumpulkan data. |
| **90 hari — Scale & Measure** | Bulan 3 | Dashboard analitik lengkap + export. Katalog & alur redeem. Review KPI. Persiapan aktivasi event nasional (paket Big). |

**Konstrain**: budget penawaran Rp 12.000.000 termasuk maintenance & garansi 3 bulan. Scope P0 di atas dirancang agar realistis dalam budget ini; setiap penambahan scope P1 harus disertai pengurangan scope lain atau penyesuaian biaya/waktu.

**Dependensi eksternal:**
- MoU dengan kepemimpinan komunitas Mercedes-Benz (prasyarat aktivasi).
- Kesepakatan skema diskon Sailun–dealer (siapa menanggung diskon member).
- Daftar dealer partisipan gelombang pertama + PIC per dealer.
- Aset brand (logo klub untuk social proof, materi visual Sailun).

---

## 12. Open Questions

| # | Pertanyaan | Pemilik Jawaban | Blocking? |
|---|---|---|---|
| 1 | Besaran & bentuk diskon member final: nominal tetap (cth. Rp 300rb) atau persentase (cth. 38%)? Berlaku untuk produk tertentu atau semua? | Sailun (bisnis) | ✅ Ya — mempengaruhi logika kasir |
| 2 | Siapa menanggung diskon member — Sailun reimburse dealer, atau margin dealer? | Sailun × Dealer | ✅ Ya — mempengaruhi kesediaan dealer |
| 3 | Finalisasi taksonomi tier (Micro–Big vs Gold–Silver–Bronze) | Sailun × HipPro | ✅ Ya — mempengaruhi data model |
| 4 | Besaran poin final (referral & klub) dan katalog redeem awal | Sailun (bisnis) | ⬜ Tidak — parameter, bisa diisi belakangan |
| 5 | Verifikasi keanggotaan klub: apakah registrasi member perlu validasi pengurus klub, atau open by invitation link? | Sailun × Klub | ⬜ Tidak — MVP bisa mulai open, validasi menyusul |
| 6 | Kebijakan data pribadi member (consent, penyimpanan, penggunaan untuk marketing) | Sailun (legal) | ⬜ Tidak blocking dev, tapi wajib sebelum launch |
| 7 | Domain & hosting: subdomain Sailun resmi atau domain terpisah? | Sailun × HipPro | ⬜ Tidak |
| 8 | Verifikasi final daftar field formulir (§7.7) dengan tim MB Club INA | HipPro × MB Club INA | ✅ Ya — mempengaruhi data model & mockup form |

> ✅ **Diputuskan (31 Jul 2026)**: file logo **tidak dibatasi ukurannya**; sistem melakukan auto-compress saat upload (lihat §7.7 dan R1).

---

## 13. Lampiran — Pemetaan Janji Proposal → Fitur Platform

| Janji di Deck | Implementasi MVP |
|---|---|
| Automated Transaction Engine | Scan QR dealer + distribusi poin otomatis (R3) |
| 100% Member Transactions Tracked | Ledger transaksi & poin + dashboard admin (R3, R5) |
| Structured Proposal Intake | Formulir pengajuan + tier otomatis + approval (R1) |
| Community rewards ke kas klub | Poin klub otomatis per transaksi (R3, R4) |
| Customer Database Activation | Registrasi member via invitation event dengan data demografis & kendaraan — tipe dan tahun mobil (R2, §7.7) |
| Data & Performance Dashboard | Dashboard metrik dasar + export CSV (R5) |
| Replacing One-Time Sponsorship | Loop berkelanjutan: event → member → transaksi → reward → event berikutnya |
