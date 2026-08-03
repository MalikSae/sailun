"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { uploadLogo } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "CLUB") {
      return { error: "Unauthorized" };
    }

    const club = await db.club.findFirst({
      where: { userId: session.user.id },
    });

    if (!club) {
      return { error: "Club not found" };
    }

    const namaKomunitas = formData.get("namaKomunitas") as string;
    const namaKetua = formData.get("namaKetua") as string;
    const tahunMobilMulai = parseInt(formData.get("tahunMobilMulai") as string, 10);
    const tahunMobilAkhir = parseInt(formData.get("tahunMobilAkhir") as string, 10);
    const jumlahAnggota = parseInt(formData.get("jumlahAnggota") as string, 10);
    const noWhatsappKetua = formData.get("noWhatsappKetua") as string;
    const kota = formData.get("kota") as string;
    const alamatSekretariat = formData.get("alamatSekretariat") as string;

    if (!namaKomunitas || !namaKetua || isNaN(tahunMobilMulai) || isNaN(tahunMobilAkhir) || isNaN(jumlahAnggota)) {
      return { error: "Mohon lengkapi semua field yang wajib diisi." };
    }

    let logoUrl = club.logoUrl;
    const logoFile = formData.get("logo") as File;

    if (logoFile && logoFile.size > 0) {
      try {
        logoUrl = await uploadLogo(logoFile);
      } catch (err: any) {
        return { error: `Gagal mengunggah logo: ${err.message}` };
      }
    }

    await db.club.update({
      where: { id: club.id },
      data: {
        namaKomunitas,
        namaKetua,
        tahunMobilMulai,
        tahunMobilAkhir,
        jumlahAnggota,
        noWhatsappKetua,
        kota,
        alamatSekretariat,
        logoUrl,
      },
    });

    revalidatePath("/club/profil");
    revalidatePath("/club/dashboard");
    
    return { success: "Profil berhasil diperbarui." };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: "Terjadi kesalahan internal. Silakan coba lagi." };
  }
}
