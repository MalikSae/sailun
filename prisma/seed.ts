import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sailun.id' },
    update: { passwordHash, updatedAt: new Date() },
    create: {
      id: crypto.randomUUID(),
      email: 'admin@sailun.id',
      passwordHash,
      role: 'ADMIN',
      updatedAt: new Date(),
    },
  })

  console.log({ admin })

  // 1. Point Settings (ANGKA SEMENTARA, tunggu konfirmasi Sailun)
  const pointSettings = [
    { key: "diskon_member_nominal", value: "300000" },
    { key: "poin_referral", value: "50" },
    { key: "poin_klub", value: "20" },
    { key: "masa_berlaku_poin_bulan", value: "12" },
  ];

  for (const setting of pointSettings) {
    await prisma.pointsetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        id: crypto.randomUUID(),
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log("PointSettings seeded.");

  // 2. Dealer
  const dealer = await prisma.dealer.upsert({
    where: { id: "dealer-1" },
    update: {},
    create: {
      id: "dealer-1",
      namaDealer: "OTO Ban Jakarta",
      alamat: "Jl. Sudirman No. 1, Jakarta",
      status: "active",
    },
  });
  console.log("Dealer seeded.");

  // 3. Dealer Staff
  const dealerUser = await prisma.user.upsert({
    where: { email: "dealer@sailun.id" },
    update: { passwordHash, updatedAt: new Date() },
    create: {
      id: crypto.randomUUID(),
      email: "dealer@sailun.id",
      passwordHash,
      role: "DEALER",
      updatedAt: new Date(),
    },
  });

  await prisma.dealerstaff.upsert({
    where: { userId: dealerUser.id },
    update: {},
    create: {
      id: crypto.randomUUID(),
      userId: dealerUser.id,
      dealerId: dealer.id,
    },
  });
  console.log("DealerStaff seeded.");
  // 4. Redemption Catalog (Fase 5)
  const catalogItems = [
    {
      id: "catalog-1",
      nama: "Voucher Ganti Oli Gratis",
      deskripsi: "Berlaku di seluruh bengkel resmi Sailun",
      hargaPoin: 30,
    },
    {
      id: "catalog-2",
      nama: "Merchandise Kaos Sailun",
      deskripsi: "Kaos eksklusif Sailun ukuran All Size",
      hargaPoin: 50,
    },
    {
      id: "catalog-3",
      nama: "Diskon Tambahan Ban 10%",
      deskripsi: "Potongan harga tambahan untuk pembelian ban berikutnya",
      hargaPoin: 80,
    },
    {
      id: "catalog-4",
      nama: "Dukungan Event Klub Rp 500rb",
      deskripsi: "Dana dukungan untuk acara atau gathering klub",
      hargaPoin: 200,
    },
  ];

  for (const item of catalogItems) {
    await prisma.redemptioncatalog.upsert({
      where: { id: item.id },
      update: {
        nama: item.nama,
        deskripsi: item.deskripsi,
        hargaPoin: item.hargaPoin,
        aktif: true,
      },
      create: {
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
        hargaPoin: item.hargaPoin,
        aktif: true,
      },
    });
  }
  console.log("RedemptionCatalog seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
