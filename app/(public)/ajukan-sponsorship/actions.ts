"use server";

import { db } from "@/lib/db";
import { calculateTierRecommendation } from "@/lib/sponsorship";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { uploadLogo, uploadProposal } from "@/lib/upload";

export async function submitSponsorship(formData: FormData) {
  try {
    const isNewClub = formData.get("isNewClub") === "true";
    let clubId = formData.get("clubId") as string;
    
    // 1. Validasi dan Pembuatan Klub Baru (Jika belum login)
    if (isNewClub) {
      const namaKomunitas = formData.get("namaKomunitas") as string;
      const ketua = formData.get("ketua") as string;
      const email = formData.get("email") as string;
      const jumlahAnggota = parseInt(formData.get("jumlahAnggota") as string);
      const tahunStart = parseInt(formData.get("tahunStart") as string);
      const tahunEnd = parseInt(formData.get("tahunEnd") as string);
      const alamatSekretariat = formData.get("alamatSekretariat") as string;
      const kota = formData.get("kota") as string;
      const noWhatsappKetua = formData.get("noWhatsappKetua") as string;
      const logoFile = formData.get("logo") as File;

      // Cek duplikasi email (email digunakan untuk user akun)
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return { success: false, error: "Email sudah terdaftar." };
      }

      // Cek duplikasi nama komunitas
      const existingClub = await db.club.findFirst({ where: { namaKomunitas } });
      if (existingClub) {
        return { success: false, error: "Nama Komunitas sudah terdaftar." };
      }

      let logoUrl = null;
      if (logoFile && logoFile.size > 0) {
        logoUrl = await uploadLogo(logoFile);
      }

      // Password dari form
      const plainPassword = formData.get("password") as string;
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      const newUser = await db.user.create({
        data: {
          email,
          passwordHash,
          role: "CLUB",
          updatedAt: new Date(),
        }
      });

      // Generate slug from namaKomunitas
      const slug = namaKomunitas.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSlug = slug + '-' + Math.random().toString(36).substring(2, 6);

      // Buat entitas Klub
      const newClub = await db.club.create({
        data: {
          userId: newUser.id,
          namaKomunitas,
          slug: uniqueSlug,
          jumlahAnggota,
          tahunMobilMulai: tahunStart,
          tahunMobilAkhir: tahunEnd,
          namaKetua: ketua,
          alamatSekretariat,
          kota,
          noWhatsappKetua,
          logoUrl,
          status: "unverified",
          updatedAt: new Date(),
        }
      });

      clubId = newClub.id;
    }

    if (!isNewClub) {
      const userId = formData.get("clubId") as string;
      const existingClub = await db.club.findFirst({ where: { userId } });
      if (existingClub) {
        clubId = existingClub.id;
      }
    }

    if (!clubId) {
      return { success: false, error: "Club ID tidak valid." };
    }

    // 2. Buat Pengajuan Sponsorship
    const namaAcara = formData.get("namaAcara") as string;
    const tanggalAcaraStr = formData.get("tanggalAcara") as string;
    const danaDiajukan = parseFloat(formData.get("danaDiajukan") as string);
    const proposalFile = formData.get("proposal") as File;

    let proposalUrl = null;
    if (proposalFile && proposalFile.size > 0) {
      proposalUrl = await uploadProposal(proposalFile);
    }

    const club = await db.club.findUnique({ where: { id: clubId } });
    if (!club) return { success: false, error: "Klub tidak ditemukan." };

    const tierRekomendasi = calculateTierRecommendation(club.jumlahAnggota);

    // Generate nomorPengajuan (8 character uppercase alphanumeric)
    const generateNomorPengajuan = () => crypto.randomBytes(4).toString("hex").toUpperCase();
    let nomorPengajuan = generateNomorPengajuan();
    let existingPengajuan = await db.sponsorshipapplication.findUnique({ where: { nomorPengajuan } });
    while (existingPengajuan) {
      nomorPengajuan = generateNomorPengajuan();
      existingPengajuan = await db.sponsorshipapplication.findUnique({ where: { nomorPengajuan } });
    }

    const application = await db.sponsorshipapplication.create({
      data: {
        nomorPengajuan,
        clubId: club.id,
        namaAcara,
        tanggalAcara: new Date(tanggalAcaraStr),
        danaDiajukan,
        proposalUrl,
        tierRekomendasi,
        status: "PENDING",
        updatedAt: new Date(),
      }
    });

    return { 
      success: true, 
      applicationId: application.id,
      nomorPengajuan: application.nomorPengajuan,
      message: isNewClub 
        ? "Registrasi Klub dan Pengajuan berhasil." 
        : "Pengajuan berhasil dikirim."
    };

  } catch (error: any) {
    console.error("Submit Sponsorship Error:", error);
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}
