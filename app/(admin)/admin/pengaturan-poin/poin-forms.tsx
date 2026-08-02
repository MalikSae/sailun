"use client";

import { useTransition } from "react";
import { FormCard } from "@/components/ui/form-card";
import { TextInput } from "@/components/ui/text-input";
import { updatePointSettings, createCatalogItem, toggleCatalogItemStatus } from "@/app/actions/admin-poin";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonGhost } from "@/components/ui/button-ghost";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export function PointSettingsForm({ currentSettings }: { currentSettings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updatePointSettings(formData);
        alert("Pengaturan berhasil disimpan");
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <FormCard title="Parameter Poin" description="Ubah parameter perhitungan poin (berlaku ke depan)">
      <form action={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Diskon Member (Rp)</label>
          <TextInput name="diskon_member_nominal" type="number" defaultValue={currentSettings.diskon_member_nominal || "50000"} required />
        </div>
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Poin Referral per Transaksi</label>
          <TextInput name="poin_referral" type="number" defaultValue={currentSettings.poin_referral || "10"} required />
        </div>
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Poin Klub per Transaksi</label>
          <TextInput name="poin_klub" type="number" defaultValue={currentSettings.poin_klub || "20"} required />
        </div>
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Masa Berlaku Poin (Bulan)</label>
          <TextInput name="masa_berlaku_poin_bulan" type="number" defaultValue={currentSettings.masa_berlaku_poin_bulan || "12"} required />
        </div>
        <ButtonPrimary type="submit" disabled={isPending} className="w-full justify-center">Simpan Pengaturan</ButtonPrimary>
      </form>
    </FormCard>
  );
}

export function CreateCatalogForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createCatalogItem(formData);
        alert("Item katalog ditambahkan");
        router.refresh();
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <FormCard title="Tambah Item Redeem" description="Tambahkan item baru ke katalog">
      <form action={handleCreate} className="space-y-4">
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Nama Item</label>
          <TextInput name="nama" required />
        </div>
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Deskripsi</label>
          <TextInput name="deskripsi" required />
        </div>
        <div>
          <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Harga (Poin)</label>
          <TextInput name="hargaPoin" type="number" required />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="aktif" id="aktif" defaultChecked className="w-4 h-4" />
          <label htmlFor="aktif" className="text-body-md text-ink">Langsung Aktif</label>
        </div>
        <ButtonPrimary type="submit" disabled={isPending} className="w-full justify-center">Tambah Item</ButtonPrimary>
      </form>
    </FormCard>
  );
}

export function ToggleCatalogStatus({ id, currentStatus }: { id: string; currentStatus: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleCatalogItemStatus(id, currentStatus);
        router.refresh();
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <ButtonGhost onClick={handleToggle} disabled={isPending} title="Toggle Status Aktif">
      <Power className={`w-4 h-4 ${currentStatus ? "text-success" : "text-muted"}`} />
    </ButtonGhost>
  );
}
