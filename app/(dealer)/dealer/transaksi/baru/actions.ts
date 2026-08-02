"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { confirmTransaction } from "@/lib/points";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitTransaction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "DEALER") {
    return { error: "Akses ditolak" };
  }

  const staff = await db.dealerstaff.findUnique({
    where: { userId: session.user.id }
  });

  if (!staff) {
    return { error: "Dealer staff tidak valid" };
  }

  const memberId = formData.get("memberId") as string;
  const produk = formData.get("produk") as string;
  const nominalStr = formData.get("nominal") as string;
  const transactionId = formData.get("transactionId") as string;

  if (!memberId || !produk || !nominalStr || !transactionId) {
    return { error: "Semua field wajib diisi" };
  }

  const nominal = parseInt(nominalStr.replace(/\D/g, ""), 10);
  
  if (isNaN(nominal) || nominal <= 0) {
    return { error: "Nominal tidak valid" };
  }

  try {
    await confirmTransaction({
      transactionId,
      memberId,
      dealerId: staff.dealerId,
      produk,
      nominal
    });

    revalidatePath("/(dealer)/transaksi");
  } catch (error: any) {
    return { error: error.message || "Gagal memproses transaksi" };
  }
  
  redirect("/dealer/transaksi");
}
