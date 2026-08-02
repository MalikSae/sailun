import { Prisma, PrismaClient } from "@prisma/client";

export type TrendPeriod = {
  currentStart: Date | undefined;
  currentEnd: Date | undefined;
  previousStart: Date;
  previousEnd: Date;
  label: string;
};

export function getTrendPeriod(startDate?: string, endDate?: string): TrendPeriod {
  const now = new Date();
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate + 'T23:59:59Z');
    
    // Calculate difference in milliseconds, then convert to days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Previous period ends just before current start
    const previousEnd = new Date(start.getTime() - 1);
    
    // Previous period starts N days before previous end
    const previousStart = new Date(previousEnd.getTime() - (diffDays * 24 * 60 * 60 * 1000));
    
    return {
      currentStart: start,
      currentEnd: end,
      previousStart,
      previousEnd,
      label: `dari ${diffDays} hari sebelumnya`,
    };
  } else {
    // Default to last 7 days vs previous 7 days
    const currentEnd = now;
    const currentStart = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    return {
      currentStart: undefined, // no explicit filter for current, meaning "all time"
      currentEnd: undefined,
      previousStart,
      previousEnd,
      label: "dari 7 hari sebelumnya",
    };
  }
}

export async function getTrendData(
  db: PrismaClient,
  period: TrendPeriod,
  clubId?: string,
  dealerId?: string,
  eventId?: string
) {
  // Query for previous period metrics
  const prevDateFilter = {
    createdAt: {
      gte: period.previousStart,
      lte: period.previousEnd,
    }
  };

  // 1. Previous Member Count
  const prevMemberWhere = {
    ...prevDateFilter,
    ...(clubId ? { clubId } : {}),
    ...(eventId ? { eventAsalId: eventId } : {}),
  };
  
  // 2. Previous Transaction Count
  const prevTxWhere: Prisma.transactionWhereInput = {
    ...prevDateFilter,
    status: "CONFIRMED",
    ...(clubId || eventId ? { member: { ...(clubId ? { clubId } : {}), ...(eventId ? { eventAsalId: eventId } : {}) } } : {}),
    ...(dealerId ? { dealerId } : {}),
  };

  // 3. Previous Point Ledger
  let prevPointWhere: any = { ...prevDateFilter };
  if (clubId) {
    const clubMembers = await db.member.findMany({ where: { clubId }, select: { id: true } });
    const memberIds = clubMembers.map(m => m.id);
    prevPointWhere = {
      ...prevPointWhere,
      OR: [
        { targetType: "CLUB", targetId: clubId },
        { targetType: "MEMBER", targetId: { in: memberIds } }
      ]
    };
  }

  // Execute in parallel
  const [prevMemberCount, prevTxCount, prevTxSum, prevPointLedgers] = await Promise.all([
    db.member.count({ where: prevMemberWhere }),
    db.transaction.count({ where: prevTxWhere }),
    db.transaction.aggregate({ where: prevTxWhere, _sum: { nominal: true } }),
    db.pointledger.findMany({ where: prevPointWhere }),
  ]);

  const prevTotalNominal = prevTxSum._sum.nominal ? Number(prevTxSum._sum.nominal) : 0;

  // Calculate circulating points
  let consumedSum = 0;
  let activeCredits = 0;
  const seenRedemptions = new Set<string>();

  const now = new Date();
  for (const row of prevPointLedgers) {
    if (row.tipe === "CREDIT") {
      if (!row.tanggalKedaluwarsa || row.tanggalKedaluwarsa > now) {
        activeCredits += row.jumlah;
      }
    } else if (row.tipe === "DEBIT" || row.tipe === "HOLD") {
      if (row.redemptionId) {
        if (seenRedemptions.has(row.redemptionId)) continue;
        seenRedemptions.add(row.redemptionId);
      }
      consumedSum += Math.abs(row.jumlah);
    } else if (row.tipe === "REVERSAL") {
      if (row.jumlah < 0) {
        consumedSum += Math.abs(row.jumlah);
      } else {
        consumedSum -= Math.abs(row.jumlah);
      }
    }
  }
  const prevCirculatingPoints = Math.max(0, activeCredits - consumedSum);

  return {
    prevMemberCount,
    prevTxCount,
    prevTotalNominal,
    prevCirculatingPoints,
  };
}
