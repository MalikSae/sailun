"use client";

import React, { useState } from "react";
import { registerMember } from "@/app/(public)/actions";
import { TextInput } from "@/components/ui/text-input";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface EventRegistrationFormProps {
  clubId: string;
  eventAsalId?: string;
  clubName: string;
  refCode?: string;
}

export function EventRegistrationForm({ clubId, eventAsalId, clubName, refCode }: EventRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const genderOptions = [
    { label: "Laki-laki", value: "LAKI_LAKI" },
    { label: "Perempuan", value: "PEREMPUAN" }
  ];

  const [gender, setGender] = useState("LAKI_LAKI");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("gender", gender);
    formData.append("clubId", clubId);
    if (eventAsalId) {
      formData.append("eventAsalId", eventAsalId);
    }

    const result = await registerMember(formData);

    if (result.success) {
      setSuccessData(true);
    } else {
      setError(result.error || "Gagal melakukan registrasi.");
    }
    setLoading(false);
  }

  if (successData) {
    return (
      <div className="bg-card shadow-sm border border-hairline p-8 rounded-lg text-center">
        <div className="w-16 h-16 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-title-lg font-display text-ink mb-2">Registrasi Berhasil!</h3>
        <p className="text-body-md text-body mb-6">
          Selamat datang di keluarga besar {clubName} dan Sailun Tire. Silakan login menggunakan email dan password yang baru saja Anda buat.
        </p>
        <div>
          <Link href="/login">
            <ButtonPrimary className="w-full">Login ke Dashboard</ButtonPrimary>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {error && (
        <div className="bg-danger-soft border border-danger text-danger px-4 py-3 rounded-md text-body-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {refCode && <input type="hidden" name="ref" value={refCode} />}
        <div>
          <label htmlFor="nama" className="block text-body-sm text-muted mb-1">Nama Lengkap</label>
          <TextInput id="nama" name="nama" required placeholder="Sesuai KTP" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-body-sm text-muted mb-1">Email</label>
            <TextInput id="email" name="email" type="email" required placeholder="email@contoh.com" />
          </div>
          <div>
            <label htmlFor="telepon" className="block text-body-sm text-muted mb-1">No. WhatsApp</label>
            <TextInput id="telepon" name="telepon" type="tel" required placeholder="08123456789" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="usia" className="block text-body-sm text-muted mb-1">Usia</label>
            <TextInput id="usia" name="usia" type="number" required placeholder="Mis: 25" min="17" />
          </div>
          <div>
            <label className="block text-body-sm text-muted mb-1">Gender</label>
            <SelectDropdown 
              name="gender_ui" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              {genderOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </SelectDropdown>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipeMobil" className="block text-body-sm text-muted mb-1">Tipe Mobil</label>
            <TextInput id="tipeMobil" name="tipeMobil" required placeholder="Mis: W212 E300" />
          </div>
          <div>
            <label htmlFor="tahunMobil" className="block text-body-sm text-muted mb-1">Tahun Mobil</label>
            <TextInput id="tahunMobil" name="tahunMobil" type="number" required placeholder="Mis: 2015" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-body-sm font-medium text-ink mb-1">Password</label>
            <div className="relative">
              <TextInput 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                minLength={8}
                placeholder="Minimal 8 karakter" 
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="password_confirmation" className="block text-body-sm font-medium text-ink mb-1">Konfirmasi Password</label>
            <div className="relative">
              <TextInput 
                id="password_confirmation" 
                name="password_confirmation" 
                type={showPassword ? "text" : "password"} 
                required 
                minLength={8}
                placeholder="Ulangi password" 
              />
            </div>
          </div>
        </div>
      </div>

      <ButtonPrimary type="submit" disabled={loading} className="w-full justify-center">
        {loading ? "Memproses..." : "Daftar Jadi Member"}
      </ButtonPrimary>
      
      <p className="text-center text-caption text-muted mt-4">
        Sudah punya akun? <Link href="/login" className="text-accent hover:underline">Login di sini</Link>
      </p>
    </form>
  );
}
