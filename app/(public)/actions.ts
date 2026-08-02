"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function registerMember(formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const usia = parseInt(formData.get("usia") as string, 10);
    const telepon = formData.get("telepon") as string;
    const email = formData.get("email") as string;
    const tipeMobil = formData.get("tipeMobil") as string;
    const tahunMobil = parseInt(formData.get("tahunMobil") as string, 10);
    const gender = formData.get("gender") as "LAKI_LAKI" | "PEREMPUAN";
    const clubId = formData.get("clubId") as string;
    const eventAsalId = formData.get("eventAsalId") as string | null;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("password_confirmation") as string;
    const refCode = formData.get("ref") as string | null;

    if (!nama || !usia || !telepon || !email || !tipeMobil || !tahunMobil || !gender || !clubId || !password || !passwordConfirm) {
      return { success: false, error: "Semua field wajib diisi." };
    }

    if (password !== passwordConfirm) {
      return { success: false, error: "Password dan konfirmasi password tidak cocok." };
    }
    if (password.length < 8) {
      return { success: false, error: "Password minimal 8 karakter." };
    }

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Format email tidak valid." };
    }
    const phoneRegex = /^(08|\+628|628)[0-9]{7,11}$/;
    if (!phoneRegex.test(telepon)) {
      return { success: false, error: "Nomor telepon harus dimulai dengan 08, 628, atau +628 dan berisi 10-13 digit angka." };
    }
    if (tahunMobil < 1900 || tahunMobil > new Date().getFullYear() + 1) {
      return { success: false, error: "Tahun mobil tidak valid." };
    }

    // Check unique email and phone
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: telepon }
        ]
      }
    });

    if (existingUser) {
      return { success: false, error: "Email atau nomor telepon sudah terdaftar. Silakan login." };
    }

    // Generate credentials & codes
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate referral code 8 chars uppercase alphanumeric
    const generateReferral = () => crypto.randomBytes(4).toString("hex").toUpperCase();
    let referralCode = generateReferral();
    // In a real app we'd loop if collision, for MVP this is fine enough to avoid basic collision
    const existingRef = await db.member.findUnique({ where: { referralCode } });
    if (existingRef) referralCode = generateReferral();

    const qrCardId = crypto.randomUUID();

    let referredByMemberId: string | null = null;
    if (refCode) {
      const referringMember = await db.member.findUnique({
        where: { referralCode: refCode },
        select: { id: true }
      });
      if (referringMember) {
        referredByMemberId = referringMember.id;
      }
    }

    // Transaction
    const member = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone: telepon,
          passwordHash,
          role: "MEMBER",
          updatedAt: new Date(),
        }
      });

      const newMember = await tx.member.create({
        data: {
          userId: user.id,
          nama,
          usia,
          telepon,
          email,
          tipeMobil,
          tahunMobil,
          gender,
          clubId,
          eventAsalId: eventAsalId || null,
          referralCode,
          qrCardId,
          referredByMemberId,
          updatedAt: new Date(),
        }
      });

      return newMember;
    });

    return { 
      success: true
    };

  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses registrasi." };
  }
}

/** Registrasi member baru SEKALIGUS buat EventAttendance — semua atomik.
 * Dipakai di Alur B halaman /e/[slug] (belum punya akun). */
export async function registerMemberAndRSVP(formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const usia = parseInt(formData.get("usia") as string, 10);
    const telepon = formData.get("telepon") as string;
    const email = formData.get("email") as string;
    const tipeMobil = formData.get("tipeMobil") as string;
    const tahunMobil = parseInt(formData.get("tahunMobil") as string, 10);
    const gender = formData.get("gender") as "LAKI_LAKI" | "PEREMPUAN";
    const clubId = formData.get("clubId") as string;
    const eventId = formData.get("eventId") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("password_confirmation") as string;
    const refCode = formData.get("ref") as string | null;

    if (!nama || !usia || !telepon || !email || !tipeMobil || !tahunMobil || !gender || !clubId || !eventId || !password || !passwordConfirm) {
      return { success: false, error: "Semua field wajib diisi." };
    }

    if (password !== passwordConfirm) {
      return { success: false, error: "Password dan konfirmasi password tidak cocok." };
    }
    if (password.length < 8) {
      return { success: false, error: "Password minimal 8 karakter." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Format email tidak valid." };
    }
    const phoneRegex = /^(08|\+628|628)[0-9]{7,11}$/;
    if (!phoneRegex.test(telepon)) {
      return { success: false, error: "Nomor telepon harus dimulai dengan 08, 628, atau +628 dan berisi 10-13 digit angka." };
    }
    if (tahunMobil < 1900 || tahunMobil > new Date().getFullYear() + 1) {
      return { success: false, error: "Tahun mobil tidak valid." };
    }

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { phone: telepon }] }
    });
    if (existingUser) {
      return { success: false, error: "Email atau nomor telepon sudah terdaftar. Silakan login." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const generateReferral = () => crypto.randomBytes(4).toString("hex").toUpperCase();
    let referralCode = generateReferral();
    const existingRef = await db.member.findUnique({ where: { referralCode } });
    if (existingRef) referralCode = generateReferral();

    const qrCardId = crypto.randomUUID();

    let referredByMemberId: string | null = null;
    if (refCode) {
      const referringMember = await db.member.findUnique({
        where: { referralCode: refCode },
        select: { id: true }
      });
      if (referringMember) {
        referredByMemberId = referringMember.id;
      }
    }

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, phone: telepon, passwordHash, role: "MEMBER", updatedAt: new Date() }
      });
      const newMember = await tx.member.create({
        data: {
          userId: user.id, nama, usia, telepon, email, tipeMobil, tahunMobil, gender,
          clubId, eventAsalId: eventId, referralCode, qrCardId, referredByMemberId, updatedAt: new Date(),
        }
      });
      const attendance = await tx.eventattendance.create({
        data: { eventId, memberId: newMember.id }
      });
      return { member: newMember, attendance };
    });

    return {
      success: true,
      data: {
        attendanceId: result.attendance.id,
        email,
      }
    };

  } catch (error: any) {
    console.error("registerMemberAndRSVP error:", error);
    return { success: false, error: "Terjadi kesalahan saat memproses registrasi." };
  }
}

