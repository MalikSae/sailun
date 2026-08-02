"use client";

import React, { useState } from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { processRedemption } from "@/app/actions/admin-redeem";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";

import { EmptyState } from "@/components/ui/empty-state";
import { SearchX, Inbox } from "lucide-react";

interface RedeemAdminClientProps {
  redemptions: any[];
  totalPages: number;
  hasFilters?: boolean;
}

export default function RedeemAdminClient({ redemptions, totalPages, hasFilters }: RedeemAdminClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleProcess = async (id: string, action: "APPROVE" | "REJECT", alasan?: string) => {
    setError("");
    setLoadingId(id);
    try {
      const result = await processRedemption(id, action, alasan);
      if (result.success) {
        setRejectingId(null);
        setRejectReason("");
        router.refresh();
      } else {
        setError(result.error || "Gagal memproses penukaran.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = ["Tipe & Nama", "Item (Katalog)", "Poin", "Tanggal", "Status", "Aksi"];
  
  const rows = redemptions.map((r) => [
    <div key={`info-${r.id}`} className="flex flex-col gap-1">
      <span className="text-caption font-medium bg-canvas px-2 py-1 rounded text-muted w-fit">
        {r.targetType}
      </span>
      <span className="text-body-sm font-medium text-ink">{r.targetName}</span>
    </div>,
    r.redemptioncatalog.nama,
    <span key={`poin-${r.id}`} className="text-warning font-medium">-{r.redemptioncatalog.hargaPoin}</span>,
    new Date(r.createdAt).toLocaleDateString("id-ID"),
    <StatusBadge key={`status-${r.id}`} status={r.status} />,
    <div key={`action-${r.id}`} className="w-full md:w-auto min-w-[200px]">
      {r.status === "PENDING" && (
        <>
          {rejectingId === r.id ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="border border-hairline rounded px-3 py-2 text-body-sm w-full"
                placeholder="Alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-2">
                <ButtonPrimary
                  className="bg-danger hover:bg-danger/90 text-white"
                  disabled={loadingId === r.id || !rejectReason}
                  onClick={() => handleProcess(r.id, "REJECT", rejectReason)}
                >
                  {loadingId === r.id ? "Memproses..." : "Tolak"}
                </ButtonPrimary>
                <ButtonSecondary
                  disabled={loadingId === r.id}
                  onClick={() => setRejectingId(null)}
                >
                  Batal
                </ButtonSecondary>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <ButtonPrimary
                disabled={loadingId === r.id}
                onClick={() => handleProcess(r.id, "APPROVE")}
              >
                {loadingId === r.id ? "Memproses..." : "Setujui"}
              </ButtonPrimary>
              <ButtonSecondary
                className="text-danger hover:bg-danger-soft hover:border-danger hover:text-danger"
                disabled={loadingId === r.id}
                onClick={() => setRejectingId(r.id)}
              >
                Tolak
              </ButtonSecondary>
            </div>
          )}
        </>
      )}
      {r.status !== "PENDING" && <span className="text-muted text-body-sm italic">Selesai</span>}
    </div>
  ]);

  return (
    <div>
      {error && <p className="text-danger mb-4 p-3 bg-danger-soft rounded">{error}</p>}
      
      <SearchFilterBar
        placeholder="Cari nama member atau klub..."
        filters={[
          {
            paramName: "status",
            options: [
              { label: "Semua Status", value: "ALL" },
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "Fulfilled", value: "FULFILLED" },
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
              title="Belum ada penukaran poin"
              description="Belum ada pengajuan penukaran poin dari member atau klub."
            />
          )
        }
      />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
