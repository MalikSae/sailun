import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AnggotaClient } from "./anggota-client";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = 'force-dynamic';

export default async function ClubAnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "CLUB") {
    redirect("/login");
  }

  const club = await db.club.findFirst({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!club) {
    return <div className="p-8 text-ink text-center">Data klub tidak ditemukan.</div>;
  }

  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const filterSource = (typeof resolvedSearchParams?.source === 'string' ? resolvedSearchParams.source : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {
    clubId: club.id
  };

  if (query) {
    where.OR = [
      { nama: { contains: query } },
      { telepon: { contains: query } }
    ];
  }

  if (filterSource && filterSource !== "ALL") {
    if (filterSource === "profil") {
      where.eventAsalId = null;
    } else {
      where.eventAsalId = filterSource;
    }
  }

  const totalItems = await db.member.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // ATURAN BISNIS #12: Filter by clubId (role-based access ketat)
  const members = await db.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      event: {
        include: {
          sponsorshipapplication: true,
        }
      }
    }
  });

  const serializedMembers = members.map((m) => ({
    id: m.id,
    nama: m.nama,
    telepon: m.telepon,
    createdAt: m.createdAt.toISOString(),
    event: m.event ? {
      sponsorshipapplication: m.event.sponsorshipapplication ? {
        namaAcara: m.event.sponsorshipapplication.namaAcara
      } : null
    } : null
  }));

  const events = await db.event.findMany({
    where: { sponsorshipapplication: { clubId: club.id } },
    include: { sponsorshipapplication: true }
  });
  
  const sourceOptions = [
    { label: "Semua Sumber", value: "ALL" },
    { label: "Profil Klub", value: "profil" },
    ...events.map(e => ({ label: e.sponsorshipapplication?.namaAcara || e.slug, value: e.id }))
  ];

  const hasFilters = Boolean(query || (filterSource && filterSource !== "ALL"));

  return (
    <PageContainer className="space-y-8">
      <PageHeader 
        title="Daftar Anggota" 
        description="Data anggota komunitas Anda." 
      />

      <AnggotaClient members={serializedMembers} totalPages={totalPages} sourceOptions={sourceOptions} hasFilters={hasFilters} />
    </PageContainer>
  );
}
