import React from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";

import { SearchX, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Riwayat Transaksi | Sailun Dealer",
};

export const dynamic = 'force-dynamic';

export default async function DealerTransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "DEALER") {
    redirect("/login");
  }

  const staff = await db.dealerstaff.findUnique({
    where: { userId: session.user.id },
    include: { dealer: true }
  });

  if (!staff) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const filterStatus = (typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {
    dealerId: staff.dealerId
  };

  if (query) {
    where.OR = [
      { id: { contains: query } },
      { member: { nama: { contains: query } } },
      { produk: { contains: query } }
    ];
  }

  if (filterStatus && filterStatus !== "ALL") {
    where.status = filterStatus;
  }

  const totalItems = await db.transaction.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const transactions = await db.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      member: {
        include: { club: true }
      }
    }
  });

  const hasFilters = Boolean(query || (filterStatus && filterStatus !== "ALL"));

  return (
    <PageContainer>
      <PageHeader 
        title="Riwayat Transaksi" 
        description={`Daftar transaksi yang diproses oleh ${staff.dealer.namaDealer}.`} 
      />

      <SearchFilterBar
        placeholder="Cari ID, member, produk..."
        filters={[
          {
            paramName: "status",
            options: [
              { label: "Semua Status", value: "ALL" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Voided", value: "VOIDED" },
              { label: "Draft", value: "DRAFT" },
            ]
          }
        ]}
      />

      <DataTable
        columns={["Tanggal", "Member", "Produk", "Nominal & Diskon", "Status"]}
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
              title="Belum ada transaksi"
              description="Belum ada transaksi yang diproses oleh dealer Anda."
            />
          )
        }
        rows={transactions.map((tx) => [
          <div key={`date-${tx.id}`}>
            <p className="text-[13.5px] text-ink font-medium">
              {format(new Date(tx.createdAt), "dd MMM yyyy", { locale: id })}
            </p>
            <p className="text-[12px] text-muted">
              {format(new Date(tx.createdAt), "HH:mm", { locale: id })}
            </p>
          </div>,
          <div key={`member-${tx.id}`}>
            <p className="text-[13.5px] text-ink font-medium">{tx.member.nama}</p>
            <p className="text-[12px] text-muted">{tx.member.club.namaKomunitas}</p>
          </div>,
          <div key={`produk-${tx.id}`} className="text-[13.5px] text-ink max-w-[200px] truncate" title={tx.produk}>
            {tx.produk}
          </div>,
          <div key={`nominal-${tx.id}`}>
            <p className="text-[13.5px] text-ink font-medium">
              Rp {Number(tx.nominal).toLocaleString("id-ID")}
            </p>
            <p className="text-[12px] text-success font-medium">
              Diskon: Rp {Number(tx.diskon).toLocaleString("id-ID")}
            </p>
          </div>,
          <StatusBadge key={`status-${tx.id}`} status={tx.status as any} />
        ])}
      />
      
      <Pagination totalPages={totalPages} />
    </PageContainer>
  );
}
