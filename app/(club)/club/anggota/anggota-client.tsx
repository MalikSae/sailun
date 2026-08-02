"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";

import { EmptyState } from "@/components/ui/empty-state";
import { SearchX, Inbox } from "lucide-react";

export function AnggotaClient({ members, totalPages, sourceOptions, hasFilters }: { members: any[], totalPages: number, sourceOptions: any[], hasFilters?: boolean }) {
  return (
    <div>
      <SearchFilterBar
        placeholder="Cari nama atau telepon..."
        filters={[
          {
            paramName: "source",
            options: sourceOptions
          }
        ]}
      />

      <DataTable
        columns={["Nama", "Telepon", "Tanggal Daftar", "Sumber"]}
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
              title="Belum ada anggota"
              description="Belum ada anggota yang bergabung di klub ini."
            />
          )
        }
        rows={members.map((m) => [
          <span key={`name-${m.id}`} className="font-semibold text-ink">{m.nama}</span>,
          <span key={`tel-${m.id}`}>{m.telepon}</span>,
          <span key={`date-${m.id}`}>{new Date(m.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>,
          <span key={`source-${m.id}`}>{m.event?.sponsorshipapplication?.namaAcara || "Profil Klub"}</span>
        ])}
      />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
