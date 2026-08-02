import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { calculateAvailableBalance } from "@/lib/points";
import { ClubProfileCard } from "@/components/ui/club-profile-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { FormCard } from "@/components/ui/form-card";
import Link from "next/link";
import { headers } from "next/headers";
import { PageContainer } from "@/components/ui/page-container";

export default async function ClubDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "CLUB") {
    redirect("/login");
  }

  const club = await db.club.findFirst({
    where: { userId: session.user.id },
    include: {
      sponsorshipapplication: {
        orderBy: { createdAt: "desc" },
        include: {
          event: {
            include: {
              _count: {
                select: { eventattendance: true },
              },
            },
          },
        },
      },
    },
  });

  if (!club) {
    return <div className="p-8 text-ink text-center">Data klub tidak ditemukan.</div>;
  }

  const saldoPoin = await calculateAvailableBalance("CLUB", club.id);

  // Generate permanent club invite URL
  const headersList = await headers();
  const host = headersList.get("host") || "sailun.test";
  const protocol = host.includes("localhost") || host.includes("sailun.test") ? "http" : "https";
  const clubInviteUrl = `${protocol}://${host}/k/${club.slug}`;

  return (
    <PageContainer className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-display-md font-display text-ink">Dashboard Klub</h1>
        <Link href="/ajukan-sponsorship">
          <ButtonPrimary>Ajukan Sponsorship Baru</ButtonPrimary>
        </Link>
      </div>

      <ClubProfileCard
        clubName={club.namaKomunitas}
        clubId={club.id}
        memberCount={club.jumlahAnggota}
        yearStart={club.tahunMobilMulai}
        yearEnd={club.tahunMobilAkhir}
        chairman={club.namaKetua}
        logoUrl={club.logoUrl}
        status={club.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* ── Ajak Member Bergabung ──────────────────────────────────────── */}
        <FormCard 
          className="lg:col-span-2 flex flex-col justify-center h-full"
          title="Ajak Member Bergabung" 
          description="Bagikan link ini agar anggota komunitas kamu bisa daftar jadi member Sailun Community kapan saja — tidak terikat acara tertentu."
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 bg-canvas border border-hairline-strong rounded p-3 min-w-0">
              <p className="font-mono text-[12px] text-ink truncate select-all">{clubInviteUrl}</p>
            </div>
            <div className="shrink-0">
              <CopyLinkButton url={clubInviteUrl} />
            </div>
          </div>
        </FormCard>

        {/* ── Saldo Poin Klub ──────────────────────────────────────── */}
        <FormCard className="lg:col-span-1 flex flex-col h-full">
          <div className="flex-1">
            <p className="text-label-uppercase text-muted mb-1">Saldo Poin Klub</p>
            <p className="text-display-lg font-display text-accent">{saldoPoin}</p>
          </div>
          <Link href="/club/redeem" className="mt-6 block">
            <ButtonPrimary className="w-full justify-center gap-2">Tukar Poin</ButtonPrimary>
          </Link>
        </FormCard>
      </div>

      <h2 className="text-display-md text-ink mb-4">Riwayat Pengajuan</h2>
      {club.sponsorshipapplication.length === 0 ? (
        <p className="text-body-sm text-muted">Belum ada pengajuan sponsorship.</p>
      ) : (
        <DataTable
          columns={["ID Pengajuan", "Nama Event", "Tanggal Acara", "Jml RSVP", "Status", "Aksi"]}
          rows={club.sponsorshipapplication.map((app) => [
            <span key="id" className="font-mono text-[11px] text-muted">{app.nomorPengajuan}</span>,
            app.namaAcara,
            app.tanggalAcara.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
            app.event?._count?.eventattendance || 0,
            <StatusBadge key="status" status={app.status} />,
            <Link key="action" href={`/club/pengajuan/${app.id}`} className="text-accent hover:underline font-medium text-[12.5px]">
              Lihat Detail
            </Link>
          ])}
        />
      )}
    </PageContainer>
  );
}
