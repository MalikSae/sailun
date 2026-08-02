import React from "react";
import { db } from "@/lib/db";
import { DetailClient } from "./detail-client";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";

export default async function AdminApprovalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const app = await db.sponsorshipapplication.findUnique({
    where: { id },
    include: {
      club: true,
    },
  });

  if (!app || !app.club) {
    notFound();
  }

  // Konversi eksplisit untuk Client Component
  const serialized = {
    id: app.id,
    nomorPengajuan: app.nomorPengajuan,
    namaAcara: app.namaAcara,
    tanggalAcara: app.tanggalAcara.toISOString(),
    danaDiajukan: app.danaDiajukan.toString(),
    benefitDitawarkan: app.benefitDitawarkan,
    proposalUrl: app.proposalUrl,
    kontakPic: app.kontakPic,
    tierRekomendasi: app.tierRekomendasi,
    tierFinal: app.tierFinal,
    catatanAdmin: app.catatanAdmin,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    club: {
      id: app.club.id,
      namaKomunitas: app.club.namaKomunitas,
      jumlahAnggota: app.club.jumlahAnggota,
      tahunMobilMulai: app.club.tahunMobilMulai,
      tahunMobilAkhir: app.club.tahunMobilAkhir,
      namaKetua: app.club.namaKetua,
      alamatSekretariat: app.club.alamatSekretariat,
      kota: app.club.kota,
      noWhatsappKetua: app.club.noWhatsappKetua,
      logoUrl: app.club.logoUrl,
      status: app.club.status,
    },
  };

  return (
    <PageContainer>
      <DetailClient application={serialized} />
    </PageContainer>
  );
}
