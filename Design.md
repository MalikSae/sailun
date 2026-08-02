---
version: 2.3
name: Sailun-Community-design-system
description: Design system premium-tenang untuk platform komunitas Mercedes-Benz Indonesia. Kanvas krem hangat (bukan putih pekat, bukan navy gelap), sidebar navy Sailun asli dengan gradasi halus (v2.2 — meniru gradasi di cover deck resmi), satu aksen oranye Sailun asli dipakai SANGAT hemat (garis nav aktif, satu titik angka statistik, tombol CTA utama). Status badge dan warna semantik diredam (soft-tint), bukan warna solid terang. v2.2 menambahkan token `gradient-graphite` untuk seluruh elemen berlatar navy (sidebar, member-qr-card, referral-share-card, footer, qr-scan-viewport) — gradasi diagonal halus, bukan navy solid rata, mengambil detail visual dari cover deck resmi. Struktur premium-senyap v2.0/v2.1 dipertahankan penuh.

colors:
  canvas: "#F5F3EF"
  card: "#FFFFFF"
  ink: "#15171A"
  body: "#5B5D62"
  muted: "#94969B"
  hairline: "#E7E4DE"
  hairline-strong: "#D8D4CC"
  graphite: "#0E2A4D"
  graphite-soft: "#173A63"
  graphite-text: "#8A9BB5"
  graphite-text-strong: "#F0F3F8"
  accent: "#F5760F"
  accent-soft: "#FDEEE0"
  accent-hover: "#D4640D"
  on-accent: "#FDFCFA"
  gradient-graphite: "linear-gradient(160deg, #0E2A4D 0%, #173A63 100%)"
  member-card-bg: "#081A33"
  success: "#3F6B4A"
  success-soft: "#EBF2EC"
  warning: "#9A6B1F"
  warning-soft: "#FBF1DF"
  danger: "#9B3A34"
  danger-soft: "#FAECEA"
  info: "#3F5E70"
  info-soft: "#E8EEF0"

typography:
  display-xl:
    fontFamily: "Archivo, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.5px
  display-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.3px
  display-md:
    fontFamily: "Archivo, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.2px
  display-sm:
    fontFamily: "Archivo, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  stat-number:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
  title-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "Archivo, sans-serif"
    fontSize: 14.5px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  label-uppercase:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 10.5px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.8px
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 12.5px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 11.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.15px
  button:
    fontFamily: "Archivo, sans-serif"
    fontSize: 13.5px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0.1px
  nav-link:
    fontFamily: "Inter, sans-serif"
    fontSize: 13.5px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    hoverColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-danger:
    backgroundColor: transparent
    textColor: "{colors.danger}"
    border: "1px solid {colors.danger}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 20px
    height: 40px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
    padding: 8px 10px
  button-icon:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.full}"
    size: 36px
  top-nav:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  app-topbar:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    typography: "{typography.label-uppercase}"
    height: 56px
    borderBottom: "1px solid {colors.hairline}"
  sidebar-nav:
    backgroundColor: "{colors.gradient-graphite}"
    textColor: "{colors.graphite-text}"
    typography: "{typography.nav-link}"
    width: 248px
  bottom-nav-mobile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    height: 60px
    borderTop: "1px solid {colors.hairline}"
  hero-photo-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 72px
  orange-streak-divider:
    backgroundColor: "{colors.accent}"
    height: 2px
    width: 32px
  benefit-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
    padding: 22px
  social-proof-strip:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    padding: 24px 0
  stat-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.stat-number}"
    rounded: "{rounded.md}"
    padding: 18px 20px
    variants:
      default: "border {colors.hairline}"
      attention: "border {colors.accent}, shadow-sm, judul & icon-bg pakai accent/accent-soft"
    optionalProps:
      actionLabel: "teks tombol CTA, mis. 'Review Pengajuan'"
      actionHref: "URL tujuan CTA"
      trend: "delta vs periode pembanding — text-success kalau positif, text-danger kalau negatif, dengan panah arah"
  data-table:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline}"
    rowHoverBackground: "#FAFAF8"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    headerTypography: "{typography.label-uppercase}"
  status-badge:
    rounded: "{rounded.xs}"
    typography: "{typography.label-uppercase}"
    padding: 4px 9px
  tier-badge:
    rounded: "{rounded.xs}"
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.label-uppercase}"
    fontFamily: "JetBrains Mono, monospace"
  club-profile-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.md}"
    padding: 22px
  member-qr-card:
    backgroundColor: "{colors.member-card-bg}"
    textColor: "{colors.graphite-text-strong}"
    accentColor: "{colors.accent}"
    rounded: "{rounded.lg}"
    padding: 24px
    decorativeLines: true
  points-balance-widget:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline}"
    textColor: "{colors.accent}"
    typography: "{typography.stat-number}"
    rounded: "{rounded.md}"
    padding: 18px 20px
  redeem-catalog-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
    padding: 16px
  application-status-timeline:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    activeColor: "{colors.accent}"
    doneColor: "{colors.success}"
  form-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: 28px
  qr-scan-viewport:
    backgroundColor: "{colors.gradient-graphite}"
    frameColor: "{colors.accent}"
    rounded: "{rounded.md}"
  event-ticket:
    backgroundColor: "{colors.gradient-graphite}"
    textColor: "{colors.graphite-text-strong}"
    accentColor: "{colors.accent}"
    rounded: "{rounded.lg}"
    padding: 24px
  confirmation-modal:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: 24px
  transaction-list-item:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  toast-notification:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  empty-state:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.body-md}"
    padding: 40px
  text-input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.sm}"
    padding: 9px 12px
    height: 40px
  select-dropdown:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.sm}"
    height: 40px
  file-upload-dropzone:
    backgroundColor: "#FAFAF8"
    textColor: "{colors.muted}"
    border: "1px dashed {colors.hairline-strong}"
    rounded: "{rounded.md}"
    padding: 24px
  radio-group:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    activeColor: "{colors.accent}"
  search-filter-bar:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: 10px 12px
  referral-share-card:
    backgroundColor: "{colors.gradient-graphite}"
    textColor: "{colors.graphite-text-strong}"
    accentColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: 20px
  footer:
    backgroundColor: "{colors.gradient-graphite}"
    textColor: "{colors.graphite-text}"
    typography: "{typography.body-sm}"
    padding: 56px
---

## Overview

Sailun Community adalah platform komunitas resmi Mercedes-Benz Indonesia — identitas ini menuntut kesan **premium dan senyap**, bukan estetika SaaS warna-warni yang ramai. v1.x (kanvas navy gelap total, oranye dipakai luas) dievaluasi ulang setelah dibandingkan langsung dengan referensi dashboard nyata dan disetujui via mockup — kanvas navy dinilai terlalu "berat", oranye yang dipakai di banyak tempat terasa mendekati "norak" untuk konteks brand otomotif premium.

**Karakteristik Utama v2.0:**
- Kanvas **krem hangat** (`{colors.canvas}` — `#F5F3EF`), bukan putih pekat dan bukan navy gelap — kesan material premium (kertas/kulit berkualitas), bukan layar digital dingin.
- Sidebar **graphite hampir hitam** (`{colors.graphite}` — `#17191C`) — satu-satunya area gelap di sistem, mendekati DNA warna Mercedes-Benz (hitam/silver/putih) alih-alih navy biru.
- Aksen oranye (`{colors.accent}` — `#C6560F`, burnt-orange yang diredam, BUKAN oranye terang `#FF7A1A` versi lama) dipakai **sangat hemat** — garis nav aktif, satu titik angka statistik yang perlu ditonjolkan, tombol CTA utama. TIDAK pernah jadi warna badge, latar kartu, atau elemen berulang.
- Status badge & warna semantik (success/warning/danger/info) memakai **soft-tint yang diredam**, bukan warna solid terang — badge terang penuh adalah salah satu penyebab utama kesan "murah/ramai" yang ingin dihindari.
- Radius lebih kecil dari v1.x (`{rounded.sm}` 6px, `{rounded.md}` 8px sebagai default) — sudut membulat besar terasa "konsumer-playful"; radius kecil terasa lebih terkurasi/presisi.
- Tipografi diperkecil & diringankan dibanding v1.x untuk elemen UI aplikasi (title, label, body) — hierarki tetap lewat kontras bobot Archivo/Inter, tapi skalanya lebih senyap. Hero marketing (`display-xl`/`display-lg`) tetap boleh besar & tegas karena itu momen editorial, bukan elemen UI berulang.

## Colors

### Kanvas & Permukaan
- **Canvas** (`{colors.canvas}` — `#F5F3EF`): latar utama seluruh platform.
- **Card** (`{colors.card}` — `#FFFFFF`): semua kartu, tabel, form, input — putih murni di atas kanvas krem untuk sedikit "terangkat" tanpa shadow.
- **Graphite** (`{colors.graphite}` — `#0E2A4D`, v2.1: navy Sailun asli dari deck resmi, sebelumnya graphite netral `#17191C`): sidebar, `member-qr-card`, `referral-share-card`, footer — area yang sengaja dibuat gelap sebagai penanda struktural/brand, dipakai terbatas. Nama token dipertahankan "graphite" untuk stabilitas implementasi, meski nilainya sekarang navy bermerek.
- **Graphite Soft** (`{colors.graphite-soft}` — `#173A63`): elevasi di atas graphite (hover state di sidebar, dsb).

### Garis & Border
- **Hairline** (`{colors.hairline}` — `#E7E4DE`): border standar kartu/tabel/input.
- **Hairline Strong** (`{colors.hairline-strong}` — `#D8D4CC`): border tombol sekunder, dropzone upload.

### Teks
- **Ink** (`{colors.ink}` — `#15171A`): judul & teks utama di atas kanvas terang.
- **Body** (`{colors.body}` — `#5B5D62`): paragraf & teks sekunder.
- **Muted** (`{colors.muted}` — `#94969B`): placeholder, caption.
- **Graphite Text** (`{colors.graphite-text}` — `#8A9BB5`): teks nav item di sidebar gelap (nonaktif) — sedikit bernuansa biru mengikuti dasar navy.
- **Graphite Text Strong** (`{colors.graphite-text-strong}` — `#F0F3F8`): teks nav item aktif & judul di dalam elemen graphite.
- **On Accent** (`{colors.on-accent}` — `#FDFCFA`): teks di atas tombol/elemen berlatar aksen oranye.

### Aksen
- **Accent** (`{colors.accent}` — `#F5760F`, v2.1: oranye Sailun asli dari deck resmi, sebelumnya burnt-orange estimasi `#C6560F`): SATU-SATUNYA warna aksi di sistem. Dipakai hemat — lihat Do's and Don'ts.
- **Accent Soft** (`{colors.accent-soft}` — `#FDEEE0`): latar avatar inisial, highlight sangat ringan.
- **Accent Hover** (`{colors.accent-hover}` — `#D4640D`): state hover/pressed tombol primer.

### Semantik (Status) — Selalu Soft-Tint
- **Success** (`{colors.success}` — `#3F6B4A`) / **Success Soft** (`{colors.success-soft}` — `#EBF2EC`): `APPROVED`/`FULFILLED`.
- **Warning** (`{colors.warning}` — `#9A6B1F`) / **Warning Soft** (`{colors.warning-soft}` — `#FBF1DF`): `PENDING`.
- **Danger** (`{colors.danger}` — `#9B3A34`) / **Danger Soft** (`{colors.danger-soft}` — `#FAECEA`): `REJECTED`/`VOIDED`.
- **Info** (`{colors.info}` — `#3F5E70`) / **Info Soft** (`{colors.info-soft}` — `#E8EEF0`): badge informasi netral.

Pola pemakaian: teks warna solid (mis. `{colors.success}`) di atas latar soft-tint pasangannya (mis. `{colors.success-soft}`) — TIDAK PERNAH warna solid terang sebagai latar penuh.

> Semua hex sudah divalidasi lewat mockup HTML nyata yang direview & disetujui langsung — bukan lagi estimasi visual seperti v1.x.

## Typography

Font family tidak berubah dari revisi sebelumnya (dikonfirmasi dari mockup asli klien): **Archivo** (display/judul/tombol), **JetBrains Mono** (label/angka statistik/breadcrumb), **Inter** (body/paragraf). Fallback stack sama seperti sebelumnya.

Yang berubah di v2.0: skala ukuran & bobot untuk elemen UI aplikasi diperkecil/diringankan (lihat tabel di bawah) — hero marketing publik tetap besar & tegas, tapi seluruh UI dashboard (title, label, stat, body) sengaja dibuat lebih senyap.

| Token | Font | Ukuran | Bobot | Kegunaan |
|---|---|---|---|---|
| `{typography.display-xl}` | Archivo | 56px | 700 | Hero h1 landing page publik |
| `{typography.display-lg}` | Archivo | 38px | 700 | Judul section marketing |
| `{typography.display-md}` | Archivo | 28px | 700 | Judul besar dashboard (jarang dipakai) |
| `{typography.display-sm}` | Archivo | 22px | 700 | Judul halaman aplikasi (mis. "Approval Sponsorship") |
| `{typography.stat-number}` | JetBrains Mono | 26px | 600 | Angka KPI, saldo poin |
| `{typography.title-lg}` | Archivo | 17px | 700 | Judul kartu |
| `{typography.title-md}` | Archivo | 14.5px | 600 | Judul item list, teks tabel utama |
| `{typography.label-uppercase}` | JetBrains Mono | 10.5px | 500 | Badge, breadcrumb, header tabel, eyebrow |
| `{typography.body-md}` | Inter | 13.5px | 400 | Paragraf & form default |
| `{typography.body-sm}` | Inter | 12.5px | 400 | Metadata, isi sel tabel |
| `{typography.caption}` | Inter | 11.5px | 400 | Timestamp, teks bantuan |
| `{typography.button}` | Archivo | 13.5px | 600 | Label tombol, sentence case |
| `{typography.nav-link}` | Inter | 13.5px | 500 | Item sidebar/navigasi |

## Layout

- Spacing scale tidak berubah: `{spacing.xxs}` 4px sampai `{spacing.section}` 80px.
- Padding kartu standar turun ke ~18-20px (dari 24px di v1.x) — lebih ringkas, konsisten dengan skala tipografi yang juga diperkecil.
- Topbar (`app-topbar`, komponen baru) menempel di atas konten, tinggi 56px, dipisahkan sidebar — pola app-shell dua-lapis yang sebelumnya tidak ada di v1.x.

## Shapes

Radius diperkecil dari v1.x — sudut kecil (`{rounded.sm}` 6px, `{rounded.md}` 8px) sebagai default, BUKAN sudut besar membulat. Ini kebalikan dari keputusan v1.x sebelumnya: radius besar terasa "konsumer-playful", sedangkan konteks brand Mercedes-Benz butuh kesan presisi/terkurasi — radius kecil lebih tepat.

| Token | Nilai |
|---|---|
| `{rounded.none}` | 0px |
| `{rounded.xs}` | 4px — badge |
| `{rounded.sm}` | 6px — tombol, input, item list |
| `{rounded.md}` | 8px — kartu standar (default) |
| `{rounded.lg}` | 12px — `member-qr-card` saja (elemen paling "istimewa") |
| `{rounded.full}` | 9999px — avatar, tombol ikon |

## Elevation

Tidak ada drop-shadow (disiplin dipertahankan dari v1.x) — kedalaman datang dari **border 1px hairline**, bukan bayangan maupun lapisan warna gelap-terang seperti v1.x. Satu-satunya elemen dengan latar gelap (graphite) adalah sidebar, `member-qr-card`, `referral-share-card`, dan footer — dipakai terbatas sebagai penanda struktural, bukan pola berulang.

## Components

### Signature
**`orange-streak-divider`**: di v2.0 ini garis PENDEK (32px) solid aksen, bukan lagi gradasi lebar seperti v1.x — dipakai sebagai penanda kecil (garis kiri nav item aktif), bukan elemen dekoratif besar.

**`referral-share-card`**: berlatar `gradient-graphite` (sama seperti sidebar/footer) — konsisten dengan prinsip oranye dipakai sangat hemat, sekaligus tetap terasa "istimewa" karena salah satu elemen gelap di luar sidebar.

**`member-qr-card`** *(v2.3 — background didesain ulang, teknik "kartu kredit fisik")*: berlatar `{colors.member-card-bg}` (`#081A33` — SATU-SATUNYA komponen yang pakai warna ini, LEBIH GELAP dari `graphite` biasa, TIDAK memakai `gradient-graphite` seperti elemen gelap lain). Dihiasi motif garis lengkung dekoratif dua-lapis (`decorativeLines: true`) — teknik ini diadaptasi dari referensi kode CSS kartu kredit publik (bukan hasil rancang sendiri dari nol), diterjemahkan ke navy Sailun dengan warna sangat diredam (alpha 0.1) supaya navy gelap tetap dominan dan lengkungannya jadi aksen halus, bukan area terang mencolok.

CSS lengkap (4 pseudo-element, WAJIB diimplementasikan persis — posisi/ukuran/radius JANGAN diubah, cuma warna yang sudah final di bawah ini):

```css
.member-qr-card {
  position: relative;
  overflow: hidden;
  background: #081A33; /* member-card-bg — khusus komponen ini saja */
}
.member-qr-card .lines-down::before {
  content: ''; position: absolute;
  top: 80px; left: -200px; z-index: 10;
  width: 550px; height: 400px;
  border-top: 2px solid #2A5590;
  border-radius: 40% 60% 0 0;
  box-shadow: 1px 1px 100px #2A5590;
  background: radial-gradient(ellipse at center, rgba(42,85,144,0) 44%, rgba(42,85,144,0.1) 100%);
}
.member-qr-card .lines-down::after {
  content: ''; position: absolute;
  top: 20px; left: -100px; z-index: 10;
  width: 350px; height: 400px;
  border-top: 2px solid #2A5590;
  border-radius: 20% 80% 0 0;
  box-shadow: inset -1px -1px 44px #2A5590;
  background: radial-gradient(ellipse at center, rgba(42,85,144,0) 44%, rgba(42,85,144,0.1) 100%);
}
.member-qr-card .lines-up { position: absolute; inset: 0; }
.member-qr-card .lines-up::before {
  content: ''; position: absolute;
  top: -110px; left: -70px; z-index: 2;
  width: 480px; height: 300px;
  border-bottom: 2px solid #3A6094;
  border-radius: 0 0 60% 90%;
  box-shadow: inset 1px 1px 44px #3A6094;
  background: radial-gradient(ellipse at center, rgba(58,96,148,0) 44%, rgba(35,24,154,0.1) 100%);
}
.member-qr-card .lines-up::after {
  content: ''; position: absolute;
  top: -180px; left: -200px; z-index: 1;
  width: 530px; height: 420px;
  border-bottom: 2px solid #2A5590;
  border-radius: 0 40% 50% 50%;
  box-shadow: inset 1px 1px 44px #2A5590;
  background: radial-gradient(ellipse at center, rgba(42,85,144,0) 44%, rgba(42,85,144,0.1) 100%);
}
```

Konten kartu (nama, klub, ID, QR) tetap dirender di atas motif ini dengan `z-index` lebih tinggi (mis. 100), supaya teks/QR tidak tertutup lapisan dekoratif.

**`event-ticket`** *(baru — fitur EventAttendance)*: tiket digital konfirmasi kehadiran member di satu event, TERPISAH dari `member-qr-card`. Berlatar `gradient-graphite` sama seperti komponen gelap lain, QR code meng-encode `eventattendance.id` (BUKAN `qrCardId` member) — disiapkan untuk fitur check-in di lokasi acara pada fase mendatang. Ditampilkan setelah member konfirmasi kehadiran, baik lewat login (member existing) maupun registrasi baru via halaman invitation.

### App Shell (baru di v2.0)
**`app-topbar`**: lapisan baru yang sebelumnya tidak ada — menempel di atas area konten (di samping sidebar, bukan di atasnya), berisi breadcrumb (`label-uppercase` style) dan aksi kontekstual (search icon, dsb). Ini menutup gap struktural v1.x yang menyebabkan halaman terasa "kepotong" dibanding referensi dashboard profesional.

### Status & Data
**`status-badge`**: WAJIB pola soft-tint (teks warna solid di atas latar soft) — TIDAK PERNAH latar warna solid terang. Radius kecil (`{rounded.xs}`), font mono kecil dengan letter-spacing.

**`stat-card`**: latar putih + border hairline (bukan latar warna solid), angka besar mono, hanya SATU stat-card per grup yang boleh memakai warna aksen pada angkanya (untuk menonjolkan metrik terpenting) — sisanya netral (`{colors.ink}`).

*Varian `attention`* (baru — dashboard admin): border & judul pakai `{colors.accent}`, latar icon `{colors.accent-soft}`, dipakai untuk metrik yang butuh tindakan (mis. "Pengajuan Menunggu") — TETAP tampil walau angkanya 0 (bukan info pasif yang boleh disembunyikan, "0 pending" itu sendiri kabar berguna). Props opsional `actionLabel`+`actionHref` untuk tombol CTA di dalam kartu, dan `trend` untuk delta dibanding periode pembanding (hijau naik/merah turun + panah arah).

## Do's and Don'ts

### Lakukan
- Jaga kanvas krem (`{colors.canvas}`) di seluruh area konten; graphite HANYA untuk sidebar + beberapa elemen signature yang disebutkan eksplisit.
- Pakai aksen oranye **maksimal 1-2 titik per layar** — garis nav aktif dan satu angka/tombol penting. Kalau ragu, jangan pakai oranye.
- Status badge selalu soft-tint, radius kecil, font mono.
- Radius kecil (6-8px) sebagai default; radius besar (`lg` 12px) khusus `member-qr-card`.
- Border hairline 1px sebagai satu-satunya sumber "kedalaman" — tidak ada shadow.

### Jangan
- Jangan pakai oranye sebagai latar kartu, latar badge, atau elemen berulang (tabel, list) — itu yang bikin kesan "norak".
- Jangan pakai warna solid terang (hijau/kuning/merah pekat) untuk latar badge — selalu soft-tint.
- Jangan perbesar radius melebihi `{rounded.lg}` (12px) di komponen manapun kecuali ada alasan kuat didiskusikan dulu.
- Jangan tambah warna baru di luar 8 peran yang sudah ada (canvas/card/graphite/accent/success/warning/danger/info).
- Jangan gunakan drop-shadow CSS — kedalaman selalu lewat border hairline.

## Responsive Behavior

Struktur breakpoint & strategi collapsing sama seperti sebelumnya (Mobile <768px sidebar→bottom-nav-mobile, Tablet 768-1024px sidebar collapsed rail, Desktop 1024-1440px sidebar penuh, Wide >1440px). Token warna & radius di atas berlaku sama di semua breakpoint — yang berubah cuma layout, bukan palet.

### `data-table` di Mobile — Scroll Horizontal (keputusan final)

**`data-table` TIDAK collapse jadi tumpukan card di mobile.** Sempat dicoba pendekatan card-stack (heuristik sembunyikan kolom sekunder), tapi ternyata terlalu banyak data hilang dari pandangan (user harus klik "Detail" untuk info yang sebenarnya perlu langsung terlihat, terutama di tabel admin yang isinya untuk dibandingkan antar baris). Keputusan final: **tabel tetap `<table>` di SEMUA breakpoint**, dibungkus container `overflow-x-auto` supaya bisa digeser horizontal di layar sempit.

Implementasi:
- Wrapper `<div className="overflow-x-auto">` membungkus `<table>` — TIDAK ADA logic percabangan mobile/desktop terpisah seperti component lain (sidebar, dsb), satu markup untuk semua breakpoint.
- Header & sel tabel boleh diberi `whitespace-nowrap` supaya tidak membungkus aneh saat lebar viewport sempit — biarkan scroll horizontal yang menangani kelebihan lebar, bukan wrapping teks.
- Kolom AKSI (link "Detail", dst) tetap kolom biasa di ujung tabel, ikut ter-scroll seperti kolom lain — TIDAK di-pin/sticky (kecuali nanti ada kebutuhan spesifik yang minta itu).

## Scaling Tipografi per Breakpoint (v2.2 — Angka Pasti)

Hanya token **display** dan **stat-number** yang diskalakan turun di layar sempit (prinsip dari v1.x tetap berlaku: token ini mendominasi ruang visual, perlu mengecil di mobile). Token UI kecil (body, caption, label, button, nav-link, title) **tetap flat** di semua breakpoint — sudah dikalibrasi dekat ambang keterbacaan minimum.

| Token | Mobile (<768px) | Tablet (768–1024px) | Desktop (≥1024px) |
|---|---|---|---|
| `{typography.display-xl}` | 32px | 42px | 56px |
| `{typography.display-lg}` | 22px | 29px | 38px |
| `{typography.display-md}` | 20px | 24px | 28px |
| `{typography.display-sm}` | 18px | 20px | 22px |
| `{typography.stat-number}` | 20px | 23px | 26px |
| Semua token lain (title-lg, title-md, label-uppercase, body-md, body-sm, caption, button, nav-link) | Flat — sama persis di semua breakpoint, lihat tabel §Typography |

Teknik implementasi: sama seperti disebutkan di `AGENTS.md` §3.1 Aturan 3 (Tailwind responsive token classes ATAU CSS `clamp()`) — kalau pakai `clamp()`, titik minimum/maksimum WAJIB sama persis dengan kolom Mobile/Desktop di atas.



## Known Gaps

- Hex `accent` dan `graphite` diambil dari deck resmi "Strategic Community Activation Program" — **estimasi visual dari gambar**, bukan color-picker pixel-perfect. Tetap disarankan verifikasi ke tim brand Sailun untuk hex definitif kalau tersedia file sumber resmi (AI/EPS/brand guideline PDF).
- Warna `info` (`#3F5E70`) masih belum divalidasi lewat referensi visual manapun (tidak ada di deck maupun mockup) — nilai diturunkan dari pola desaturasi yang sama dengan warna semantik lain.
- Font brand resmi Sailun (kalau ada) tetap belum dikonfirmasi — Archivo/JetBrains Mono/Inter tetap status substitusi berbasis mockup asli klien, bukan lisensi resmi terverifikasi.
- Dark-mode PENUH (v1.x) sepenuhnya digantikan — kalau di masa depan ada kebutuhan mode gelap opsional (bukan wajib), itu perlu dirancang ulang dari v2.0, bukan mengembalikan v1.x begitu saja.
