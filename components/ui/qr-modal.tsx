"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataUrl: string;
  title?: string;
}

export function QrModal({ isOpen, onClose, qrDataUrl, title = "QR Code" }: QrModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-hairline z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-hairline bg-canvas">
          <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted hover:text-ink hover:bg-black/5 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 flex items-center justify-center bg-white">
          <img src={qrDataUrl} alt="QR Code" className="w-full h-auto max-w-[280px]" />
        </div>
      </div>
    </div>,
    document.body
  );
}
