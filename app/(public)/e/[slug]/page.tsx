import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Shield, CalendarX } from "lucide-react";
import {
  ConfirmAttendanceView,
  ExistingTicketView,
  LoginOrRegisterView,
} from "./event-page-client";

export default async function EventInvitationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const event = await db.event.findUnique({
    where: { slug: params.slug },
    include: {
      sponsorshipapplication: {
        include: { club: true },
      },
    },
  });

  if (!event || event.status !== "active") {
    notFound();
  }

  const app = event.sponsorshipapplication;
  const club = app.club;

  // ─── Langkah 1 — Cek tanggal event ──────────────────────────────────────────
  const isExpired = new Date(app.tanggalAcara) < new Date();

  // ─── Langkah 2–3 — Cek session ──────────────────────────────────────────────
  const session = await auth();

  // Data event yang dioper ke client components
  const eventInfo = {
    id: event.id,
    namaEvent: app.namaAcara,
    tanggalEvent: app.tanggalAcara.toISOString(),
    namaKlub: club.namaKomunitas,
    slug: event.slug,
    clubId: club.id,
  };

  // ─── Tentukan konten area interaksi ─────────────────────────────────────────
  let interactionContent: React.ReactNode;

  if (isExpired) {
    // Langkah 1: event sudah lewat
    interactionContent = (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-warning-soft flex items-center justify-center">
          <CalendarX className="w-8 h-8 text-warning" />
        </div>
        <div className="text-center">
          <p className="text-title-lg font-display text-ink mb-2">Pendaftaran Sudah Ditutup</p>
          <p className="text-body-md text-muted">
            Event ini telah berlangsung pada{" "}
            {app.tanggalAcara.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            . Pendaftaran tidak lagi tersedia.
          </p>
        </div>
      </div>
    );
  } else if (!session) {
    // Langkah 2: belum login
    interactionContent = <LoginOrRegisterView event={eventInfo} />;
  } else if (session.user.role !== "MEMBER") {
    // Langkah 3a: role bukan MEMBER
    interactionContent = (
      <div className="bg-warning-soft border border-warning/30 text-warning px-4 py-4 rounded-md text-center">
        <p className="font-semibold mb-1">Akses Terbatas</p>
        <p className="text-body-sm">Halaman ini khusus untuk member. Anda sedang login sebagai {session.user.role}.</p>
      </div>
    );
  } else {
    // Ambil data member
    const member = await db.member.findUnique({
      where: { userId: session.user.id },
      select: { id: true, nama: true, clubId: true },
    });

    if (!member) {
      interactionContent = (
        <div className="bg-danger-soft border border-danger/30 text-danger px-4 py-4 rounded-md text-center">
          <p className="text-body-sm">Data member tidak ditemukan. Silakan hubungi admin.</p>
        </div>
      );
    } else if (member.clubId !== club.id) {
      // Langkah 3b: beda klub
      interactionContent = (
        <div className="bg-warning-soft border border-warning/30 text-warning px-4 py-4 rounded-md text-center">
          <p className="font-semibold mb-1">Event Khusus Anggota {club.namaKomunitas}</p>
          <p className="text-body-sm">
            Event ini hanya dapat diikuti oleh member{" "}
            <span className="font-semibold">{club.namaKomunitas}</span>. Akun Anda terdaftar di klub berbeda.
          </p>
        </div>
      );
    } else {
      // Langkah 3c: cek idempotent
      const existingAttendance = await db.eventattendance.findUnique({
        where: { eventId_memberId: { eventId: event.id, memberId: member.id } },
      });

      if (existingAttendance) {
        // Sudah terdaftar — tampilkan tiket yang ada
        interactionContent = (
          <ExistingTicketView
            attendance={{ id: existingAttendance.id, namaMember: member.nama }}
            event={eventInfo}
          />
        );
      } else {
        // Langkah 3d: belum RSVP — tampilkan tombol konfirmasi
        interactionContent = (
          <ConfirmAttendanceView event={eventInfo} memberName={member.nama} />
        );
      }
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite to-graphite-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card border border-hairline rounded-xl overflow-hidden shadow-lg">
        {/* Banner */}
        <div className="bg-canvas h-48 relative flex items-center justify-center border-b border-hairline-strong">
          {club.logoUrl ? (
            <img
              src={club.logoUrl}
              alt={club.namaKomunitas}
              className="h-32 w-32 object-cover rounded-md relative z-10"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-canvas border border-hairline-strong flex items-center justify-center relative z-10">
              <Shield className="w-16 h-16 text-muted" />
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-display-lg font-display text-ink mb-2">{app.namaAcara}</h1>
            <p className="text-body-md text-accent font-bold mb-6">
              Diselenggarakan oleh {club.namaKomunitas}
            </p>
            <div className="inline-block bg-canvas shadow-sm border border-hairline px-6 py-4 rounded-lg">
              <p className="text-label-uppercase text-muted mb-1">Tanggal Pelaksanaan</p>
              <p className="text-body-lg text-ink font-semibold">
                {app.tanggalAcara.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">{interactionContent}</div>
        </div>
      </div>
    </div>
  );
}
