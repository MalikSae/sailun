import { db } from "./db";
import { sponsorshipapplication_tierFinal } from "@prisma/client";
import { randomUUID } from "crypto";

// Threshold untuk menentukan tier secara otomatis.
const TIER_THRESHOLDS = {
  MICRO: 0,
  SMALL: 50,
  MEDIUM: 100,
  BIG: 200,
};

export function calculateTierRecommendation(jumlahAnggota: number): sponsorshipapplication_tierFinal {
  if (jumlahAnggota >= TIER_THRESHOLDS.BIG) return sponsorshipapplication_tierFinal.BIG;
  if (jumlahAnggota >= TIER_THRESHOLDS.MEDIUM) return sponsorshipapplication_tierFinal.MEDIUM;
  if (jumlahAnggota >= TIER_THRESHOLDS.SMALL) return sponsorshipapplication_tierFinal.SMALL;
  return sponsorshipapplication_tierFinal.MICRO;
}

export async function approveSponsorship(applicationId: string, tierFinal: sponsorshipapplication_tierFinal, catatanAdmin?: string) {
  return await db.$transaction(async (tx) => {
    // 1. Dapatkan aplikasi dan update status
    const app = await tx.sponsorshipapplication.update({
      where: { id: applicationId },
      data: {
        status: "APPROVED",
        tierFinal,
        catatanAdmin,
      },
      include: { club: true },
    });

    // 2. Jika club status unverified, update menjadi active
    if (app.club.status === "unverified") {
      await tx.club.update({
        where: { id: app.clubId },
        data: { status: "active" },
      });
    }

    // 3. Buat Event dengan slug unik
    const randomStr = Math.random().toString(36).substring(2, 6);
    const slug = `${app.namaAcara.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${randomStr}`;

    await tx.event.create({
      data: {
        sponsorshipApplicationId: app.id,
        slug,
        status: "active",
      },
    });

    return app;
  });
}

export async function rejectSponsorship(applicationId: string, alasan: string) {
  if (!alasan || alasan.trim() === "") {
    throw new Error("Alasan penolakan wajib diisi");
  }

  return await db.sponsorshipapplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      catatanAdmin: alasan,
    },
  });
}
