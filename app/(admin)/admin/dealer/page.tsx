import React from "react";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { DealerForms } from "./dealer-forms";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

import { SearchX, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = 'force-dynamic';

export default async function AdminDealerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const filterStatus = (typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {};

  if (query) {
    where.OR = [
      { namaDealer: { contains: query } },
      { alamat: { contains: query } }
    ];
  }

  if (filterStatus && filterStatus !== "ALL") {
    where.status = filterStatus;
  }

  const totalItems = await db.dealer.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedDealers = await db.dealer.findMany({
    where,
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      dealerstaff: {
        include: { user: true }
      }
    }
  });

  const allDealers = await db.dealer.findMany({
    select: { id: true, namaDealer: true }
  });

  const hasFilters = Boolean(query || (filterStatus && filterStatus !== "ALL"));

  return (
    <PageContainer>
      <PageHeader 
        title="Manajemen Dealer" 
        description="Data master dealer dan manajemen staf." 
      />

      <DealerForms dealers={allDealers} />

      <div className="bg-card border border-hairline rounded-md p-6 mt-8">
        <h2 className="text-display-md font-display font-semibold mb-6">Daftar Dealer & Staf</h2>
        
        <SearchFilterBar
          placeholder="Cari nama dealer atau alamat..."
          filters={[
            {
              paramName: "status",
              options: [
                { label: "Semua Status", value: "ALL" },
                { label: "Aktif", value: "active" },
                { label: "Inaktif", value: "inactive" },
              ]
            }
          ]}
        />

        <DataTable
          columns={["Nama Dealer", "Alamat", "Staf Terdaftar", "Status"]}
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
                title="Belum ada dealer"
                description="Belum ada dealer yang terdaftar di sistem."
              />
            )
          }
          rows={paginatedDealers.map((dealer) => [
            dealer.namaDealer,
            dealer.alamat,
            <ul key={dealer.id} className="list-disc pl-4 space-y-1 text-body-sm text-muted">
              {dealer.dealerstaff.map(staff => (
                <li key={staff.id}>{staff.user.email || staff.user.phone || "Petugas"}</li>
              ))}
              {dealer.dealerstaff.length === 0 && <span className="italic">Belum ada staf</span>}
            </ul>,
            <StatusBadge key={`status-${dealer.id}`} status={dealer.status === "active" ? "APPROVED" : "INACTIVE"} />
          ])}
        />
        
        <Pagination totalPages={totalPages} />
      </div>
    </PageContainer>
  );
}
