"use client";

import React from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { DataTable } from "@/components/ui/data-table";

import Link from "next/link";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";

import { SearchX } from "lucide-react";

export function ApprovalClient({ applications, totalPages, hasFilters }: { applications: any[], totalPages: number, hasFilters?: boolean }) {
  const columns = ["Nomor", "Tanggal", "Klub", "Acara", "Tipe", "Status", "Aksi"];
  const rows = applications.map((app) => [
    <span key="nomor" className="font-mono text-sm">{app.nomorPengajuan}</span>,
    <span key="date">{new Date(app.createdAt).toLocaleDateString("id-ID")}</span>,
    <span key="club">{app.club?.namaKomunitas}</span>,
    <span key="event">{app.namaAcara}</span>,
    <span key="tier">{app.tierRekomendasi}</span>,
    <StatusBadge key="status" status={app.status} />,
    <div key="action" className="flex gap-3">
      <Link
        href={`/admin/approval/${app.id}`}
        className="text-accent text-body-sm font-semibold hover:underline"
      >
        Detail
      </Link>
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Approval Sponsorship" 
        description="Tinjau dan setujui pengajuan sponsorship dari klub." 
      />

      <SearchFilterBar
        placeholder="Cari nomor, acara, atau klub..."
        filters={[
          {
            paramName: "status",
            options: [
              { label: "Semua Status", value: "ALL" },
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
            ]
          }
        ]}
      />

      <DataTable 
        columns={columns} 
        rows={rows} 
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
              title="Belum ada pengajuan sponsorship"
              description="Pengajuan baru dari klub akan muncul di sini secara otomatis setelah mereka submit lewat microsite."
            />
          )
        }
      />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
