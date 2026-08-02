"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

/** Konfirmasi kehadiran member yang sudah login ke sebuah event.
 * Idempotent — kalau sudah ada, return attendanceId yang lama.
 * Semua pengecekan (role, expired, clubId) dilakukan di dalam action
 * sebagai defence-in-depth — tidak bergantung pada Server Component. */
export async function confirmAttendance(eventId: string) {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    return { success: false, error: "Hanya member yang dapat mengonfirmasi kehadiran." };
  }

  // Deklarasikan di luar try agar bisa diakses di catch block (fix scoping bug)
  let memberId: string | null = null;

  try {
    const member = await db.member.findUnique({
      where: { userId: session.user.id },
      select: { id: true, clubId: true },
    });
    if (!member) {
      return { success: false, error: "Data member tidak ditemukan." };
    }
    memberId = member.id;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { sponsorshipapplication: true },
    });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    const isExpired = new Date(event.sponsorshipapplication.tanggalAcara) < new Date();
    if (isExpired) {
      return { success: false, error: "Pendaftaran untuk event ini telah ditutup." };
    }

    if (event.sponsorshipapplication.clubId !== member.clubId) {
      return { success: false, error: "Anda tidak terdaftar di klub penyelenggara event ini." };
    }

    // Coba create langsung — kalau P2002 (race condition / sudah ada) tangkap di catch
    const attendance = await db.eventattendance.create({
      data: { eventId, memberId: member.id },
    });

    return { success: true, attendanceId: attendance.id };
  } catch (error: any) {
    if (error.code === "P2002" && memberId) {
      // P2002 = Unique constraint failed: record sudah ada (race condition)
      const existing = await db.eventattendance.findUnique({
        where: { eventId_memberId: { eventId, memberId } },
      });
      if (existing) {
        return { success: true, attendanceId: existing.id };
      }
    }
    console.error("confirmAttendance error:", error);
    return { success: false, error: "Gagal mengonfirmasi kehadiran." };
  }
}
