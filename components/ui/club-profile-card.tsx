import React from "react";
import { Shield } from "lucide-react";

interface ClubProfileCardProps {
  clubName: string;
  clubId: string;
  memberCount: number;
  yearStart: number;
  yearEnd: number;
  chairman: string;
  logoUrl?: string | null;
  status: string;
  kota?: string | null;
  noWhatsappKetua?: string | null;
  alamatSekretariat?: string | null;
  /** "horizontal" (default) = logo kiri, info kanan. "stacked" = logo di atas, info di bawah, center-aligned. */
  layout?: "horizontal" | "stacked";
}

const statusClass = (status: string) => {
  if (status === "active") return "bg-success-soft text-success";
  if (status === "unverified") return "bg-warning-soft text-warning";
  return "bg-danger-soft text-danger";
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] px-[9px] py-[4px] rounded-xs uppercase shrink-0 ${statusClass(status)}`}
  >
    {status === "active" ? "verified" : status}
  </span>
);

const DetailGrid = ({
  clubId,
  memberCount,
  yearStart,
  yearEnd,
  chairman,
  kota,
  noWhatsappKetua,
  alamatSekretariat,
}: Pick<
  ClubProfileCardProps,
  | "clubId"
  | "memberCount"
  | "yearStart"
  | "yearEnd"
  | "chairman"
  | "kota"
  | "noWhatsappKetua"
  | "alamatSekretariat"
>) => (
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">Ketua Komunitas</p>
      <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{chairman}</p>
    </div>
    <div>
      <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">Jumlah Anggota</p>
      <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{memberCount} Anggota</p>
    </div>
    <div>
      <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">Tahun Mobil</p>
      <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{yearStart} - {yearEnd}</p>
    </div>
    <div>
      <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">ID Klub</p>
      <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium font-mono text-[11.5px] truncate" title={clubId}>{clubId}</p>
    </div>
    {kota && (
      <div>
        <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">Kota</p>
        <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{kota}</p>
      </div>
    )}
    {noWhatsappKetua && (
      <div>
        <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">No WhatsApp Ketua</p>
        <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{noWhatsappKetua}</p>
      </div>
    )}
    {alamatSekretariat && (
      <div className="col-span-2">
        <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-1">Alamat Sekretariat</p>
        <p className="font-body text-[12.5px] font-normal leading-[1.5] text-ink font-medium">{alamatSekretariat}</p>
      </div>
    )}
  </div>
);

export function ClubProfileCard({
  clubName,
  clubId,
  memberCount,
  yearStart,
  yearEnd,
  chairman,
  logoUrl,
  status,
  kota,
  noWhatsappKetua,
  alamatSekretariat,
  layout = "horizontal",
}: ClubProfileCardProps) {
  const logoEl = (
    <div
      className={`shrink-0 bg-canvas rounded-md border border-hairline-strong flex items-center justify-center overflow-hidden ${
        layout === "stacked"
          ? "w-[144px] h-[144px]"
          : "w-24 h-24 sm:w-32 sm:h-32"
      }`}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`Logo ${clubName}`} className="w-full h-full object-cover" />
      ) : (
        <Shield className={layout === "stacked" ? "w-14 h-14 text-muted" : "w-12 h-12 text-muted"} />
      )}
    </div>
  );

  if (layout === "stacked") {
    return (
      <div className="bg-card rounded-md px-[22px] py-[22px] border border-hairline flex flex-col gap-4">
        {/* Logo — left-aligned */}
        <div className="pt-2">{logoEl}</div>

        {/* Nama + badge status */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-display-sm font-display text-ink leading-snug">{clubName}</h2>
          <StatusBadge status={status} />
        </div>

        {/* Grid detail */}
        <DetailGrid
          clubId={clubId}
          memberCount={memberCount}
          yearStart={yearStart}
          yearEnd={yearEnd}
          chairman={chairman}
          kota={kota}
          noWhatsappKetua={noWhatsappKetua}
          alamatSekretariat={alamatSekretariat}
        />
      </div>
    );
  }

  // layout === "horizontal" (default — tidak berubah)
  return (
    <div className="bg-card rounded-md px-[22px] py-[22px] border border-hairline flex flex-col sm:flex-row gap-6 items-start">
      {logoEl}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-display-sm font-display text-ink">{clubName}</h2>
          <StatusBadge status={status} />
        </div>
        <DetailGrid
          clubId={clubId}
          memberCount={memberCount}
          yearStart={yearStart}
          yearEnd={yearEnd}
          chairman={chairman}
          kota={kota}
          noWhatsappKetua={noWhatsappKetua}
          alamatSekretariat={alamatSekretariat}
        />
      </div>
    </div>
  );
}
