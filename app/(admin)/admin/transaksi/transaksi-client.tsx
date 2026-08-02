"use client";

import React, { useState } from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { submitVoidTransaction } from "@/app/actions/void-transaction";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";

import { EmptyState } from "@/components/ui/empty-state";
import { SearchX, Inbox } from "lucide-react";

interface TransaksiClientProps {
  transactions: any[];
  totalPages: number;
  hasFilters?: boolean;
}

export default function TransaksiClient({ transactions, totalPages, hasFilters }: TransaksiClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [voidCatatan, setVoidCatatan] = useState("");
  const [voidingId, setVoidingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVoid = async (id: string) => {
    setError("");
    setLoadingId(id);
    try {
      const result = await submitVoidTransaction(id, voidCatatan);
      if (result.success) {
        setVoidingId(null);
        setVoidCatatan("");
        router.refresh();
      } else {
        setError(result.error || "Gagal melakukan void.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = ["ID Transaksi", "Member & Dealer", "Produk & Harga", "Tanggal", "Status", "Aksi"];
  
  const rows = transactions.map((t) => [
    <span key={`id-${t.id}`} className="font-mono text-body-sm text-muted" title={t.id}>{t.id.substring(t.id.length - 8)}</span>,
    <div key={`info-${t.id}`} className="flex flex-col gap-1">
      <span className="text-body-sm font-medium text-ink">{t.member.nama}</span>
      <span className="text-caption text-muted">{t.dealer.namaDealer}</span>
    </div>,
    <div key={`produk-${t.id}`} className="flex flex-col gap-1">
      <span className="text-body-sm text-ink">{t.produk}</span>
      <span className="text-body-sm font-medium text-ink">Rp {t.nominal.toLocaleString("id-ID")}</span>
    </div>,
    new Date(t.createdAt).toLocaleDateString("id-ID"),
    <StatusBadge key={`status-${t.id}`} status={t.status} />,
    <div key={`action-${t.id}`} className="w-full md:w-auto min-w-[200px]">
      {t.status === "CONFIRMED" && (
        <>
          {voidingId === t.id ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="border border-hairline rounded px-3 py-2 text-body-sm w-full"
                placeholder="Alasan void..."
                value={voidCatatan}
                onChange={(e) => setVoidCatatan(e.target.value)}
              />
              <div className="flex gap-2">
                <ButtonPrimary
                  className="bg-danger hover:bg-danger/90 text-white"
                  disabled={loadingId === t.id || !voidCatatan}
                  onClick={() => handleVoid(t.id)}
                >
                  {loadingId === t.id ? "Memproses..." : "Konfirmasi"}
                </ButtonPrimary>
                <ButtonSecondary
                  disabled={loadingId === t.id}
                  onClick={() => setVoidingId(null)}
                >
                  Batal
                </ButtonSecondary>
              </div>
            </div>
          ) : (
            <ButtonSecondary
              className="text-danger border-danger hover:bg-danger-soft hover:text-danger w-full"
              onClick={() => setVoidingId(t.id)}
            >
              Void Transaksi
            </ButtonSecondary>
          )}
        </>
      )}
      {t.status === "VOIDED" && t.catatanAdmin && (
        <span className="text-caption text-danger">Catatan: {t.catatanAdmin}</span>
      )}
    </div>
  ]);

  return (
    <div>
      {error && <p className="text-danger mb-4 p-3 bg-danger-soft rounded">{error}</p>}
      
      <SearchFilterBar
        placeholder="Cari ID, member, dealer, produk..."
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
              title="Belum ada transaksi"
              description="Belum ada riwayat transaksi yang tercatat di sistem."
            />
          )
        }
      />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
