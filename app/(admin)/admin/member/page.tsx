import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

import { SearchX, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = 'force-dynamic';

export default async function AdminMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const clubFilter = (typeof resolvedSearchParams?.clubId === 'string' ? resolvedSearchParams.clubId : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {};
  
  if (query) {
    where.OR = [
      { nama: { contains: query } },
      { telepon: { contains: query } },
      { tipeMobil: { contains: query } },
      { club: { namaKomunitas: { contains: query } } }
    ];
  }

  if (clubFilter && clubFilter !== "ALL") {
    where.clubId = clubFilter;
  }

  const totalItems = await db.member.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const members = await db.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      club: true,
      event: {
        include: { sponsorshipapplication: true }
      }
    }
  });

  const clubs = await db.club.findMany({
    select: { id: true, namaKomunitas: true },
    orderBy: { namaKomunitas: "asc" }
  });

  const clubOptions = [
    { label: "Semua Klub", value: "ALL" },
    ...clubs.map(c => ({ label: c.namaKomunitas, value: c.id }))
  ];

  const hasFilters = Boolean(query || (clubFilter && clubFilter !== "ALL"));

  return (
    <PageContainer>
      <PageHeader 
        title="Data Seluruh Member" 
        description="Data master anggota dari semua klub." 
      />
      
      <SearchFilterBar 
        placeholder="Cari nama, telepon, klub..."
        filters={[
          {
            paramName: "clubId",
            options: clubOptions
          }
        ]}
      />

      <DataTable
        columns={["Nama", "Klub Asal", "Telepon", "Tipe Mobil", "Sumber"]}
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
              title="Belum ada member"
              description="Belum ada member terdaftar di sistem."
            />
          )
        }
        rows={members.map((m) => [
          m.nama,
          m.club ? (
            <Link key={`club-${m.id}`} href={`/admin/klub/${m.club.id}`} className="text-accent hover:underline">
              {m.club.namaKomunitas}
            </Link>
          ) : "-",
          m.telepon,
          m.tipeMobil,
          m.event ? `Event: ${m.event.slug}` : "QR Komunitas"
        ])}
      />

      <Pagination totalPages={totalPages} />
    </PageContainer>
  );
}
