import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const transactions = await db.transaction.findMany({
    include: {
      member: {
        include: {
          club: true
        }
      },
      dealer: true,
      pointledger: { // Find points tied to transaction
        where: { targetType: "MEMBER", tipe: "CREDIT" }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Build CSV
  const header = ["Tanggal", "Klub", "Dealer", "Produk", "Nominal", "Diskon", "Status", "Poin Member"];
  const rows = transactions.map(tx => {
    const tanggal = tx.createdAt.toISOString();
    const klub = tx.member?.club?.namaKomunitas || "-";
    const dealer = tx.dealer?.namaDealer || "-";
    const produk = tx.produk;
    const nominal = tx.nominal;
    const diskon = tx.diskon;
    const status = tx.status;
    const poin = tx.pointledger.reduce((acc, pl) => acc + pl.jumlah, 0);

    return [
      tanggal,
      `"${klub.replace(/"/g, '""')}"`,
      `"${dealer.replace(/"/g, '""')}"`,
      `"${produk.replace(/"/g, '""')}"`,
      nominal,
      diskon,
      status,
      poin
    ].join(",");
  });

  const csvContent = [header.join(","), ...rows].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="transactions_${new Date().toISOString().split("T")[0]}.csv"`
    }
  });
}
