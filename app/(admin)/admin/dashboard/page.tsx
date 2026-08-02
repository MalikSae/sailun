import React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { StatCard } from "@/components/ui/stat-card";
import { Users, FileText, Banknote, Coins, AlertCircle, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { getTrendPeriod, getTrendData } from "@/lib/trends";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Determine trend period (all time logic by default without filters)
  const trendPeriod = getTrendPeriod(undefined, undefined);

  // 1. Member Baru
  const memberWhere = {};

  // 2. Jumlah Transaksi (HANYA CONFIRMED)
  const txWhere: Prisma.transactionWhereInput = {
    status: "CONFIRMED", // EXCLUDE VOIDED explicitly
  };

  // 4. Poin Beredar
  const pointWhere = {};

  // Execute all main queries in parallel to save time
  const [
    memberCount,
    txCount,
    txSum,
    pointLedgers,
    pendingSponsorshipCount,
    pendingRedeemCount,
    trendData,
  ] = await Promise.all([
    db.member.count({ where: memberWhere }),
    db.transaction.count({ where: txWhere }),
    db.transaction.aggregate({ where: txWhere, _sum: { nominal: true } }),
    db.pointledger.findMany({ where: pointWhere }),
    // Attention queries
    db.sponsorshipapplication.count({ where: { status: "PENDING" } }),
    db.redemption.count({ where: { status: "PENDING" } }),
    // Trend queries (without filters)
    getTrendData(db, trendPeriod, undefined, undefined, undefined),
  ]);

  const totalNominal = txSum._sum.nominal ? Number(txSum._sum.nominal) : 0;

  // Calculate circulating points (simplified global aggregate)
  let consumedSum = 0;
  let activeCredits = 0;
  const seenRedemptions = new Set<string>();

  const now = new Date();
  for (const row of pointLedgers) {
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

  const circulatingPoints = Math.max(0, activeCredits - consumedSum);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-display-md font-display font-bold text-ink">Dashboard Analitik</h1>
          <p className="text-body-md text-muted mt-1">Ringkasan performa dan data Sailun Community.</p>
        </div>
        
        <div>
          <a 
            href="/api/admin/export-transactions" 
            className="inline-flex items-center justify-center px-[20px] py-[10px] bg-graphite text-graphite-text-strong hover:bg-graphite-soft rounded-md text-[13.5px] font-medium transition-colors uppercase tracking-[0.8px]"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-title-md font-display font-bold text-ink mb-4">Butuh Perhatian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            variant="attention"
            title="Pengajuan Menunggu"
            value={pendingSponsorshipCount}
            icon={AlertCircle}
            actionLabel="Review Pengajuan"
            actionHref="/admin/approval"
          />
          <StatCard
            variant="attention"
            title="Redeem Menunggu"
            value={pendingRedeemCount}
            icon={RefreshCw}
            actionLabel="Review Redeem"
            actionHref="/admin/redeem"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Member Baru"
          value={memberCount.toString()}
          icon={Users}
          trend={{ value: memberCount - trendData.prevMemberCount, label: trendPeriod.label }}
        />
        <StatCard
          title="Jumlah Transaksi"
          value={txCount.toString()}
          icon={FileText}
          trend={{ value: txCount - trendData.prevTxCount, label: trendPeriod.label }}
        />
        <StatCard
          title="Nilai Transaksi"
          value={`Rp ${totalNominal.toLocaleString('id-ID')}`}
          icon={Banknote}
          trend={{ value: totalNominal - trendData.prevTotalNominal, label: trendPeriod.label }}
        />
        <StatCard
          title="Poin Beredar"
          value={circulatingPoints.toLocaleString('id-ID')}
          icon={Coins}
          trend={{ value: circulatingPoints - trendData.prevCirculatingPoints, label: trendPeriod.label }}
        />
      </div>
    </PageContainer>
  );
}
