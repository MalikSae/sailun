import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TransactionForm from "./transaction-form";
import { PageContainer } from "@/components/ui/page-container";

export const metadata = {
  title: "Input Transaksi | Sailun Dealer",
};

export default async function TransaksiBaruPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string; referral?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  if (!resolvedSearchParams.memberId) {
    redirect("/dealer/scan");
  }

  const member = await db.member.findUnique({
    where: { id: resolvedSearchParams.memberId },
    include: { club: true }
  });

  if (!member) {
    redirect("/dealer/scan");
  }

  const pointSetting = await db.pointsetting.findUnique({
    where: { key: "diskon_member_nominal" }
  });
  
  const diskonNominal = pointSetting ? parseInt(pointSetting.value) : 300000;

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-display-md font-display font-bold text-ink mb-2">Input Transaksi Baru</h1>
        <p className="text-body-md text-body">Masukkan detail transaksi untuk member Sailun Community.</p>
      </div>

      <div className="bg-card rounded-md shadow-sm border border-hairline p-6 mb-6">
        <h3 className="font-display font-bold text-ink text-[17px] mb-4">Profil Member</h3>
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <p className="text-[11.5px] text-muted mb-1 uppercase tracking-wider">Nama</p>
            <p className="font-medium text-ink text-[13.5px]">{member.nama}</p>
          </div>
          <div>
            <p className="text-[11.5px] text-muted mb-1 uppercase tracking-wider">Komunitas</p>
            <p className="font-medium text-ink text-[13.5px]">{member.club.namaKomunitas}</p>
          </div>
          <div>
            <p className="text-[11.5px] text-muted mb-1 uppercase tracking-wider">Mobil</p>
            <p className="font-medium text-ink text-[13.5px]">{member.tipeMobil} ({member.tahunMobil})</p>
          </div>
        </div>
      </div>

      <TransactionForm 
        memberId={member.id} 
        diskonNominal={diskonNominal} 
      />
    </PageContainer>
  );
}
