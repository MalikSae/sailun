import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FormCard } from "@/components/ui/form-card";
import { TextInput } from "@/components/ui/text-input";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { updateClubData } from "@/app/actions/admin-club";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";

export const dynamic = 'force-dynamic';

export default async function EditKlubPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const club = await db.club.findUnique({ where: { id: resolvedParams.id } });
  
  if (!club) return notFound();

  const handleUpdate = async (formData: FormData) => {
    "use server";
    await updateClubData(resolvedParams.id, formData);
    redirect(`/admin/klub/${resolvedParams.id}`);
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-display-md font-display font-bold text-ink">Edit Data Klub</h1>
        <p className="text-body-md text-muted mt-1">Ubah informasi dasar untuk {club.namaKomunitas}.</p>
      </div>

      <div className="max-w-2xl">
        <FormCard title="Informasi Dasar" description="Perbarui nama, ketua, dan detail lainnya.">
          <form action={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Nama Komunitas</label>
              <TextInput name="namaKomunitas" defaultValue={club.namaKomunitas} required />
            </div>
            <div>
              <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Nama Ketua</label>
              <TextInput name="namaKetua" defaultValue={club.namaKetua} required />
            </div>
            <div>
              <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Jumlah Anggota</label>
              <TextInput type="number" name="jumlahAnggota" defaultValue={club.jumlahAnggota.toString()} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Tahun Mobil Mulai</label>
                <TextInput type="number" name="tahunMobilMulai" defaultValue={club.tahunMobilMulai.toString()} required />
              </div>
              <div>
                <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Tahun Mobil Akhir</label>
                <TextInput type="number" name="tahunMobilAkhir" defaultValue={club.tahunMobilAkhir.toString()} required />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <ButtonPrimary type="submit">Simpan Perubahan</ButtonPrimary>
            </div>
          </form>
        </FormCard>
      </div>
    </PageContainer>
  );
}
