"use client";

import React, { useEffect } from "react";
import { ButtonPrimary } from "./button-primary";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  isDanger = false,
  children
}: ConfirmationModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
      <div 
        className="bg-card border border-hairline rounded-md shadow-xl w-full max-w-md overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <h2 className="text-display-sm font-display text-ink mb-2">{title}</h2>
          <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted mb-6">{description}</p>
          
          {children && <div className="mb-6">{children}</div>}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 font-body text-[12.5px] font-normal leading-[1.5] font-semibold text-muted hover:text-ink transition-colors rounded-sm"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-sm font-body text-[12.5px] font-normal leading-[1.5] font-semibold transition-colors ${
                isDanger 
                  ? "bg-transparent border border-danger text-danger hover:bg-danger-soft" 
                  : "bg-accent text-on-accent hover:bg-accent-hover"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
