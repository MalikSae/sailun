import React from "react";
import { CopyLinkButton } from "./copy-link-button";

export function ReferralShareCard({ url, code }: { url: string, code?: string }) { 
  return (
    <div className="bg-gradient-to-br from-graphite to-graphite-soft rounded-md p-[20px] sm:p-[24px] text-graphite-text-strong flex flex-col gap-5">
      <div>
        <h3 className="text-title-lg font-display mb-1 text-graphite-text-strong">Ajak Teman & Dapatkan Poin</h3>
        <p className="font-body text-[12.5px] font-normal leading-[1.5] opacity-90 max-w-xl text-graphite-text-strong">
          Bagikan link referral ini ke teman. Kamu dan temanmu akan mendapatkan poin saat temanmu bertransaksi.
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-3 w-full shrink-0">
        <div className="bg-black/20 border border-white/10 rounded-md px-4 h-[40px] flex items-center overflow-hidden w-full">
          <span className="text-white/90 font-mono text-[12.5px] truncate select-all block w-full">{url}</span>
        </div>
        <CopyLinkButton url={url} inverse />
      </div>
    </div>
  ); 
}
