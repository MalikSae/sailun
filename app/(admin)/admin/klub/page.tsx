import React from "react";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClubActions } from "./club-actions";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

import { SearchX, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = 'force-dynamic';

export default async function AdminKlubPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const filterStatus = (typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : "") || "";
  const filterKota = (typeof resolvedSearchParams?.kota === 'string' ? resolvedSearchParams.kota : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {};

  if (query) {
    where.OR = [
      { namaKomunitas: { contains: query } },
      { namaKetua: { contains: query } },
      { kota: { contains: query } }
    ];
  }

  if (filterStatus && filterStatus !== "ALL") {
    where.status = filterStatus;
  }

  if (filterKota && filterKota !== "ALL") {
    where.kota = filterKota;
  }

  const totalItems = await db.club.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const clubs = await db.club.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  const kotaList = await db.club.findMany({
    select: { kota: true },
    where: {
      kota: { not: null },
      AND: { kota: { not: "" } }
    },
    distinct: ['kota'],
    orderBy: { kota: 'asc' }
  });

  const kotaOptions = kotaList.map((k) => ({
    label: k.kota!,
    value: k.kota!
  }));

  const hasFilters = Boolean(query || (filterStatus && filterStatus !== "ALL") || (filterKota && filterKota !== "ALL"));

  return (
    <PageContainer>
      <PageHeader 
        title="Data Klub" 
        description="Manajemen master data klub." 
      />
      
      <SearchFilterBar
        placeholder="Cari nama klub, ketua, atau kota..."
        filters={[
          {
            paramName: "status",
            options: [
              { label: "Semua Status", value: "ALL" },
              { label: "Approved (Aktif)", value: "active" },
              { label: "Pending (Unverified)", value: "unverified" },
              { label: "Voided (Inaktif)", value: "inactive" },
            ]
          },
          {
            paramName: "kota",
            options: [
              { label: "Semua Kota", value: "ALL" },
              ...kotaOptions
            ]
          }
        ]}
      />

      <DataTable
        columns={["Nama Klub", "Kota", "Anggota (Klaim)", "Status", "Tgl Terdaftar", "Aksi"]}
        emptyState={
          hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="Tidak ada hasil"
              description="Tidak ada data yang cocok dengan pencarian atau filter Anda. Silakan coba kata kunci lain."
            />
          ) : (
            <EmptyState
              icon={Inbox}
              title="Belum ada klub"
              description="Belum ada klub yang mendaftar ke platform."
            />
          )
        }
        rows={clubs.map((club) => [
          club.namaKomunitas,
          club.kota || "-",
          `${club.jumlahAnggota} orang`,
          <StatusBadge key="status" status={club.status} />,
          club.createdAt.toLocaleDateString('id-ID'),
          <ClubActions key="actions" clubId={club.id} currentStatus={club.status} />
        ])}
      />

      <Pagination totalPages={totalPages} />
    </PageContainer>
  );
}
