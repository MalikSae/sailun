"use client";

import React, { useState } from "react";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { Copy, CheckCircle2 } from "lucide-react";

/** Re-export dari components/ui/copy-link-button untuk backward compatibility */
export function CopyLinkButton({ url }: { url: string }) {
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

  return (
    <ButtonSecondary onClick={handleCopy} className="gap-2 shrink-0">
      {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      {copied ? "Tersalin!" : "Salin Link"}
    </ButtonSecondary>
  );
}
