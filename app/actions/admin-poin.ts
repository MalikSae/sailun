"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function updatePointSettings(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const keys = ["diskon_member_nominal", "poin_referral", "poin_klub", "masa_berlaku_poin_bulan"];

  for (const key of keys) {
    const val = formData.get(key) as string;
    if (val) {
      await db.pointsetting.upsert({
        where: { key },
        update: { value: val },
        create: { key, value: val }
      });
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function createCatalogItem(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const hargaPoin = parseInt(formData.get("hargaPoin") as string, 10);
  const aktif = formData.get("aktif") === "on";

  await db.redemptioncatalog.create({
    data: {
      nama,
      deskripsi,
      hargaPoin,
      aktif
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function toggleCatalogItemStatus(id: string, currentStatus: boolean) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.redemptioncatalog.update({
    where: { id },
    data: { aktif: !currentStatus }
  });

  revalidatePath("/");
  return { success: true };
}
