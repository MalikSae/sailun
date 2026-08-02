import React from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageContainer } from "@/components/ui/page-container";

export default async function MemberTransactionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id }
  });

  if (!member) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: { memberId: member.id },
    include: { dealer: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-display-md font-display text-ink">Riwayat Transaksi</h2>
        <Link href="/admin/member/dashboard" className="lg:hidden text-accent text-body-sm">
          Kembali
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-graphite border border-hairline rounded-lg p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-title-md font-display text-ink mb-2">Belum Ada Transaksi</h3>
          <p className="text-body-md text-muted mb-6 max-w-md">
            Anda belum melakukan transaksi di dealer resmi Sailun Tire. Tunjukkan QR Member Anda saat berbelanja untuk mendapatkan diskon dan poin!
          </p>
          <Link href="/admin/member/dashboard">
            <ButtonSecondary>Lihat QR Member</ButtonSecondary>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-hairline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas border-b border-hairline">
                  <th className="py-3 px-4 text-[12.5px] font-medium text-muted uppercase tracking-wider">Tanggal</th>
                  <th className="py-3 px-4 text-[12.5px] font-medium text-muted uppercase tracking-wider">Dealer</th>
                  <th className="py-3 px-4 text-[12.5px] font-medium text-muted uppercase tracking-wider">Produk</th>
                  <th className="py-3 px-4 text-[12.5px] font-medium text-muted uppercase tracking-wider">Nominal</th>
                  <th className="py-3 px-4 text-[12.5px] font-medium text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-[13.5px] text-ink font-medium">
                        {format(new Date(tx.createdAt), "dd MMM yyyy", { locale: id })}
                      </p>
                      <p className="text-[12px] text-muted">
                        {format(new Date(tx.createdAt), "HH:mm", { locale: id })}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[13.5px] text-ink font-medium">{tx.dealer.namaDealer}</p>
                    </td>
                    <td className="py-3 px-4 text-[13.5px] text-ink max-w-[200px] truncate" title={tx.produk}>
                      {tx.produk}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[13.5px] text-ink font-medium">
                        Rp {Number(tx.nominal).toLocaleString("id-ID")}
                      </p>
                      <p className="text-[12px] text-success font-medium">
                        Diskon: Rp {Number(tx.diskon).toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={tx.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
