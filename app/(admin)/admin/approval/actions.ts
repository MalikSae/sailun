"use server";

import { db } from "@/lib/db";
import { approveSponsorship, rejectSponsorship } from "@/lib/sponsorship";
import { sponsorshipapplication_tierFinal } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function handleApprove(applicationId: string, tierFinal: string, catatan?: string) {
  try {
    const tier = tierFinal as sponsorshipapplication_tierFinal;
    if (!Object.values(sponsorshipapplication_tierFinal).includes(tier)) {
      return { success: false, error: `Tier tidak valid: ${tierFinal}. Pilih antara MICRO, SMALL, MEDIUM, atau BIG.` };
    }
    await approveSponsorship(applicationId, tier, catatan);
    revalidatePath("/admin/approval");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function handleReject(applicationId: string, alasan: string) {
  try {
    await rejectSponsorship(applicationId, alasan);
    revalidatePath("/admin/approval");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
