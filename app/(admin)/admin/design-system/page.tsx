"use client";

import React from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { BottomNavMobile } from "@/components/ui/bottom-nav-mobile";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { ButtonDanger } from "@/components/ui/button-danger";
import { ButtonGhost } from "@/components/ui/button-ghost";
import { ButtonIcon } from "@/components/ui/button-icon";
import { TextInput } from "@/components/ui/text-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileUploadDropzone } from "@/components/ui/file-upload-dropzone";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { BenefitCard } from "@/components/ui/benefit-card";
import { ClubProfileCard } from "@/components/ui/club-profile-card";
import { FormCard } from "@/components/ui/form-card";
import { StatCard } from "@/components/ui/stat-card";
import { RedeemCatalogCard } from "@/components/ui/redeem-catalog-card";
import { TransactionListItem } from "@/components/ui/transaction-list-item";
import { ApplicationStatusTimeline } from "@/components/ui/application-status-timeline";
import { MemberQrCard } from "@/components/ui/member-qr-card";
import { PointsBalanceWidget } from "@/components/ui/points-balance-widget";
import { ReferralShareCard } from "@/components/ui/referral-share-card";
import { QrScanViewport } from "@/components/ui/qr-scan-viewport";
import { OrangeStreakDivider } from "@/components/ui/orange-streak-divider";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ToastNotification } from "@/components/ui/toast-notification";
import { Mail, Search, Info, Settings, Shield, Plus, Inbox, ClipboardCheck, Users } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-canvas pb-20">
      <PageContainer className="space-y-16">
        <div>
          <h1 className="text-display-md font-display text-ink mb-2">Sailun Design System</h1>
          <p className="text-body-md text-muted">Halaman internal untuk review UI components (Tailwind + Lucide)</p>
        </div>

        {/* SECTION 1 - COLORS */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">1. Colors</h2>
          <hr className="border-hairline mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "canvas", hex: "#F5F3EF", token: "bg-canvas" },
              { name: "card", hex: "#FFFFFF", token: "bg-card" },
              { name: "ink", hex: "#15171A", token: "bg-ink" },
              { name: "body", hex: "#5B5D62", token: "bg-body" },
              { name: "muted", hex: "#94969B", token: "bg-muted" },
              { name: "hairline", hex: "#E7E4DE", token: "bg-hairline" },
              { name: "hairline-strong", hex: "#D8D4CC", token: "bg-hairline-strong" },
              { name: "graphite", hex: "#0E2A4D", token: "bg-graphite" },
              { name: "graphite-soft", hex: "#173A63", token: "bg-graphite-soft" },
              { name: "graphite-text", hex: "#8A9BB5", token: "bg-graphite-text" },
              { name: "graphite-text-strong", hex: "#F0F3F8", token: "bg-graphite-text-strong" },
              { name: "accent", hex: "#F5760F", token: "bg-accent" },
              { name: "accent-soft", hex: "#FDEEE0", token: "bg-accent-soft" },
              { name: "accent-hover", hex: "#D4640D", token: "bg-accent-hover" },
              { name: "on-accent", hex: "#FDFCFA", token: "bg-on-accent" },
              { name: "success", hex: "#3F6B4A", token: "bg-success" },
              { name: "success-soft", hex: "#EBF2EC", token: "bg-success-soft" },
              { name: "warning", hex: "#9A6B1F", token: "bg-warning" },
              { name: "warning-soft", hex: "#FBF1DF", token: "bg-warning-soft" },
              { name: "danger", hex: "#9B3A34", token: "bg-danger" },
              { name: "danger-soft", hex: "#FAECEA", token: "bg-danger-soft" },
              { name: "info", hex: "#3F5E70", token: "bg-info" },
              { name: "info-soft", hex: "#E8EEF0", token: "bg-info-soft" },
            ].map(c => (
              <div key={c.name} className="flex flex-col gap-2">
                <div className={`h-24 w-full rounded-md shadow-sm border border-hairline ${c.token}`}></div>
                <div className="text-body-sm font-medium text-ink">{c.name}</div>
                <div className="text-caption text-muted font-mono">{c.hex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2 - TYPOGRAPHY */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">2. Typography</h2>
          <hr className="border-hairline mb-8" />
          <div className="space-y-6 bg-card p-6 rounded-lg border border-hairline">
            {[
              { token: "display-xl", class: "text-display-xl font-display", label: "Archivo, Bold" },
              { token: "display-lg", class: "text-display-lg font-display", label: "Archivo, Bold" },
              { token: "display-md", class: "text-display-md font-display", label: "Archivo, SemiBold" },
              { token: "display-sm", class: "text-display-sm font-display", label: "Archivo, SemiBold" },
              { token: "title-lg", class: "text-title-lg font-display", label: "Archivo, SemiBold" },
              { token: "title-md", class: "text-title-md font-display", label: "Archivo, SemiBold" },
              { token: "body-lg", class: "text-body-lg font-body", label: "Inter, Regular" },
              { token: "body-md", class: "text-body-md font-body", label: "Inter, Regular" },
              { token: "body-sm", class: "text-body-sm font-body", label: "Inter, Regular" },
              { token: "caption", class: "text-caption font-body", label: "Inter, Regular" },
              { token: "label-uppercase", class: "text-label-uppercase font-body", label: "Inter, Bold, Uppercase" },
              { token: "button", class: "text-button font-body", label: "Inter, SemiBold" },
              { token: "nav-link", class: "text-nav-link font-body", label: "Inter, Medium" },
              { token: "stat-number", class: "text-stat-number font-mono", label: "JetBrains Mono, Bold" },
            ].map(t => (
              <div key={t.token} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-b border-hairline pb-4 last:border-0 last:pb-0">
                <div className="text-body-sm text-muted font-mono">{t.token} <br/><span className="text-caption">{t.label}</span></div>
                <div className={`col-span-2 text-ink ${t.class}`}>Sailun Community Platform</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 - SPACING & RADIUS */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">3. Spacing & Radius</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border border-hairline">
              <h3 className="text-title-md font-display text-ink mb-4">Spacing</h3>
              <div className="space-y-4">
                {[4, 8, 12, 16, 24, 40, 64, 80].map(s => (
                  <div key={s} className="flex items-center gap-4">
                    <div className="w-12 text-body-sm text-muted font-mono">{s}px</div>
                    <div className="h-6 bg-accent" style={{ width: `${s}px` }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-hairline">
              <h3 className="text-title-md font-display text-ink mb-4">Radius</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { name: "none", class: "rounded-none", px: "0px" },
                  { name: "xs", class: "rounded-xs", px: "6px" },
                  { name: "sm", class: "rounded-sm", px: "10px" },
                  { name: "md", class: "rounded-md", px: "14px" },
                  { name: "lg", class: "rounded-lg", px: "20px" },
                  { name: "full", class: "rounded-full", px: "9999px" },
                ].map(r => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 bg-card shadow-sm border border-hairline-strong ${r.class}`}></div>
                    <div className="text-center">
                      <div className="text-body-sm text-ink">{r.name}</div>
                      <div className="text-caption text-muted font-mono">{r.px}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - BUTTONS */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">4. Buttons</h2>
          <hr className="border-hairline mb-8" />
          <div className="flex flex-wrap items-end gap-6 bg-card p-6 rounded-lg border border-hairline">
            <div className="flex flex-col gap-2">
              <span className="text-caption text-muted font-mono">ButtonPrimary</span>
              <ButtonPrimary>Primary Button</ButtonPrimary>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-caption text-muted font-mono">ButtonSecondary</span>
              <ButtonSecondary>Secondary Button</ButtonSecondary>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-caption text-muted font-mono">ButtonDanger</span>
              <ButtonDanger>Danger Button</ButtonDanger>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-caption text-muted font-mono">ButtonGhost</span>
              <ButtonGhost>Ghost Button</ButtonGhost>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-caption text-muted font-mono">ButtonIcon</span>
              <ButtonIcon aria-label="Add"><Plus className="w-5 h-5"/></ButtonIcon>
            </div>
          </div>
        </section>

        {/* SECTION 5 - INPUTS & FORM */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">5. Inputs & Form</h2>
          <hr className="border-hairline mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-hairline space-y-4">
                <span className="text-caption text-muted font-mono">TextInput (Empty vs Filled)</span>
                <TextInput placeholder="Placeholder kosong..." />
                <TextInput placeholder="Placeholder kosong..." defaultValue="Teks sudah terisi" />
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-hairline space-y-4">
                <span className="text-caption text-muted font-mono">SelectDropdown</span>
                <SelectDropdown>
                  <option value="">Pilih opsi...</option>
                  <option value="1">Opsi 1</option>
                  <option value="2">Opsi 2</option>
                </SelectDropdown>
                <SelectDropdown defaultValue="1">
                  <option value="1">Opsi 1</option>
                  <option value="2">Opsi 2</option>
                </SelectDropdown>
              </div>

              <div className="bg-card p-6 rounded-lg border border-hairline space-y-4">
                <span className="text-caption text-muted font-mono">RadioGroup</span>
                <RadioGroup 
                  name="demo-radio"
                  options={[{label: "Opsi Pilihan A", value: "A"}, {label: "Opsi Pilihan B", value: "B"}]}
                  value="A"
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-hairline space-y-4">
                <span className="text-caption text-muted font-mono">SearchFilterBar</span>
                <SearchFilterBar 
                  placeholder="Cari data..."
                  filters={[
                    {
                      paramName: "status",
                      options: [{label: "Semua", value: "ALL"}, {label: "Aktif", value: "active"}]
                    }
                  ]}
                />
                <SearchFilterBar 
                  placeholder="Cari data..."
                  filters={[]}
                />
              </div>

              <div className="bg-card p-6 rounded-lg border border-hairline space-y-4">
                <span className="text-caption text-muted font-mono">FileUploadDropzone (Empty vs Uploaded)</span>
                <FileUploadDropzone onFileSelect={()=>{}} />
                {/* We mock state by showing a filled version just for visual */}
                <div className="text-center p-6 border border-hairline-strong rounded-md bg-canvas">
                  <div className="flex gap-4 justify-center">
                    <span className="text-accent hover:text-accent-hover text-body-sm font-semibold transition-colors">Ganti File</span>
                    <button className="text-danger hover:text-danger/80 text-body-sm font-semibold transition-colors">Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 - DATA DISPLAY */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">6. Data Display</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-lg border border-hairline">
              <span className="text-caption text-muted font-mono block mb-4">StatusBadge</span>
              <div className="flex flex-wrap gap-4">
                <StatusBadge status="PENDING" />
                <StatusBadge status="APPROVED" />
                <StatusBadge status="REJECTED" />
                <StatusBadge status="VOIDED" />
                <StatusBadge status="FULFILLED" />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-hairline">
              <span className="text-caption text-muted font-mono block mb-4">TierBadge</span>
              <div className="flex flex-wrap gap-4">
                <TierBadge tier="MICRO" />
                <TierBadge tier="SMALL" />
                <TierBadge tier="MEDIUM" />
                <TierBadge tier="BIG" />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-hairline">
              <span className="text-caption text-muted font-mono block mb-4">DataTable</span>
              <DataTable 
                columns={["ID", "Nama", "Status", "Total"]}
                rows={[
                  ["TRX-001", "Budi Santoso", <StatusBadge key="1" status="APPROVED"/>, "Rp 1.500.000"],
                  ["TRX-002", "Andi Pratama", <StatusBadge key="2" status="PENDING"/>, "Rp 3.200.000"],
                  ["TRX-003", "Siti Aminah", <StatusBadge key="3" status="REJECTED"/>, "Rp 500.000"],
                ]}
              />
            </div>

            <div className="bg-card p-6 rounded-lg border border-hairline">
              <span className="text-caption text-muted font-mono block mb-4">EmptyState</span>
              <EmptyState 
                icon={Inbox} 
                title="Tidak ada data ditemukan" 
                description="Cobalah menyesuaikan filter pencarian atau buat data baru untuk memulai."
                action={<ButtonPrimary>Buat Data Baru</ButtonPrimary>}
              />
            </div>
          </div>
        </section>

        {/* SECTION 7 - CARDS */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">7. Cards</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">BenefitCard</span>
              <BenefitCard title="Diskon Spesial" description="Dapatkan potongan harga khusus untuk member terdaftar." icon={<Shield className="w-8 h-8"/>} />
            </div>
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">ClubProfileCard</span>
              <ClubProfileCard clubName="Mercedes-Benz Club" clubId="MBC-001" memberCount={120} yearStart={2010} yearEnd={2023} chairman="Ahmad B" status="active" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">FormCard (Kosong)</span>
              <FormCard>
                <div className="h-32 border-2 border-dashed border-hairline-strong rounded flex items-center justify-center text-muted">
                  Isi form di sini
                </div>
              </FormCard>
            </div>
            
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">StatCard</span>
              <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Poin" value="12,500" icon={Info} />
                <StatCard title="Member Aktif" value="142" icon={Users} />
                <StatCard title="Klub Terdaftar" value="15" icon={Shield} />
                <StatCard title="Transaksi" value="84" icon={ClipboardCheck} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">RedeemCatalogCard</span>
              <RedeemCatalogCard title="Voucher Oli Mesin 1L" points={5000} onRedeem={()=>{}} />
            </div>
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">TransactionListItem</span>
              <div className="flex flex-col gap-2">
                <TransactionListItem title="Pembelian Velg" date="20 Okt 2026" amount="Rp 2.000.000" points="200" />
                <TransactionListItem title="Ban Sailun 15 inch" date="18 Okt 2026" amount="Rp 800.000" points="80" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">ApplicationStatusTimeline</span>
              <div className="bg-card p-4 rounded-lg border border-hairline">
                <ApplicationStatusTimeline status="PENDING" createdAt={new Date()} updatedAt={new Date()} />
                <div className="my-6"></div>
                <ApplicationStatusTimeline status="APPROVED" createdAt={new Date(Date.now() - 86400000)} updatedAt={new Date()} tierFinal="MEDIUM" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 - KOMPONEN SIGNATURE */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">8. Komponen Signature</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">MemberQrCard</span>
              <MemberQrCard memberId="MBZ-90210" memberName="Budi Santoso" clubName="Mercedes-Benz Club" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-caption text-muted font-mono block">PointsBalanceWidget</span>
                <PointsBalanceWidget balance={15400} />
              </div>
              <div className="space-y-2">
                <span className="text-caption text-muted font-mono block">ReferralShareCard</span>
                <ReferralShareCard url="https://sailun.test/k/budi?ref=BUDI123X" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">QrScanViewport</span>
              <div className="flex flex-col md:flex-row gap-4">
                <QrScanViewport isScanning={false} />
                <QrScanViewport isScanning={true} />
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <span className="text-caption text-muted font-mono block">OrangeStreakDivider</span>
              <div className="bg-card p-6 border border-hairline rounded-lg">
                <p className="text-muted mb-4">Standalone:</p>
                <OrangeStreakDivider />
                
                <p className="text-muted mt-8 mb-4">Dalam elemen (Hero):</p>
                <div className="bg-graphite p-8 rounded-lg relative overflow-hidden">
                  <h3 className="text-title-lg text-ink font-display mb-4 relative z-10">Hero Photo Band</h3>
                  <OrangeStreakDivider className="absolute bottom-0 left-0" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 - MODAL & FEEDBACK */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">9. Modal & Feedback</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">ConfirmationModal (Preview Inline)</span>
              <div className="border border-hairline bg-canvas p-8 rounded-lg relative overflow-hidden min-h-[300px]">
                {/* Memaksa render modal inline sebagai demo karena ini design system */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-card shadow-sm rounded-lg shadow-xl overflow-hidden border border-hairline">
                    <div className="p-6">
                      <h2 className="text-title-md font-display text-ink mb-2">Konfirmasi Tindakan</h2>
                      <p className="text-body-md text-muted mb-6">Apakah Anda yakin ingin melanjutkan tindakan ini? Data akan disimpan permanen.</p>
                      <div className="flex justify-end gap-3">
                        <ButtonSecondary>Batal</ButtonSecondary>
                        <ButtonDanger>Hapus Data</ButtonDanger>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <span className="text-caption text-muted font-mono block">ToastNotification</span>
              <ToastNotification type="success" message="Data berhasil disimpan ke sistem." onClose={()=>{}} />
              <ToastNotification type="error" message="Gagal menghubungi server. Silakan coba lagi." onClose={()=>{}} />
              <ToastNotification type="warning" message="Koneksi internet Anda tidak stabil." onClose={()=>{}} />
              <ToastNotification type="info" message="Pembaruan sistem tersedia untuk diunduh." onClose={()=>{}} />
            </div>
          </div>
        </section>

        {/* SECTION 10 - NAVIGASI */}
        <section>
          <h2 className="text-display-md font-display text-accent mb-4">10. Navigasi</h2>
          <hr className="border-hairline mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">SidebarNav (Preview terisolasi)</span>
              <div className="h-[400px] border border-hairline rounded-lg overflow-hidden relative bg-graphite">
                <SidebarNav className="!absolute !hidden sm:!block">
                  <div className="px-4 py-4 border-b border-hairline mb-4">
                    <h2 className="text-title-md text-ink font-display">Sidebar</h2>
                  </div>
                  <nav className="flex flex-col gap-1 px-2">
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-nav-link border-l-2 bg-canvas text-ink border-accent">
                      <Mail className="w-5 h-5" />
                      <span>Menu Aktif</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-nav-link text-body border-l-2 border-transparent">
                      <Settings className="w-5 h-5" />
                      <span>Menu Inaktif</span>
                    </Link>
                  </nav>
                </SidebarNav>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-caption text-muted font-mono block">BottomNavMobile (Preview terisolasi)</span>
              <div className="h-[400px] border border-hairline rounded-lg overflow-hidden relative bg-graphite flex flex-col justify-end">
                <BottomNavMobile className="!absolute">
                  <Link href="#" className="flex flex-col items-center justify-center w-full h-full text-caption text-accent">
                    <Mail className="w-6 h-6 mb-1" />
                    Aktif
                  </Link>
                  <Link href="#" className="flex flex-col items-center justify-center w-full h-full text-caption text-body">
                    <Settings className="w-6 h-6 mb-1" />
                    Inaktif
                  </Link>
                </BottomNavMobile>
              </div>
            </div>
          </div>
        </section>
        
      </PageContainer>
    </div>
  );
}
