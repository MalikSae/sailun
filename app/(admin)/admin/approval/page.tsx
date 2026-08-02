import React from "react";
import { db } from "@/lib/db";
import { ApprovalClient } from "./approval-client";
import { PageContainer } from "@/components/ui/page-container";

export default async function AdminApprovalPage({
  searchParams,
}: {
  searchParams?: { query?: string; status?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const statusFilter = searchParams?.status || "";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 20;

  const whereClause: any = {};
  
  if (statusFilter && statusFilter !== "ALL") {
    whereClause.status = statusFilter;
  }

  if (query) {
    whereClause.OR = [
      { nomorPengajuan: { contains: query } },
      { namaAcara: { contains: query } },
      { club: { namaKomunitas: { contains: query } } },
    ];
  }

  const totalItems = await db.sponsorshipapplication.count({ where: whereClause });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const applications = await db.sponsorshipapplication.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      club: true,
    }
  });

  // Konversi eksplisit — Prisma Decimal & Date tidak bisa langsung di-pass ke Client Component
  const serialized = applications.map((app) => ({
    id: app.id,
    nomorPengajuan: app.nomorPengajuan,
    clubId: app.clubId,
    namaAcara: app.namaAcara,
    tanggalAcara: app.tanggalAcara.toISOString(),
    danaDiajukan: app.danaDiajukan.toString(),
    benefitDitawarkan: app.benefitDitawarkan,
    tierRekomendasi: app.tierRekomendasi,
    tierFinal: app.tierFinal,
    catatanAdmin: app.catatanAdmin,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    club: app.club
      ? {
          id: app.club.id,
          namaKomunitas: app.club.namaKomunitas,
          status: app.club.status,
        }
      : null,
  }));

  const hasFilters = Boolean(query || (statusFilter && statusFilter !== "ALL"));

  return (
    <PageContainer>
      <ApprovalClient applications={serialized} totalPages={totalPages} hasFilters={hasFilters} />
    </PageContainer>
  );
}
