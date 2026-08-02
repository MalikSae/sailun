"use server";

import { requestRedemption } from "@/lib/points";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function submitRedemption(
  targetType: "MEMBER" | "CLUB",
  targetId: string,
  catalogItemId: string
) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Tidak memiliki akses" };
    }

    // Basic authorization check
    if (targetType === "MEMBER" && session.user.role !== "MEMBER") {
      return { success: false, error: "Hanya member yang bisa menukar poin member" };
    }
    if (targetType === "CLUB" && session.user.role !== "CLUB") {
      return { success: false, error: "Hanya klub yang bisa menukar poin klub" };
    }

    await requestRedemption(targetType, targetId, catalogItemId);
    
    revalidatePath("/admin/member/redeem");
    revalidatePath("/club/redeem");
    revalidatePath("/admin/member/dashboard");
    revalidatePath("/club/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengajukan penukaran" };
  }
}
