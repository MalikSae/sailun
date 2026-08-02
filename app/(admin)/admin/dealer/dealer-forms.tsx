"use client";

import { useState } from "react";
import { FormCard } from "@/components/ui/form-card";
import { TextInput } from "@/components/ui/text-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { createDealer, createDealerStaff } from "@/app/actions/admin-dealer";
import { ButtonPrimary } from "@/components/ui/button-primary";

export function DealerForms({ dealers }: { dealers: { id: string, namaDealer: string }[] }) {
  const [staffPassword, setStaffPassword] = useState("");

  const handleAddDealer = async (formData: FormData) => {
    try {
      await createDealer(formData);
      alert("Dealer berhasil ditambahkan");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddStaff = async (formData: FormData) => {
    try {
      const res = await createDealerStaff(formData);
      setStaffPassword(res.password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <FormCard title="Tambah Dealer Baru" description="Masukkan data dealer baru">
        <form action={handleAddDealer} className="space-y-4">
          <div>
            <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Nama Dealer</label>
            <TextInput name="namaDealer" required />
          </div>
          <div>
            <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Alamat</label>
            <TextInput name="alamat" required />
          </div>
          <ButtonPrimary type="submit" className="w-full justify-center">Simpan Dealer</ButtonPrimary>
        </form>
      </FormCard>

      <FormCard title="Tambah Akun Petugas" description="Buat akun login untuk staf dealer">
        <form action={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Pilih Dealer</label>
            <SelectDropdown name="dealerId" required>
              <option value="">Pilih Dealer...</option>
              {dealers.map(d => <option key={d.id} value={d.id}>{d.namaDealer}</option>)}
            </SelectDropdown>
          </div>
          <div>
            <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Nama Petugas</label>
            <TextInput name="nama" required />
          </div>
          <div>
            <label className="block text-caption text-muted mb-1 uppercase tracking-wider">Email Akun</label>
            <TextInput type="email" name="email" required />
          </div>
          
          <ButtonPrimary type="submit" className="w-full justify-center">Buat Akun Petugas</ButtonPrimary>

          {staffPassword && (
            <div className="p-4 bg-success-soft rounded-md border border-success/30 text-success font-mono text-[13px] mt-4">
              <p className="font-bold mb-2">Akun berhasil dibuat!</p>
              <p>Simpan password berikut, tidak akan ditampilkan lagi:</p>
              <div className="text-[20px] tracking-widest mt-2">{staffPassword}</div>
            </div>
          )}
        </form>
      </FormCard>
    </div>
  );
}
