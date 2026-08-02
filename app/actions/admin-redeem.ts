"use server";

import { approveRedemption, rejectRedemption } from "@/lib/points";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function processRedemption(
  redemptionId: string,
  action: "APPROVE" | "REJECT",
  alasan?: string
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Tidak memiliki akses" };
    }

    if (action === "APPROVE") {
      await approveRedemption(redemptionId);
    } else {
      if (!alasan) {
        return { success: false, error: "Alasan penolakan wajib diisi" };
      }
      await rejectRedemption(redemptionId, alasan);
    }
    
    revalidatePath("/admin/redeem");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal memproses penukaran poin" };
  }
}
