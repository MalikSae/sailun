import React from "react";
import { StatusBadge } from "./status-badge";

interface ApplicationStatusTimelineProps {
  status: string;
  createdAt: Date;
  updatedAt: Date;
  tierRekomendasi?: string | null;
  tierFinal?: string | null;
  catatanAdmin?: string | null;
  nomorPengajuan?: string | null;
}

export function ApplicationStatusTimeline({
  status,
  createdAt,
  updatedAt,
  tierRekomendasi,
  tierFinal,
  catatanAdmin,
  nomorPengajuan
}: ApplicationStatusTimelineProps) {
  return (
    <div className="bg-card rounded-md p-6 border border-hairline">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-title-lg font-display text-ink">Status Pengajuan Sponsorship</h3>
        {nomorPengajuan && (
          <div className="bg-canvas px-3 py-1 rounded text-accent font-mono text-sm border border-hairline">
            {nomorPengajuan}
          </div>
        )}
      </div>
      
      <div className="relative border-l-2 border-hairline-strong ml-3 space-y-8">
        
        {/* Step 1: Diajukan */}
        <div className="relative pl-6">
          <div className="absolute w-4 h-4 bg-accent rounded-full -left-[9px] top-1 border-2 border-card"></div>
          <p className="font-body text-[12.5px] font-normal leading-[1.5] font-semibold text-ink">Pengajuan Diterima</p>
          <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-2">{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted">
            Pengajuan Anda telah diterima oleh sistem. Rekomendasi awal: 
            <span className="font-bold ml-1 text-accent">{tierRekomendasi || 'MICRO'}</span>
          </p>
        </div>

        {/* Step 2: Review Admin */}
        <div className="relative pl-6">
          <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-card ${
            status === 'PENDING' ? 'bg-warning animate-pulse' : 
            (status === 'APPROVED' || status === 'REJECTED' || status === 'EXPIRED') ? 'bg-accent' : 'bg-canvas'
          }`}></div>
          <p className="font-body text-[12.5px] font-normal leading-[1.5] font-semibold text-ink">Review Tim Sailun</p>
          {status === 'PENDING' ? (
            <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted mt-1">Tim Sailun sedang meninjau proposal Anda. Mohon tunggu informasi selanjutnya.</p>
          ) : (
            <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-2">Selesai</p>
          )}
        </div>

        {/* Step 3: Keputusan */}
        {(status === 'APPROVED' || status === 'REJECTED' || status === 'EXPIRED') && (
          <div className="relative pl-6">
            <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-2 border-card ${
              status === 'APPROVED' ? 'bg-success' : 'bg-danger'
            }`}></div>
            <p className="font-body text-[12.5px] font-normal leading-[1.5] font-semibold text-ink mb-2">Keputusan Final</p>
            <div className="mb-3">
              <StatusBadge status={status} />
            </div>
            
            {status === 'APPROVED' && tierFinal && (
              <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted">
                Selamat! Pengajuan Anda disetujui dengan tier <span className="font-bold text-success">{tierFinal}</span>. 
                Sistem telah membuat halaman pendaftaran Event Anda.
              </p>
            )}

            {status === 'REJECTED' && (
              <div className="bg-danger-soft border border-danger/20 p-3 rounded-md mt-2">
                <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] font-semibold text-danger mb-1">Alasan Penolakan:</p>
                <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink">{catatanAdmin || "Tidak ada catatan."}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
