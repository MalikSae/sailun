"use server";

import { db } from "@/lib/db";

export async function lookupMemberByQR(input: string) {
  try {
    const member = await db.member.findFirst({
      where: {
        OR: [
          { id: input },
          { qrCardId: input }
        ]
      },
      include: { club: true }
    });

    if (!member) {
      return { success: false, error: "Member tidak ditemukan" };
    }

    return { 
      success: true, 
      member: {
        id: member.id,
        nama: member.nama,
        clubName: member.club.namaKomunitas,
        qrCardId: member.qrCardId
      }
    };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan" };
  }
}
