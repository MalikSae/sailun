import React from "react";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PointSettingsForm, CreateCatalogForm, ToggleCatalogStatus } from "./poin-forms";

export const dynamic = 'force-dynamic';

export default async function PengaturanPoinPage() {
  const settingsRaw = await db.pointsetting.findMany();
  const currentSettings: Record<string, string> = {};
  for (const s of settingsRaw) {
    currentSettings[s.key] = s.value;
  }

  const catalog = await db.redemptioncatalog.findMany();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-display-md font-display font-bold text-ink">Pengaturan Poin</h1>
        <p className="text-body-md text-muted mt-1">Konfigurasi nilai poin dan manajemen item katalog redeem.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PointSettingsForm currentSettings={currentSettings} />
        <CreateCatalogForm />
      </div>

      <div className="bg-card border border-hairline rounded-md p-6">
        <h2 className="text-display-md font-display font-semibold mb-4">Katalog Redeem Aktif</h2>
        <DataTable
          columns={["Nama Item", "Deskripsi", "Harga Poin", "Status", "Aksi"]}
          rows={catalog.map((item) => [
            item.nama,
            item.deskripsi,
            item.hargaPoin.toLocaleString('id-ID'),
            <StatusBadge key={item.id} status={item.aktif ? "APPROVED" : "VOIDED"} />,
            <ToggleCatalogStatus key={`action-${item.id}`} id={item.id} currentStatus={item.aktif} />
          ])}
        />
      </div>
    </div>
  );
}
