import React from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RedeemAdminClient from "./redeem-admin-client";
import { PageContainer } from "@/components/ui/page-container";

export const dynamic = 'force-dynamic';

export default async function AdminRedeemPage({
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
  const statusFilter = (typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : "") || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const itemsPerPage = 20;

  const where: any = {};
  
  if (statusFilter && statusFilter !== "ALL") {
    where.status = statusFilter;
  }

  const totalItems = await db.redemption.count({ where }); // We might need to filter by targetName (query) later, but it's hard since targetName is hydrated. For now, query is applied post-hydration or we just ignore query for redeem if it's too complex. 
  // Let's fetch all matching status, then hydrate, then filter by query manually if query exists, THEN paginate.
  
  // Since we have to hydrate to know targetName, doing SQL 'LIKE' on member.nama or club.namaKomunitas requires complex joins.
  // We will do a Prisma query with OR across relations if query exists.
  
  if (query) {
    // Note: Prisma does not support searching across conditional polymorphic relations easily.
    // We will fetch all that match the status, then filter in memory for the query, THEN paginate.
    // This is fine for MVP.
  }

  let allRedemptions = await db.redemption.findMany({
    where,
    include: { redemptioncatalog: true },
    orderBy: { createdAt: "asc" }
  });

  let hydratedRedemptions = await Promise.all(
    allRedemptions.map(async (r) => {
      let targetName = "Unknown";
      if (r.targetType === "MEMBER") {
        const member = await db.member.findUnique({ where: { id: r.targetId } });
        if (member) targetName = member.nama;
      } else if (r.targetType === "CLUB") {
        const club = await db.club.findUnique({ where: { id: r.targetId } });
        if (club) targetName = club.namaKomunitas;
      }
      return {
        ...r,
        targetName
      };
    })
  );

  if (query) {
    const lowerQuery = query.toLowerCase();
    hydratedRedemptions = hydratedRedemptions.filter(r => 
      r.targetName.toLowerCase().includes(lowerQuery) || 
      r.redemptioncatalog.nama.toLowerCase().includes(lowerQuery)
    );
  }

  const finalTotalPages = Math.ceil(hydratedRedemptions.length / itemsPerPage);
  const paginatedRedemptions = hydratedRedemptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PageContainer className="space-y-8">
      <div>
        <h1 className="text-display-md font-display text-ink mb-2">Persetujuan Redeem</h1>
        <p className="text-body-md text-muted">Kelola pengajuan penukaran poin dari Member dan Klub.</p>
      </div>

      <RedeemAdminClient redemptions={paginatedRedemptions} totalPages={finalTotalPages} hasFilters={Boolean(query || (statusFilter && statusFilter !== "ALL"))} />
    </PageContainer>
  );
}
