"use client";

import React, { useState, useEffect } from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { FileUploadDropzone } from "@/components/ui/file-upload-dropzone";
import { submitSponsorship } from "./actions";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/ui/step-indicator";
import { FileText, Check, Eye, EyeOff, Users, Calendar, AlertCircle } from "lucide-react";
import { CityCombobox } from "@/components/ui/city-combobox";

export function AjukanClient({ isClub, clubId }: { isClub: boolean, clubId?: string }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    namaKomunitas: "",
    ketua: "",
    jumlahAnggota: "",
    tahunStart: "",
    tahunEnd: "",
    alamatSekretariat: "",
    kota: "",
    noWhatsappKetua: "",
    email: "",
    password: "",
    confirmPassword: "",
    namaAcara: "",
    tanggalAcara: "",
    danaDiajukan: "",
    danaInput: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [proposalFile, setProposalFile] = useState<File | null>(null);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const [currentStep, setCurrentStep] = useState(0);
  const [applicationId, setApplicationId] = useState("");
  const [nomorPengajuan, setNomorPengajuan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [stepError, setStepError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const stepsNewClub = [
    "Klub",
    "Akun",
    "Acara",
    "Review"
  ];

  const stepsExistingClub = [
    "Acara",
    "Review"
  ];

  const currentSteps = isClub ? stepsExistingClub : stepsNewClub;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9+]/g, "");
    setFormData({ ...formData, [e.target.name]: raw });
  };

  const handleDanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw) {
      setFormData({ 
        ...formData, 
        danaDiajukan: raw,
        danaInput: parseInt(raw, 10).toLocaleString("id-ID")
      });
    } else {
      setFormData({ ...formData, danaDiajukan: "", danaInput: "" });
    }
  };

  const handleNext = async () => {
    setStepError("");
    
    if (!isClub) {
      if (currentStep === 0) {
        if (!formData.namaKomunitas || !formData.ketua || !formData.jumlahAnggota || !formData.tahunStart || !formData.tahunEnd || !formData.alamatSekretariat || !formData.kota || !formData.noWhatsappKetua) {
          setStepError("Semua field teks wajib diisi.");
          return;
        }
        
        const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;
        if (!phoneRegex.test(formData.noWhatsappKetua)) {
          setStepError("Format nomor WhatsApp tidak valid. Gunakan format 08xx, +628xx, atau 628xx.");
          return;
        }
        if (!logoFile) {
          setStepError("Logo klub wajib diupload.");
          return;
        }
      } else if (currentStep === 1) {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setStepError("Semua field wajib diisi.");
          return;
        }
        if (formData.password.length < 8) {
          setStepError("Password minimal 8 karakter.");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setStepError("Password dan konfirmasi tidak cocok.");
          return;
        }
        
        setIsSubmitting(true);
        try {
          const res = await fetch(`/api/check-email?email=${encodeURIComponent(formData.email)}`);
          const data = await res.json();
          if (!data.available) {
            setStepError("Email sudah terdaftar. Silakan login atau gunakan email lain.");
            setIsSubmitting(false);
            return;
          }
        } catch (e) {
          setStepError("Gagal memeriksa ketersediaan email.");
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
      } else if (currentStep === 2) {
        if (!formData.namaAcara || !formData.tanggalAcara || !formData.danaDiajukan) {
          setStepError("Mohon lengkapi semua field Informasi Acara.");
          return;
        }
      }
    } else {
      if (currentStep === 0) {
        if (!formData.namaAcara || !formData.tanggalAcara || !formData.danaDiajukan) {
          setStepError("Mohon lengkapi semua field Informasi Acara.");
          return;
        }
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStepError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const fd = new FormData();
    
    if (isClub && clubId) {
      fd.append("isNewClub", "false");
      fd.append("clubId", clubId); 
    } else {
      fd.append("isNewClub", "true");
      if (logoFile) fd.append("logo", logoFile);
      fd.append("namaKomunitas", formData.namaKomunitas);
      fd.append("ketua", formData.ketua);
      fd.append("jumlahAnggota", formData.jumlahAnggota);
      fd.append("tahunStart", formData.tahunStart);
      fd.append("tahunEnd", formData.tahunEnd);
      fd.append("alamatSekretariat", formData.alamatSekretariat);
      fd.append("kota", formData.kota);
      fd.append("noWhatsappKetua", formData.noWhatsappKetua);
      fd.append("email", formData.email);
      fd.append("password", formData.password);
    }

    fd.append("namaAcara", formData.namaAcara);
    fd.append("tanggalAcara", formData.tanggalAcara);
    fd.append("danaDiajukan", formData.danaDiajukan);
    
    if (proposalFile) {
      fd.append("proposal", proposalFile);
    }

    const res = await submitSponsorship(fd);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Gagal mengirim pengajuan.");
    } else {
      setIsSuccess(true);
      if (res.applicationId) setApplicationId(res.applicationId);
      if (res.nomorPengajuan) setNomorPengajuan(res.nomorPengajuan);
    }
  };

  const renderProposalUpload = () => (
    <div className="mb-6">
      <FileUploadDropzone 
        label="Upload Proposal (Opsional)"
        description="Format yang didukung: PDF, DOC, DOCX. Maksimal 10MB."
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        isImage={false}
        maxSizeMb={10}
        onFileSelect={(file) => setProposalFile(file)}
      />
    </div>
  );

  const DataRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3 border-b border-hairline/60 last:border-0">
      <div className="text-muted text-body-sm">{label}</div>
      <div className="text-ink font-medium text-body-sm sm:col-span-2 break-words">{value || "-"}</div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-success" />
      </div>
      <h3 className="text-display-sm font-display text-ink mb-2">Pengajuan Sponsorship Berhasil Dikirim</h3>
      {nomorPengajuan && (
        <p className="text-body-md text-ink font-medium mb-4">
          Nomor Pengajuan: <span className="bg-canvas px-2 py-1 rounded text-accent font-mono">{nomorPengajuan}</span>
        </p>
      )}
      <p className="text-body-md text-muted mb-8 max-w-md mx-auto">
        {!isClub 
          ? "Akun klub kamu sudah dibuat. Silakan login menggunakan email dan password yang didaftarkan untuk memantau status pengajuan."
          : "Pengajuan Anda telah kami terima dan akan segera diproses. Pantau status pengajuan di dashboard Anda."}
      </p>
      <div className="flex justify-center">
        {!isClub ? (
          <ButtonPrimary onClick={() => router.push("/login")}>
            Login ke Dashboard
          </ButtonPrimary>
        ) : (
          <ButtonPrimary onClick={() => router.push("/club/dashboard")}>
            Ke Dashboard Klub
          </ButtonPrimary>
        )}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="mb-6">
      <div className="mb-8 text-center sm:text-left">
        <h3 className="text-display-sm font-display text-ink mb-2">Review Pengajuan</h3>
        <p className="text-body-sm text-muted">Pastikan data di bawah ini sudah benar sebelum dikirim.</p>
      </div>
      
      {!isClub && (
        <div className="mb-6">
          <h3 className="text-body-lg font-semibold text-ink flex items-center gap-2 border-b border-hairline pb-3 mb-2">
            <Users className="w-5 h-5 text-accent" />
            Informasi Klub
          </h3>
          <div>
            <DataRow label="Nama Klub" value={formData.namaKomunitas} />
            <DataRow label="Nama Ketua" value={formData.ketua} />
            <DataRow label="No. WhatsApp" value={formData.noWhatsappKetua} />
            <DataRow label="Alamat Sekretariat" value={formData.alamatSekretariat} />
            <DataRow label="Kota" value={formData.kota} />
            <DataRow label="Jumlah Anggota" value={`${formData.jumlahAnggota} orang`} />
            <DataRow label="Email Login" value={formData.email} />
            <DataRow label="Logo Klub" value={logoFile ? (
              <div>
                {logoPreviewUrl ? (
                  <img src={logoPreviewUrl} alt="Logo Preview" className="h-16 w-16 object-cover rounded-md border border-hairline shadow-sm" />
                ) : (
                  <span className="text-success font-medium">Telah diunggah</span>
                )}
              </div>
            ) : <span className="text-muted">Belum ada logo</span>} />
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-body-lg font-semibold text-ink flex items-center gap-2 border-b border-hairline pb-3 mb-2">
          <Calendar className="w-5 h-5 text-accent" />
          Informasi Acara
        </h3>
        <div>
          <DataRow label="Nama Acara" value={formData.namaAcara} />
          <DataRow label="Tanggal Acara" value={formData.tanggalAcara ? new Date(formData.tanggalAcara).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} />
          <DataRow label="Dana yang Diajukan" value={`Rp ${parseInt(formData.danaDiajukan || "0").toLocaleString('id-ID')}`} />
          <DataRow label="Dokumen Proposal" value={proposalFile ? (
            <span className="text-success font-medium">{proposalFile.name}</span>
          ) : <span className="text-muted">Tidak ada dokumen</span>} />
        </div>
      </div>

      <div className="bg-warning-soft border border-warning/20 p-5 rounded-xl flex gap-4 items-start">
        <div className="mt-0.5 text-warning shrink-0 bg-card rounded-full p-1.5 shadow-sm">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
           <h4 className="font-semibold text-warning mb-1">Perhatian</h4>
           <p className="text-warning font-medium text-body-sm leading-relaxed">
             Setelah dikirim, data ini tidak dapat diubah lagi dan akan langsung masuk ke antrean review oleh tim Sailun.
           </p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (!isClub) {
      switch (currentStep) {
        case 0:
          return (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-body-lg font-semibold text-ink">Informasi Klub</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Nama Klub</label>
                  <input name="namaKomunitas" value={formData.namaKomunitas} onChange={handleChange} type="text" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Jumlah Anggota</label>
                  <input name="jumlahAnggota" value={formData.jumlahAnggota} onChange={handleChange} type="number" min="1" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Tahun Mobil (Mulai)</label>
                  <input name="tahunStart" value={formData.tahunStart} onChange={handleChange} type="number" min="1900" max="2100" placeholder="Contoh: 1990" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Tahun Mobil (Akhir)</label>
                  <input name="tahunEnd" value={formData.tahunEnd} onChange={handleChange} type="number" min="1900" max="2100" placeholder="Contoh: 2024" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div className="sm:col-span-2 mt-2">
                  <FileUploadDropzone onFileSelect={(file) => setLogoFile(file)} />
                  {logoFile && <p className="mt-2 text-success text-sm flex items-center gap-1"><Check className="w-4 h-4"/> {logoFile.name}</p>}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-hairline mb-4">
                 <h3 className="text-body-lg font-semibold text-ink">Kontak & Lokasi</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Nama Ketua</label>
                  <input name="ketua" value={formData.ketua} onChange={handleChange} type="text" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">No WhatsApp Ketua</label>
                  <input name="noWhatsappKetua" value={formData.noWhatsappKetua} onChange={handlePhoneChange} type="tel" placeholder="Contoh: 08123456789" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Kota</label>
                  <CityCombobox 
                    value={formData.kota} 
                    onChange={(val) => setFormData({ ...formData, kota: val })} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Alamat Sekretariat</label>
                  <textarea name="alamatSekretariat" value={formData.alamatSekretariat} onChange={handleChange} rows={3} className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none"></textarea>
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-body-lg font-semibold text-ink">Buat Akun Klub</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Email Klub (Digunakan untuk login)</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Password</label>
                  <div className="relative">
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 pr-12 text-ink focus:border-accent outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted hover:text-ink">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Ulangi password" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 pr-12 text-ink focus:border-accent outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted hover:text-ink">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-body-lg font-semibold text-ink">Informasi Acara</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Nama Acara</label>
                  <input name="namaAcara" value={formData.namaAcara} onChange={handleChange} type="text" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Tanggal Acara</label>
                  <input name="tanggalAcara" value={formData.tanggalAcara} onChange={handleChange} type="date" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Dana yang Diajukan (Rp)</label>
                  <input type="text" value={formData.danaInput} onChange={handleDanaChange} className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
              </div>
              {renderProposalUpload()}
            </div>
          );
        case 3:
          return isSuccess ? renderSuccess() : renderReview();
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 0:
          return (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-body-lg font-semibold text-ink">Informasi Acara</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Nama Acara</label>
                  <input name="namaAcara" value={formData.namaAcara} onChange={handleChange} type="text" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Tanggal Acara</label>
                  <input name="tanggalAcara" value={formData.tanggalAcara} onChange={handleChange} type="date" className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-label-uppercase text-ink font-medium mb-2">Dana yang Diajukan (Rp)</label>
                  <input type="text" value={formData.danaInput} onChange={handleDanaChange} className="w-full bg-canvas border border-hairline rounded-md px-4 py-2 text-ink focus:border-accent outline-none" />
                </div>
              </div>
              {renderProposalUpload()}
            </div>
          );
        case 1:
          return isSuccess ? renderSuccess() : renderReview();
        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite to-graphite-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-display-lg font-display text-graphite-text-strong text-center mb-2">
          {isClub ? "Ajukan Sponsorship Acara" : "Daftarkan Klub & Ajukan Sponsorship"}
        </h1>
        <p className="text-body-md text-graphite-text font-body text-center mb-10">
          {isClub 
            ? "Lengkapi detail acara dan unggah proposal Anda." 
            : "Platform khusus untuk komunitas Mercedes-Benz. Daftar sekarang dan ajukan proposal kegiatan Anda."}
        </p>

        <StepIndicator steps={currentSteps} currentStep={currentStep} />

        {errorMsg && (
          <div className="bg-danger-soft border border-danger/20 p-4 rounded-md mb-6">
            <p className="text-danger font-semibold">{errorMsg}</p>
          </div>
        )}

        {stepError && (
          <div className="bg-warning-soft border border-warning/20 p-4 rounded-md mb-6">
            <p className="text-warning font-semibold">{stepError}</p>
          </div>
        )}

        <div className="bg-card rounded-xl p-8 border border-hairline shadow-sm">
          {renderStepContent()}

          {!isSuccess && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-hairline">
              <button 
                type="button" 
                onClick={handlePrev}
                disabled={currentStep === 0 || isSubmitting}
                className="px-6 py-2 border border-hairline rounded-md text-ink font-medium hover:bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Kembali
              </button>
              
              {currentStep === currentSteps.length - 1 ? (
                <ButtonPrimary type="button" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                </ButtonPrimary>
              ) : (
                <ButtonPrimary type="button" onClick={handleNext} disabled={isSubmitting}>
                  {isSubmitting ? "Memproses..." : "Lanjut"}
                </ButtonPrimary>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
