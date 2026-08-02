"use client";

import React, { useState, useEffect } from "react";
import { submitTransaction } from "./actions";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-on-accent font-medium py-[11px] rounded-[6px] hover:bg-accent-hover transition-colors disabled:opacity-50"
    >
      {pending ? "Memproses..." : "Konfirmasi Transaksi"}
    </button>
  );
}

export default function TransactionForm({ 
  memberId, 
  diskonNominal
}: { 
  memberId: string, 
  diskonNominal: number
}) {
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState("");
  const [nominal, setNominal] = useState("");
  
  useEffect(() => {
    // Generate idempotency key on client
    setTxId(crypto.randomUUID());
  }, []);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    return split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNominal(formatRupiah(e.target.value));
  };

  return (
    <form 
      action={async (formData) => {
        setError(null);
        const res = await submitTransaction(formData);
        if (res?.error) {
          setError(res.error);
        }
      }}
      className="bg-card rounded-md shadow-sm border border-hairline p-6"
    >
      <input type="hidden" name="memberId" value={memberId} />
      <input type="hidden" name="transactionId" value={txId} />

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="produk" className="block text-[13px] font-medium text-ink mb-1.5">
            Produk Ban <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="produk"
            name="produk"
            required
            placeholder="Contoh: Sailun Atrezzo ZSR 205/55 R16 (4 pcs)"
            className="w-full px-3 py-2 border border-hairline rounded-[6px] text-[13.5px] focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="nominal" className="block text-[13px] font-medium text-ink mb-1.5">
            Total Transaksi Sebelum Diskon (Rp) <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nominal"
            name="nominal"
            required
            value={nominal}
            onChange={handleNominalChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-hairline rounded-[6px] text-[13.5px] focus:outline-none focus:border-accent"
          />
        </div>

        <div className="bg-success-soft p-3 rounded-md border border-success/20 flex items-start gap-2">
          <CheckCircle2 className="w-[18px] h-[18px] text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-success">Diskon Langsung</p>
            <p className="text-[12.5px] text-success/80">Member berhak mendapatkan potongan langsung Rp {diskonNominal.toLocaleString("id-ID")}</p>
          </div>
        </div>



        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-soft text-danger text-[13px] rounded-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
