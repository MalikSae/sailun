import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";

export const dynamic = 'force-dynamic';

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const club = await db.club.findUnique({
    where: { id: resolvedParams.id },
    include: {
      member: {
        orderBy: { createdAt: "desc" }
      },
      sponsorshipapplication: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!club) return notFound();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-display-md font-display font-bold text-ink">{club.namaKomunitas}</h1>
        <p className="text-body-md text-muted mt-1">Detail Profil Klub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Profil */}
        <div className="lg:col-span-1 bg-card border border-hairline rounded-md p-6">
          <h2 className="text-display-md font-display font-semibold mb-4">Profil</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-caption text-muted uppercase tracking-wider mb-1">Status</dt>
              <dd><StatusBadge status={club.status} /></dd>
            </div>
            <div>
              <dt className="text-caption text-muted uppercase tracking-wider mb-1">Ketua</dt>
              <dd className="font-medium text-ink">{club.namaKetua}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted uppercase tracking-wider mb-1">Anggota (Klaim)</dt>
              <dd className="font-medium text-ink">{club.jumlahAnggota} orang</dd>
            </div>
            <div>
              <dt className="text-caption text-muted uppercase tracking-wider mb-1">Tahun Mobil</dt>
              <dd className="font-medium text-ink">{club.tahunMobilMulai} - {club.tahunMobilAkhir}</dd>
            </div>
          </dl>
        </div>

        {/* Tabel Relasi */}
        <div className="lg:col-span-2 space-y-8">
          
          <div>
            <h2 className="text-display-md font-display font-semibold mb-4">Riwayat Sponsorship</h2>
            <DataTable
              columns={["Event", "Tanggal", "Dana", "Status"]}
              rows={club.sponsorshipapplication.map((app) => [
                app.namaAcara,
                app.tanggalAcara.toLocaleDateString('id-ID'),
                `Rp ${Number(app.danaDiajukan).toLocaleString('id-ID')}`,
                <StatusBadge key={app.id} status={app.status} />
              ])}
            />
          </div>

          <div>
            <h2 className="text-display-md font-display font-semibold mb-4">Daftar Member Sistem ({club.member.length})</h2>
            <DataTable
              columns={["Nama", "Telepon", "Tipe Mobil", "Tahun"]}
              rows={club.member.map((m) => [
                m.nama,
                m.telepon,
                m.tipeMobil,
                m.tahunMobil.toString()
              ])}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
