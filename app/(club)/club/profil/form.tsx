"use client";

import React, { useState, useActionState, useEffect } from "react";
import { updateProfile } from "./actions";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { FileUploadDropzone } from "@/components/ui/file-upload-dropzone";
import { TextInput } from "@/components/ui/text-input";
import { CityCombobox } from "@/components/ui/city-combobox";
import { FormCard } from "@/components/ui/form-card";
import { AlertCircle, CheckCircle } from "lucide-react";

export function ProfilForm({ club }: { club: any }) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(club.logoUrl || null);
  const [kota, setKota] = useState(club.kota || "");

  const [state, formAction, isPending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const handleSubmit = (formData: FormData) => {
    if (logoFile) {
      formData.set("logo", logoFile);
    }
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <FormCard title="Logo Klub">
        <div className="flex flex-col gap-4">
          {logoPreviewUrl && (
            <div className="w-24 h-24 rounded overflow-hidden border border-hairline-strong bg-canvas flex items-center justify-center shrink-0">
              <img src={logoPreviewUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
          <FileUploadDropzone 
            onFileSelect={(file) => setLogoFile(file)} 
          />
        </div>
      </FormCard>

      <FormCard title="Informasi Klub">
        <div className="space-y-4">
          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">Nama Komunitas</label>
            <TextInput name="namaKomunitas" defaultValue={club.namaKomunitas} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-uppercase text-muted mb-1.5">Tahun Berdiri (Mulai)</label>
              <TextInput type="number" name="tahunMobilMulai" defaultValue={club.tahunMobilMulai} required />
            </div>
            <div>
              <label className="block text-label-uppercase text-muted mb-1.5">Tahun (Akhir)</label>
              <TextInput type="number" name="tahunMobilAkhir" defaultValue={club.tahunMobilAkhir} required />
            </div>
          </div>

          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">Jumlah Anggota Saat Ini</label>
            <TextInput type="number" name="jumlahAnggota" defaultValue={club.jumlahAnggota} required />
          </div>
        </div>
      </FormCard>

      <FormCard title="Kontak & Sekretariat">
        <div className="space-y-4">
          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">Nama Ketua Umum</label>
            <TextInput name="namaKetua" defaultValue={club.namaKetua} required />
          </div>

          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">No. WhatsApp Ketua</label>
            <TextInput 
              name="noWhatsappKetua" 
              defaultValue={club.noWhatsappKetua || ""} 
              placeholder="Contoh: 081234567890" 
              required 
            />
          </div>

          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">Kota / Kabupaten</label>
            <CityCombobox value={kota} onChange={setKota} />
            <input type="hidden" name="kota" value={kota} />
          </div>

          <div>
            <label className="block text-label-uppercase text-muted mb-1.5">Alamat Lengkap Sekretariat</label>
            <TextInput name="alamatSekretariat" defaultValue={club.alamatSekretariat || ""} required />
          </div>
        </div>
      </FormCard>

      {state?.error && (
        <div className="p-4 bg-danger-soft border border-danger/20 rounded-[6px] text-danger text-[13px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 bg-success-soft border border-success/20 rounded-[6px] text-success text-[13px] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {state.success}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <ButtonPrimary type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </ButtonPrimary>
      </div>
    </form>
  );
}
