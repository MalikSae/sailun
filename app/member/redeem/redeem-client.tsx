"use client";

import React, { useState } from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { submitRedemption } from "@/app/actions/redeem";
import { useRouter } from "next/navigation";

interface RedeemClientProps {
  catalog: any[];
  targetId: string;
  targetType: "MEMBER" | "CLUB";
  saldoPoin: number;
}

export default function RedeemClient({ catalog, targetId, targetType, saldoPoin }: RedeemClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRedeem = async (catalogItemId: string) => {
    setError("");
    setLoadingId(catalogItemId);
    try {
      const result = await submitRedemption(targetType, targetId, catalogItemId);
      if (result.success) {
        alert("Pengajuan penukaran poin berhasil! Menunggu persetujuan admin.");
        router.refresh();
      } else {
        setError(result.error || "Gagal mengajukan penukaran poin.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h3 className="text-title-lg font-display text-ink mb-4">Katalog Reward</h3>
      {error && <p className="text-danger mb-4 p-3 bg-danger-soft rounded">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {catalog.map((item) => {
          const isEligible = saldoPoin >= item.hargaPoin;
          return (
            <div key={item.id} className="bg-card p-5 rounded-lg border border-hairline flex flex-col justify-between">
              <div>
                <h4 className="text-title-md font-display text-ink mb-1">{item.nama}</h4>
                <p className="text-body-sm text-muted mb-4">{item.deskripsi}</p>
                <p className="text-title-lg font-display text-accent mb-6">{item.hargaPoin} Poin</p>
              </div>
              
              <ButtonPrimary 
                className="w-full"
                disabled={!isEligible || loadingId !== null}
                onClick={() => handleRedeem(item.id)}
              >
                {loadingId === item.id ? "Memproses..." : isEligible ? "Tukar" : "Poin Tidak Cukup"}
              </ButtonPrimary>
            </div>
          );
        })}
      </div>
    </div>
  );
}
