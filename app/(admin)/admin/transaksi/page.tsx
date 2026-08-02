import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TransaksiClient from "./transaksi-client";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = 'force-dynamic';

export default async function AdminTransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const query = (typeof resolvedSearchParams?.query === 'string' ? resolvedSearchParams.query : "") || "";
  const filterStatus = (typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {};

  if (query) {
    where.OR = [
      { id: { contains: query } },
      { member: { nama: { contains: query } } },
      { dealer: { namaDealer: { contains: query } } },
      { produk: { contains: query } }
    ];
  }

  if (filterStatus && filterStatus !== "ALL") {
    where.status = filterStatus;
  }

  const totalItems = await db.transaction.count({ where });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const transactions = await db.transaction.findMany({
    where,
    include: { 
      member: true,
      dealer: true
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  const serializedTransactions = transactions.map((t) => ({
    ...t,
    nominal: Number(t.nominal),
    diskon: Number(t.diskon),
  }));

  const hasFilters = Boolean(query || (filterStatus && filterStatus !== "ALL"));

  return (
    <PageContainer className="space-y-8">
      <PageHeader 
        title="Riwayat Transaksi" 
        description="Pantau semua transaksi dan lakukan void jika diperlukan." 
      />

      <TransaksiClient transactions={serializedTransactions} totalPages={totalPages} hasFilters={hasFilters} />
    </PageContainer>
  );
}
