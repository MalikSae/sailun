"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleClubStatus(clubId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const club = await db.club.findUnique({ where: { id: clubId } });
  if (!club) throw new Error("Klub tidak ditemukan");

  const newStatus = club.status === "active" ? "inactive" : "active";

  await db.club.update({
    where: { id: clubId },
    data: { status: newStatus }
  });

  revalidatePath("/");
  return { success: true, newStatus };
}

export async function updateClubData(clubId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.club.update({
    where: { id: clubId },
    data: {
      namaKomunitas: formData.get("namaKomunitas") as string,
      namaKetua: formData.get("namaKetua") as string,
      jumlahAnggota: parseInt(formData.get("jumlahAnggota") as string) || 0,
      tahunMobilMulai: parseInt(formData.get("tahunMobilMulai") as string) || 0,
      tahunMobilAkhir: parseInt(formData.get("tahunMobilAkhir") as string) || 0,
    }
  });

  revalidatePath("/");
  revalidatePath(`//${clubId}`);
  return { success: true };
}
