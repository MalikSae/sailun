"use client";

import React, { useState } from "react";
import { QrModal } from "@/components/ui/qr-modal";

interface MemberQrCardWidgetProps {
  member: {
    nama: string;
    club: {
      namaKomunitas: string;
    };
    qrCardId: string;
  };
  qrDataUrl: string;
}

export function MemberQrCardWidget({ member, qrDataUrl }: MemberQrCardWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Kartu gaya "Kartu Kredit" (Aspect Ratio 1.6:1) */}
      <div className="member-qr-card w-full max-w-[400px] aspect-[1.6/1] rounded-[12px] shadow-xl relative flex flex-col justify-between p-6 border border-white/5">
        <div className="lines-down"></div>
        <div className="lines-up"></div>

        {/* Dekorasi Aksen atas */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-accent-hover z-20"></div>
        
        {/* Header Kartu */}
        <div className="flex justify-between items-start w-full relative z-20">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-graphite-text-strong/70 uppercase mb-1">
              {member.club.namaKomunitas}
            </p>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              {member.nama}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] text-graphite-text uppercase tracking-widest">ID Member</p>
            <p className="font-mono text-sm font-semibold text-accent mt-0.5">
              {member.qrCardId.split('-')[0].toUpperCase()}
            </p>
          </div>
        </div>

        {/* QR Code Kecil di dalam Kartu */}
        <div className="flex items-end justify-between w-full mt-auto relative z-20">
          <div className="bg-white p-1.5 rounded shadow-sm">
            <img src={qrDataUrl} alt="QR Mini" className="w-16 h-16 object-contain" />
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-widest text-graphite-text-strong/50">
              SAILUN COMMUNITY
            </p>
          </div>
        </div>
      </div>

      {/* Teks Penjelasan & Tombol */}
      <div className="mt-4 text-center max-w-[400px]">
        <p className="text-body-sm text-body mb-4 px-2">
          Tunjukkan QR ini ke dealer Sailun saat bertransaksi untuk klaim diskon & kumpulkan poin.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md font-medium text-[13.5px] transition-colors bg-white border border-hairline text-ink hover:bg-canvas hover:text-accent shadow-sm"
        >
          Lihat QR Penuh
        </button>
      </div>

      <QrModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        qrDataUrl={qrDataUrl} 
        title="QR Member Anda"
      />
    </div>
  );
}
