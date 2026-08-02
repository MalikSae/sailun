import React from "react";
import ScanClient from "./scan-client";
import { auth } from "@/lib/auth";
import { PageContainer } from "@/components/ui/page-container";

export const metadata = {
  title: "Scan QR Member | Sailun Dealer",
};

export default async function ScanPage() {
  const session = await auth();

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-display-md font-display font-bold text-ink mb-2">Scan QR Member</h1>
        <p className="text-body-md text-body">Pindai QR code pada kartu member Sailun untuk memulai transaksi dan memberikan poin.</p>
      </div>

      <ScanClient />
    </PageContainer>
  );
}
