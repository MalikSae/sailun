"use client";

import React, { useState } from "react";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { Copy, CheckCircle2 } from "lucide-react";

export function CopyLinkButton({ url, inverse }: { url: string; inverse?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Gagal menyalin link:", e);
    }
  }

  if (inverse) {
    return (
      <button 
        onClick={handleCopy} 
        className="flex items-center justify-center gap-2 px-4 py-2 shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md transition-colors font-display text-[13.5px] font-semibold leading-none h-[40px] w-full"
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-success-soft" /> : <Copy className="w-4 h-4 text-white/80" />}
        {copied ? "Tersalin!" : "Salin Link"}
      </button>
    );
  }

  return (
    <ButtonSecondary onClick={handleCopy} className="gap-2 shrink-0">
      {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      {copied ? "Tersalin!" : "Salin Link"}
    </ButtonSecondary>
  );
}
