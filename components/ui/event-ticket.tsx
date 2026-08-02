import React from "react";
import QRCode from "qrcode";
import { Calendar, Ticket } from "lucide-react";

interface EventTicketProps {
  attendanceId: string;
  namaEvent: string;
  tanggalEvent: Date | string;
  namaMember: string;
  namaKlub: string;
}

export async function EventTicket({
  attendanceId,
  namaEvent,
  tanggalEvent,
  namaMember,
  namaKlub,
}: EventTicketProps) {
  // Generate QR code dari attendanceId
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(attendanceId, {
      width: 192,
      margin: 1,
      color: {
        dark: "#15171A",
        light: "#FFFFFF",
      },
    });
  } catch (e) {
    console.error("QR code generation failed:", e);
  }

  const tanggalFormatted =
    typeof tanggalEvent === "string"
      ? new Date(tanggalEvent).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : tanggalEvent.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

  return (
    <div className="bg-gradient-to-br from-graphite to-graphite-soft rounded-lg px-[24px] py-[24px] flex flex-col items-center gap-5 max-w-sm mx-auto shadow-xl">
      {/* Label */}
      <div className="flex items-center gap-2">
        <Ticket className="w-4 h-4 text-accent" />
        <span className="font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] text-accent uppercase">
          Tiket Kehadiran
        </span>
      </div>

      {/* Nama event */}
      <div className="text-center">
        <h2 className="text-title-lg font-display text-graphite-text-strong leading-snug">
          {namaEvent}
        </h2>
        <p className="font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] text-graphite-text uppercase mt-1">
          {namaKlub}
        </p>
      </div>

      {/* Tanggal */}
      <div className="flex items-center gap-2 text-graphite-text">
        <Calendar className="w-4 h-4 text-accent shrink-0" />
        <span className="font-body text-[12.5px] font-normal leading-[1.5]">
          {tanggalFormatted}
        </span>
      </div>

      {/* Divider putus-putus */}
      <div className="w-full border-t border-dashed border-graphite-text/30" />

      {/* QR Code */}
      <div className="bg-card p-3 rounded-md shadow-inner w-48 h-48 flex items-center justify-center">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`Tiket QR ${attendanceId}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-[11px] font-mono text-center">
            QR tidak dapat ditampilkan
          </div>
        )}
      </div>

      {/* Nama member */}
      <div className="text-center">
        <p className="font-body text-[12.5px] font-medium leading-[1.5] text-graphite-text-strong">
          {namaMember}
        </p>
        <p className="font-mono text-[10px] tracking-[0.5px] text-graphite-text mt-0.5">
          {attendanceId}
        </p>
      </div>
    </div>
  );
}
