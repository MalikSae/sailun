import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ApplicationStatusTimeline } from "@/components/ui/application-status-timeline";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { ArrowLeft, Users, QrCode } from "lucide-react";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { FormCard } from "@/components/ui/form-card";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import QRCode from "qrcode";
import { headers } from "next/headers";
import { PageContainer } from "@/components/ui/page-container";

export default async function ClubPengajuanDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session || session.user.role !== "CLUB") {
    redirect("/login");
  }

  const club = await db.club.findFirst({ where: { userId: session.user.id } });
  if (!club) {
    redirect("/login");
  }

  const app = await db.sponsorshipapplication.findUnique({
    where: { id: params.id },
    include: {
      event: {
        include: {
          eventattendance: {
            include: { member: true },
            orderBy: { createdAt: "desc" }
          }
        }
      }
    }
  });

  if (!app) {
    notFound();
  }

  // Security check: only allow viewing own club's applications
  if (app.clubId !== club.id) {
    redirect("/club/dashboard");
  }

  // Generate invitation link if event exists
  let invitationUrl = "";
  let qrDataUrl = "";
  if (app.event && app.status === "APPROVED") {
    const headersList = await headers();
    const host = headersList.get("host") || "sailun.test";
    const protocol = host.includes("localhost") || host.includes("sailun.test") ? "http" : "https";
    invitationUrl = `${protocol}://${host}/e/${app.event.slug}`;
    
    try {
      qrDataUrl = await QRCode.toDataURL(invitationUrl, { width: 256, margin: 1 });
    } catch (e) {
      console.error("QR Error", e);
    }
  }

  return (
    <PageContainer className="space-y-8">
      <Link href="/club/dashboard" className="inline-flex items-center text-body-sm text-muted hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Dashboard
      </Link>

      <div className="flex items-center justify-between border-b border-hairline pb-6">
        <div>
          <h1 className="text-display-md font-display text-ink mb-2">{app.namaAcara}</h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12.5px] text-muted">{app.nomorPengajuan}</span>
            <StatusBadge status={app.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ApplicationStatusTimeline
            status={app.status}
            createdAt={app.createdAt}
            updatedAt={app.updatedAt}
            tierRekomendasi={app.tierRekomendasi}
            tierFinal={app.tierFinal}
            catatanAdmin={app.catatanAdmin}
          />
          
          {app.status === "APPROVED" && app.event && (
            <div className="space-y-4">
              <h2 className="text-display-md font-display text-ink">Daftar Konfirmasi Kehadiran</h2>
              {app.event.eventattendance.length === 0 ? (
                <EmptyState 
                   icon={Users} 
                   title="Belum ada RSVP" 
                   description="Belum ada member yang konfirmasi kehadiran. Bagikan link undangan di atas untuk mulai mengumpulkan RSVP."
                />
              ) : (
                <DataTable
                  columns={["Nama Member", "No. Telepon", "Waktu Konfirmasi"]}
                  rows={app.event.eventattendance.map(a => [
                    a.member.nama,
                    a.member.telepon,
                    a.createdAt.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  ])}
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {app.status === "APPROVED" && app.event && (
            <>
              {/* Event Link Card */}
              <FormCard 
                title="Link Undangan Event" 
                description="Bagikan link atau QR code ini ke anggota komunitas Anda untuk mendaftar dan mendapatkan tiket digital."
              >
                <div className="bg-canvas border border-hairline-strong rounded p-3 mb-4">
                  <p className="font-mono text-[11px] text-ink break-all select-all">{invitationUrl}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <CopyLinkButton url={invitationUrl} />
                  
                  {qrDataUrl && (
                    <div className="mt-2 border border-hairline-strong rounded p-4 flex flex-col items-center gap-2 bg-white">
                      <img src={qrDataUrl} alt="QR Code Invitation" className="w-32 h-32" />
                      <span className="text-caption text-muted flex items-center gap-1"><QrCode className="w-3 h-3" /> Scan untuk buka form</span>
                    </div>
                  )}
                </div>
              </FormCard>

              {/* RSVP Count Card */}
              <div className="bg-gradient-to-br from-graphite to-graphite-soft border border-graphite-soft rounded-md p-6 text-on-accent">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-accent" />
                  <h3 className="text-title-md font-display text-graphite-text-strong">Total Kehadiran</h3>
                </div>
                <p className="text-body-sm text-graphite-text mb-4">Jumlah member yang sudah konfirmasi RSVP ke event ini.</p>
                <p className="text-display-lg font-display text-accent">{app.event.eventattendance.length}</p>
              </div>
            </>
          )}

          <FormCard title="Detail Pengajuan">
            <dl className="space-y-3 text-body-sm">
              <div>
                <dt className="text-muted mb-0.5">Tanggal Acara</dt>
                <dd className="text-ink font-medium">
                  {app.tanggalAcara.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </dd>
              </div>
              <div>
                <dt className="text-muted mb-0.5">Dana Diajukan</dt>
                <dd className="text-ink font-medium">
                  Rp {Number(app.danaDiajukan).toLocaleString("id-ID")}
                </dd>
              </div>
            </dl>
          </FormCard>
        </div>
      </div>
    </PageContainer>
  );
}
