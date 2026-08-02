import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventRegistrationForm } from "@/components/event-registration-form";
import { Shield } from "lucide-react";

export default async function ClubRegistrationPage(props: { 
  params: Promise<{ clubSlug: string }>,
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const refCode = searchParams?.ref;

  const club = await db.club.findUnique({
    where: { slug: params.clubSlug }
  });

  if (!club) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite to-graphite-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card border border-hairline rounded-xl overflow-hidden shadow-lg">
        
        {/* Banner Area */}
        <div className="bg-canvas h-48 relative flex items-center justify-center border-b border-hairline-strong">
          {club.logoUrl ? (
            <img src={club.logoUrl} alt={club.namaKomunitas} className="h-32 w-32 object-cover rounded-md relative z-10" />
          ) : (
            <div className="h-32 w-32 rounded-full bg-canvas border border-hairline-strong flex items-center justify-center relative z-10">
              <Shield className="w-16 h-16 text-muted" />
            </div>
          )}
        </div>

        <div className="p-8 text-center">
          <h1 className="text-display-lg font-display text-ink mb-2">Registrasi Member Baru</h1>
          <p className="text-body-md text-accent font-bold mb-6">{club.namaKomunitas}</p>
          
          <div className="space-y-4 max-w-sm mx-auto mb-8">
            <p className="text-body-sm text-body">
              Bergabunglah menjadi member {club.namaKomunitas} dan dapatkan berbagai benefit menarik, 
              termasuk diskon pembelian produk Sailun Tire di dealer resmi.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <EventRegistrationForm clubId={club.id} clubName={club.namaKomunitas} refCode={refCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
