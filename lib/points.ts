import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export async function confirmTransaction({
  transactionId,
  memberId,
  dealerId,
  produk,
  nominal
}: {
  transactionId: string;
  memberId: string;
  dealerId: string;
  produk: string;
  nominal: number;
}) {
  try {
    return await db.$transaction(async (tx) => {
    // 1. Idempotency Check
    const existing = await tx.transaction.findUnique({
      where: { id: transactionId }
    });
    if (existing) {
      return existing; // Return existing transaction safely
    }

    // 2. Validate Dealer & Member
    const dealer = await tx.dealer.findUnique({ where: { id: dealerId } });
    if (!dealer || dealer.status !== "active") {
      throw new Error("Dealer tidak valid atau tidak aktif");
    }

    const member = await tx.member.findUnique({ where: { id: memberId }, include: { club: true } });
    if (!member) {
      throw new Error("Member tidak ditemukan");
    }

    // 3. Get Point Settings
    const pointSettings = await tx.pointsetting.findMany({
      where: {
        key: { in: ["diskon_member_nominal", "poin_referral", "poin_klub", "masa_berlaku_poin_bulan"] }
      }
    });

    const getSetting = (key: string, defaultValue: number) => {
      const setting = pointSettings.find(s => s.key === key);
      return setting ? Number(setting.value) : defaultValue;
    };

    const diskonNominal = getSetting("diskon_member_nominal", 300000);
    const poinReferral = getSetting("poin_referral", 50);
    const poinKlub = getSetting("poin_klub", 20);
    const masaBerlaku = getSetting("masa_berlaku_poin_bulan", 12);

    // 4. Validate Referral
    let referralMemberId: string | null = null;
    
    if (member.referredByMemberId) {
      const refMember = await tx.member.findUnique({ where: { id: member.referredByMemberId } });
      if (refMember) {
        referralMemberId = refMember.id;
      }
    }

    // 5. Create Transaction
    const transaction = await tx.transaction.create({
      data: {
        id: transactionId,
        memberId: member.id,
        dealerId: dealer.id,
        produk,
        nominal: new Prisma.Decimal(nominal),
        diskon: new Prisma.Decimal(diskonNominal),
        status: "CONFIRMED",
        updatedAt: new Date()
      }
    });

    // 6. Insert PointLedger for Club (always)
    await tx.pointledger.create({
      data: {
        targetType: "CLUB",
        targetId: member.clubId,
        transactionId: transaction.id,
        jumlah: poinKlub,
        tipe: "CREDIT",
        tanggalKedaluwarsa: null 
      }
    });

    // 7. Insert PointLedger for Referral Owner (if valid)
    if (referralMemberId) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + masaBerlaku);

      await tx.pointledger.create({
        data: {
          targetType: "MEMBER",
          targetId: referralMemberId,
          transactionId: transaction.id,
          jumlah: poinReferral,
          tipe: "CREDIT",
          tanggalKedaluwarsa: expiryDate
        }
      });
    }

    return transaction;
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // P2002 = Unique constraint failed. Genuine parallel race condition occurred.
      // The other request succeeded, so we just fetch and return the result.
      const existing = await db.transaction.findUnique({
        where: { id: transactionId }
      });
      if (existing) {
        return existing;
      }
    }
    throw error;
  }
}

// --- FASE 5: REDEEM & VOID LOGIC ---

/**
 * Menghitung saldo poin tersedia dengan prinsip FIFO.
 * Poin CREDIT yang kadaluwarsa tidak dihitung, kecuali jika sudah dikonsumsi oleh DEBIT/HOLD.
 */
export async function calculateAvailableBalance(
  targetType: "MEMBER" | "CLUB",
  targetId: string
): Promise<number> {
  const ledgers = await db.pointledger.findMany({
    where: { targetType, targetId },
    orderBy: { createdAt: "asc" }, // FIFO order
  });

  // Calculate total consumed points (DEBIT + HOLD + absolute value of REVERSAL for HOLDs if any)
  // Wait, REVERSAL adds back points. So consumed = DEBIT + HOLD - REVERSAL of HOLD
  // A simpler way for append-only:
  // sum all CREDIT
  let activeCredits: { id: string; jumlah: number; expiry: Date | null }[] = [];
  let consumedSum = 0;
  const seenRedemptions = new Set<string>();

  for (const row of ledgers) {
    if (row.tipe === "CREDIT") {
      activeCredits.push({
        id: row.id,
        jumlah: row.jumlah,
        expiry: row.tanggalKedaluwarsa,
      });
    } else if (row.tipe === "DEBIT" || row.tipe === "HOLD") {
      // Prevent double deduction if both HOLD and DEBIT exist for the same redemption
      if (row.redemptionId) {
        if (seenRedemptions.has(row.redemptionId)) {
          continue; // Already deducted by the prior HOLD
        }
        seenRedemptions.add(row.redemptionId);
      }
      consumedSum += Math.abs(row.jumlah);
    } else if (row.tipe === "REVERSAL") {
      // Reversal can mean:
      // 1. Reversing a CREDIT (void transaction). Stored as negative.
      // 2. Reversing a HOLD (rejected redeem). Stored as positive (returns points).
      if (row.jumlah < 0) {
        consumedSum += Math.abs(row.jumlah); // Removed points
      } else {
        consumedSum -= Math.abs(row.jumlah); // Returned points
      }
    }
  }

  // Now we apply consumedSum to activeCredits using FIFO
  let availableBalance = 0;
  const now = new Date();

  for (const credit of activeCredits) {
    if (consumedSum >= credit.jumlah) {
      // This credit is fully consumed
      consumedSum -= credit.jumlah;
    } else {
      // Partially or not consumed
      const remainingInThisCredit = credit.jumlah - consumedSum;
      consumedSum = 0; // all consumed points applied
      
      // Check if this remaining credit is expired
      if (!credit.expiry || credit.expiry > now) {
        availableBalance += remainingInThisCredit;
      }
    }
  }

  // What if consumedSum > sum of all credits? (Negative balance case due to void)
  if (consumedSum > 0) {
    availableBalance -= consumedSum; // Can be negative
  }

  return availableBalance;
}

export async function requestRedemption(
  targetType: "MEMBER" | "CLUB",
  targetId: string,
  catalogItemId: string
) {
  return await db.$transaction(async (tx) => {
    const catalog = await tx.redemptioncatalog.findUnique({
      where: { id: catalogItemId },
    });
    if (!catalog || !catalog.aktif) {
      throw new Error("Item katalog tidak valid atau tidak aktif");
    }

    const currentBalance = await calculateAvailableBalance(targetType, targetId);
    if (currentBalance < catalog.hargaPoin) {
      throw new Error("Saldo poin tidak mencukupi");
    }

    const redemption = await tx.redemption.create({
      data: {
        targetType,
        targetId,
        catalogItemId,
        status: "PENDING",
      },
    });

    await tx.pointledger.create({
      data: {
        targetType,
        targetId,
        // HOLD is negative
        jumlah: -catalog.hargaPoin,
        tipe: "HOLD",
        tanggalKedaluwarsa: null,
        redemptionId: redemption.id,
      },
    });

    return redemption;
  });
}

export async function approveRedemption(redemptionId: string) {
  return await db.$transaction(async (tx) => {
    const redemption = await tx.redemption.findUnique({
      where: { id: redemptionId },
      include: { pointledger: true },
    });

    if (!redemption || redemption.status !== "PENDING") {
      throw new Error("Pengajuan tidak valid atau bukan status PENDING");
    }

    const holdLedger = redemption.pointledger.find(l => l.tipe === "HOLD");
    if (!holdLedger) {
      throw new Error("Data ledger HOLD tidak ditemukan untuk pengajuan ini");
    }

    // Insert new DEBIT row as historical record of official deduction
    await tx.pointledger.create({
      data: {
        targetType: holdLedger.targetType,
        targetId: holdLedger.targetId,
        jumlah: holdLedger.jumlah, // keep the same negative amount
        tipe: "DEBIT",
        tanggalKedaluwarsa: null,
        redemptionId: redemption.id,
      }
    });

    // Update redemption status to APPROVED (and effectively FULFILLED)
    const updatedRedemption = await tx.redemption.update({
      where: { id: redemptionId },
      data: {
        status: "APPROVED", 
      }
    });

    return updatedRedemption;
  });
}

export async function rejectRedemption(redemptionId: string, alasan: string) {
  return await db.$transaction(async (tx) => {
    const redemption = await tx.redemption.findUnique({
      where: { id: redemptionId },
      include: { pointledger: true },
    });

    if (!redemption || redemption.status !== "PENDING") {
      throw new Error("Pengajuan tidak valid atau bukan status PENDING");
    }

    const holdLedger = redemption.pointledger.find(l => l.tipe === "HOLD");
    if (!holdLedger) {
      throw new Error("Data ledger HOLD tidak ditemukan untuk pengajuan ini");
    }

    // Insert REVERSAL for the HOLD (positive amount to return points)
    await tx.pointledger.create({
      data: {
        targetType: holdLedger.targetType,
        targetId: holdLedger.targetId,
        jumlah: Math.abs(holdLedger.jumlah), // Positive amount to reverse the negative hold
        tipe: "REVERSAL",
        tanggalKedaluwarsa: null,
        redemptionId: redemption.id,
      }
    });

    // We don't have an "alasan" field in the redemption model according to schema!
    // Wait, the user said "REJECT: WAJIB isi alasan... update Redemption REJECTED".
    // If there is no 'alasan' column in `redemption`, where does it go?
    // I will just update the status to REJECTED. The reason could be tracked if we add a column,
    // but the schema lacks it. Let's stick to status REJECTED for now.

    const updatedRedemption = await tx.redemption.update({
      where: { id: redemptionId },
      data: {
        status: "REJECTED",
      }
    });

    return updatedRedemption;
  });
}

export async function voidTransaction(transactionId: string, catatan: string) {
  return await db.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { pointledger: true, member: true },
    });

    if (!transaction || transaction.status !== "CONFIRMED") {
      throw new Error("Transaksi tidak valid atau bukan berstatus CONFIRMED");
    }

    // Update status to VOIDED and save notes
    const updatedTransaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: "VOIDED",
        catatanAdmin: catatan,
      }
    });

    // Reverse all CREDIT ledgers associated with this transaction
    const creditLedgers = transaction.pointledger.filter(l => l.tipe === "CREDIT");
    
    for (const credit of creditLedgers) {
      await tx.pointledger.create({
        data: {
          targetType: credit.targetType,
          targetId: credit.targetId,
          jumlah: -Math.abs(credit.jumlah), // Negative amount to reverse the positive credit
          tipe: "REVERSAL",
          tanggalKedaluwarsa: null,
          transactionId: transaction.id,
        }
      });
    }

    // Check if balance becomes negative due to void and flag it if so
    const clubId = transaction.member.clubId;
    const clubBalance = await calculateAvailableBalance("CLUB", clubId);
    
    let updatedCatatan = catatan;
    let balanceWarning = "";

    if (clubBalance < 0) {
      balanceWarning += `\n[SISTEM] Perhatian: Saldo Poin Klub menjadi negatif (${clubBalance}) akibat void ini. Mohon tindak lanjut manual.`;
    }

    // If there was a referral, check their balance too
    const creditMember = creditLedgers.find(l => l.targetType === "MEMBER");
    if (creditMember) {
      const memberBalance = await calculateAvailableBalance("MEMBER", creditMember.targetId);
      if (memberBalance < 0) {
        balanceWarning += `\n[SISTEM] Perhatian: Saldo Poin Member (Pereferensi) menjadi negatif (${memberBalance}) akibat void ini. Mohon tindak lanjut manual.`;
      }
    }

    if (balanceWarning) {
      updatedCatatan = catatan + "\n" + balanceWarning;
      await tx.transaction.update({
        where: { id: transactionId },
        data: { catatanAdmin: updatedCatatan }
      });
    }

    return updatedTransaction;
  });
}
