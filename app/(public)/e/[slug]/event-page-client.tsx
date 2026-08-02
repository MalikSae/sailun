"use client";

import React, { useState } from "react";
import { confirmAttendance } from "./actions";
import { registerMemberAndRSVP } from "@/app/(public)/actions";
import { EventTicket } from "@/components/ui/event-ticket";
import { TextInput } from "@/components/ui/text-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// ─── Tipe data yang diterima dari server ─────────────────────────────────────
interface EventInfo {
  id: string;
  namaEvent: string;
  tanggalEvent: string;
  namaKlub: string;
  slug: string;
  clubId: string;
}

interface AttendanceInfo {
  id: string;
  namaMember: string;
}

// ─── View: Tiket Digital ─────────────────────────────────────────────────────
function TicketView({
  attendanceId,
  namaEvent,
  tanggalEvent,
  namaMember,
  namaKlub,
}: {
  attendanceId: string;
  namaEvent: string;
  tanggalEvent: string;
  namaMember: string;
  namaKlub: string;
}) {
  // Client-side QR code render (karena EventTicket async server component tidak bisa dipakai di client)
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  React.useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(attendanceId, { width: 192, margin: 1 }).then(setQrUrl);
    });
  }, [attendanceId]);

  const tanggalFormatted = new Date(tanggalEvent).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-graphite to-graphite-soft rounded-lg px-6 py-6 flex flex-col items-center gap-5 max-w-sm mx-auto shadow-xl">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10.5px] font-medium tracking-[0.8px] text-accent uppercase">
          Tiket Kehadiran
        </span>
      </div>
      <div className="text-center">
        <h2 className="text-title-lg font-display text-graphite-text-strong leading-snug">{namaEvent}</h2>
        <p className="font-mono text-[10.5px] font-medium tracking-[0.8px] text-graphite-text uppercase mt-1">{namaKlub}</p>
      </div>
      <p className="font-body text-[12.5px] text-graphite-text">{tanggalFormatted}</p>
      <div className="w-full border-t border-dashed border-graphite-text/30" />
      <div className="bg-card p-3 rounded-md shadow-inner w-48 h-48 flex items-center justify-center">
        {qrUrl ? (
          <img src={qrUrl} alt="QR Tiket" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-graphite animate-spin rounded-full border-t-transparent" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-body text-[12.5px] font-medium text-graphite-text-strong">{namaMember}</p>
        <p className="font-mono text-[10px] tracking-[0.5px] text-graphite-text mt-0.5">{attendanceId}</p>
      </div>
    </div>
  );
}

// ─── View: Tombol Konfirmasi Kehadiran (Alur A) ───────────────────────────────
export function ConfirmAttendanceView({
  event,
  memberName,
}: {
  event: EventInfo;
  memberName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await confirmAttendance(event.id);
    if (result.success && result.attendanceId) {
      setAttendanceId(result.attendanceId);
    } else {
      setError(result.error || "Gagal mengonfirmasi kehadiran.");
    }
    setLoading(false);
  }

  if (attendanceId) {
    return (
      <TicketView
        attendanceId={attendanceId}
        namaEvent={event.namaEvent}
        tanggalEvent={event.tanggalEvent}
        namaMember={memberName}
        namaKlub={event.namaKlub}
      />
    );
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-body-md text-body">
        Halo, <span className="font-semibold text-ink">{memberName}</span>! Konfirmasi kehadiran Anda di event ini.
      </p>
      {error && (
        <div className="bg-danger-soft border border-danger text-danger px-4 py-3 rounded-md text-body-sm">
          {error}
        </div>
      )}
      <ButtonPrimary onClick={handleConfirm} disabled={loading} className="w-full justify-center">
        {loading ? "Memproses..." : "Konfirmasi Kehadiran"}
      </ButtonPrimary>
    </div>
  );
}

// ─── View: Tiket yang Sudah Ada (Alur A, idempotent) ─────────────────────────
export function ExistingTicketView({
  attendance,
  event,
}: {
  attendance: AttendanceInfo;
  event: EventInfo;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-success-soft border border-success/20 text-success px-4 py-3 rounded-md text-body-sm text-center">
        Anda sudah terdaftar di event ini. Ini tiket kehadiran Anda.
      </div>
      <TicketView
        attendanceId={attendance.id}
        namaEvent={event.namaEvent}
        tanggalEvent={event.tanggalEvent}
        namaMember={attendance.namaMember}
        namaKlub={event.namaKlub}
      />
    </div>
  );
}

// ─── View: Pilihan Login / Daftar (belum login) ───────────────────────────────
export function LoginOrRegisterView({
  event,
}: {
  event: EventInfo;
}) {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <RegisterFormView event={event} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-body-md text-body text-center">Untuk mengonfirmasi kehadiran, silakan login atau daftar terlebih dahulu.</p>
      <div className="flex flex-col gap-3">
        <Link href={`/login?callbackUrl=/e/${event.slug}`}>
          <ButtonPrimary className="w-full justify-center">Sudah Punya Akun? Login</ButtonPrimary>
        </Link>
        <ButtonSecondary
          onClick={() => setShowForm(true)}
          className="w-full justify-center"
        >
          Belum Punya Akun? Daftar di Sini
        </ButtonSecondary>
      </div>
    </div>
  );
}

// ─── View: Form Registrasi Member Baru (Alur B) ──────────────────────────────
function RegisterFormView({ event }: { event: EventInfo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attendanceId: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("LAKI_LAKI");

  const genderOptions = [
    { label: "Laki-laki", value: "LAKI_LAKI" },
    { label: "Perempuan", value: "PEREMPUAN" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("gender", gender);
    formData.append("clubId", event.clubId);
    formData.append("eventId", event.id);

    const res = await registerMemberAndRSVP(formData);
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Gagal melakukan registrasi.");
    }
    setLoading(false);
  }

  // Setelah sukses: tampilkan tiket + kredensial
  if (result) {
    return (
      <div className="space-y-6">
        <TicketView
          attendanceId={result.attendanceId}
          namaEvent={event.namaEvent}
          tanggalEvent={event.tanggalEvent}
          namaMember="(nama Anda)"
          namaKlub={event.namaKlub}
        />
        <Link href="/login">
          <ButtonPrimary className="w-full justify-center">Login ke Dashboard</ButtonPrimary>
        </Link>
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
        {loading ? "Memproses..." : "Daftar & Dapatkan Tiket"}
      </ButtonPrimary>
    </form>
  );
}
