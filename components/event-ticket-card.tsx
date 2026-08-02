"use client";

import React, { useState } from "react";
import { QrModal } from "@/components/ui/qr-modal";
import { Ticket } from "lucide-react";

interface EventTicketCardProps {
  eventName: string;
  eventDate: string;
  qrDataUrl: string;
}

export function EventTicketCard({ eventName, eventDate, qrDataUrl }: EventTicketCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="border border-hairline bg-canvas/50 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="font-medium text-ink">{eventName}</p>
          <p className="text-body-sm text-muted mt-1">{eventDate}</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-canvas text-ink hover:text-accent border border-hairline rounded-md transition-colors w-full sm:w-auto shrink-0"
        >
          <Ticket className="w-4 h-4" />
          Lihat Tiket
        </button>
      </div>

      <QrModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        qrDataUrl={qrDataUrl}
        title="Tiket Kehadiran"
      />
    </>
  );
}
