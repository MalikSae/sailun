"use server";

import { voidTransaction } from "@/lib/points";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function submitVoidTransaction(
  transactionId: string,
  catatan: string
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Tidak memiliki akses" };
    }

    if (!catatan) {
      return { success: false, error: "Catatan void wajib diisi" };
    }

    await voidTransaction(transactionId, catatan);
    
    revalidatePath("/admin/transaksi");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memproses void transaksi" };
  }
}
