import React from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateAvailableBalance } from "@/lib/points";
import { redirect } from "next/navigation";
import RedeemClient from "./redeem-client";
import { PageContainer } from "@/components/ui/page-container";

export default async function MemberRedeemPage() {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    return <div className="p-8 text-center text-body">Profil member tidak ditemukan.</div>;
  }

  const saldoPoin = await calculateAvailableBalance("MEMBER", member.id);
  
  const catalog = await db.redemptioncatalog.findMany({
    where: { aktif: true },
    orderBy: { hargaPoin: "asc" }
  });

  const history = await db.redemption.findMany({
    where: { targetType: "MEMBER", targetId: member.id },
    include: { redemptioncatalog: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <PageContainer className="space-y-8">
      <div>
        <h2 className="text-display-md font-display text-ink mb-2">Tukar Poin</h2>
        <p className="text-body-md text-muted">Tukarkan poin Anda dengan berbagai reward menarik.</p>
      </div>

      <div className="bg-card p-6 rounded-lg border border-hairline flex justify-between items-center">
        <div>
          <p className="text-label-uppercase text-muted mb-1">Saldo Poin Tersedia</p>
          <p className="text-display-md font-display text-accent">{saldoPoin}</p>
        </div>
      </div>

      <RedeemClient catalog={catalog} targetId={member.id} targetType="MEMBER" saldoPoin={saldoPoin} />

      <div className="mt-12">
        <h3 className="text-title-lg font-display text-ink mb-4">Riwayat Penukaran</h3>
        {history.length === 0 ? (
          <p className="text-body-md text-muted bg-canvas p-6 rounded-lg text-center border border-hairline">
            Belum ada riwayat penukaran poin.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="bg-card p-4 rounded-lg border border-hairline flex justify-between items-center">
                <div>
                  <p className="text-body-md font-medium text-ink">{h.redemptioncatalog.nama}</p>
                  <p className="text-body-sm text-muted">{h.createdAt.toLocaleDateString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <p className="text-body-md font-medium text-warning mb-1">-{h.redemptioncatalog.hargaPoin} Poin</p>
                  <span className={`inline-block px-2 py-1 text-caption rounded-full ${
                    h.status === "PENDING" ? "bg-warning-soft text-warning" :
                    h.status === "APPROVED" ? "bg-success-soft text-success" :
                    h.status === "REJECTED" ? "bg-danger-soft text-danger" :
                    "bg-canvas text-muted"
                  }`}>
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
