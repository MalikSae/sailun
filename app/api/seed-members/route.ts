import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const club = await db.club.upsert({
      where: { id: "club-1" },
      update: {},
      create: {
        id: "club-1",
        namaKomunitas: "Benz Club ID",
        jumlahAnggota: 100,
        tahunMobilMulai: 2000,
        tahunMobilAkhir: 2024,
        namaKetua: "Budi",
        status: "active",
        slug: "benz-club-id",
        updatedAt: new Date(),
      }
    });

    const memberAUser = await db.user.upsert({
      where: { email: 'memberA@sailun.id' },
      update: {},
      create: { email: 'memberA@sailun.id', passwordHash, role: 'MEMBER', updatedAt: new Date() }
    });

    const memberA = await db.member.upsert({
      where: { email: 'memberA@sailun.id' },
      update: {},
      create: {
        userId: memberAUser.id,
        nama: "Member A",
        usia: 30,
        telepon: "081234567890",
        email: "memberA@sailun.id",
        gender: "LAKI_LAKI",
        tipeMobil: "W204",
        tahunMobil: 2012,
        clubId: club.id,
        referralCode: "SLNAAAA",
        qrCardId: "qr-a",
        updatedAt: new Date()
      }
    });

    const memberBUser = await db.user.upsert({
      where: { email: 'memberB@sailun.id' },
      update: {},
      create: { email: 'memberB@sailun.id', passwordHash, role: 'MEMBER', updatedAt: new Date() }
    });

    const memberB = await db.member.upsert({
      where: { email: 'memberB@sailun.id' },
      update: {},
      create: {
        userId: memberBUser.id,
        nama: "Member B",
        usia: 25,
        telepon: "081234567891",
        email: "memberB@sailun.id",
        gender: "PEREMPUAN",
        tipeMobil: "W205",
        tahunMobil: 2018,
        clubId: club.id,
        referralCode: "SLNBBBB",
        qrCardId: "qr-b",
        updatedAt: new Date()
      }
    });

    const dealerStaff = await db.user.findFirst({ where: { role: 'DEALER' } });

    return NextResponse.json({
      memberA: { id: memberA.id, email: memberA.email, ref: memberA.referralCode },
      memberB: { id: memberB.id, email: memberB.email, ref: memberB.referralCode },
      dealer: dealerStaff?.email
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
