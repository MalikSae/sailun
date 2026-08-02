"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function createDealer(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const namaDealer = formData.get("namaDealer") as string;
  const alamat = formData.get("alamat") as string;
  
  if (!namaDealer || !alamat) throw new Error("Semua field wajib diisi");

  await db.dealer.create({
    data: {
      namaDealer,
      alamat,
      status: "active"
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function createDealerStaff(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email") as string;
  const nama = formData.get("nama") as string;
  const dealerId = formData.get("dealerId") as string;

  if (!email || !nama || !dealerId) throw new Error("Semua field wajib diisi");

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email sudah terdaftar");

  const rawPassword = Math.random().toString(36).slice(-8);
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role: "DEALER",
        updatedAt: new Date()
      }
    });

    await tx.dealerstaff.create({
      data: {
        userId: user.id,
        dealerId,
      }
    });
  });

  revalidatePath("/");
  return { success: true, password: rawPassword };
}
