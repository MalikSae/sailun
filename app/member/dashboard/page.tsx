import React from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateAvailableBalance } from "@/lib/points";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import Link from "next/link";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { MemberQrCardWidget } from "@/components/member-qr-card-widget";
import { Calendar, CheckCircle, ExternalLink, Coins } from "lucide-react";
import { ReferralShareCard } from "@/components/ui/referral-share-card";
import { FormCard } from "@/components/ui/form-card";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { PageContainer } from "@/components/ui/page-container";
import { EventTicketCard } from "@/components/event-ticket-card";

export default async function MemberDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
    include: { club: true }
  });

  if (!member) {
    return <div className="p-8 text-center text-body">Profil member tidak ditemukan.</div>;
  }

  // Generate QR Code data URL
  const qrDataUrl = await QRCode.toDataURL(member.qrCardId, {
    width: 300,
    margin: 1,
    color: {
      dark: "#F5760F", // accent
      light: "#FFFFFF"
    }
  });

  // Saldo poin dari PointLedger (Fase 5: FIFO Logic)
  const saldoPoin = await calculateAvailableBalance("MEMBER", member.id);

  // Fetch Events
  const events = await db.event.findMany({
    where: {
      sponsorshipapplication: {
        clubId: member.clubId
      }
    },
    include: {
      sponsorshipapplication: true,
      eventattendance: {
        where: {
          memberId: member.id
        }
      }
    }
  });

  const now = new Date();
  const bisaDiikuti: typeof events = [];
  const sudahDiikuti: typeof events = [];

  events.forEach(evt => {
    const isAttended = evt.eventattendance.length > 0;
    const isPast = evt.sponsorshipapplication.tanggalAcara < now;
    
    if (isAttended) {
      sudahDiikuti.push(evt);
    } else if (!isPast) {
      bisaDiikuti.push(evt);
    }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sailun.test";
  const referralUrl = `${appUrl}/k/${member.club.slug}?ref=${member.referralCode}`;

  return (
    <PageContainer className="space-y-6">
      <h2 className="text-display-md font-display text-ink mb-6 hidden lg:block">Dashboard Member</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: QR Card & Points */}
        <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-stretch">
          
          <MemberQrCardWidget member={member} qrDataUrl={qrDataUrl} />

          <div className="bg-card border border-hairline rounded-md flex flex-col overflow-hidden">
            <div className="p-6 sm:p-7 flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Coins className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold leading-[1.3] tracking-[0.8px] text-muted uppercase">Saldo Poin</p>
                  <p className="text-stat-number font-mono text-accent mt-0.5">{saldoPoin}</p>
                </div>
              </div>
              <Link href="/member/redeem" className="shrink-0">
                <ButtonPrimary>
                  Tukarkan Poin
                </ButtonPrimary>
              </Link>
            </div>
            
            <div className="bg-canvas/50 px-6 py-5 sm:px-7 sm:py-5 border-t border-hairline">
              <p className="text-body-sm text-ink mb-2.5 font-medium">
                Kumpulkan poin dengan:
              </p>
              <ul className="text-body-sm text-body space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  Bertransaksi di dealer pakai QR member kamu.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  Mengajak orang lain jadi member lewat link referral kamu.
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Referral & Events */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Referral Card */}
          <ReferralShareCard url={referralUrl} />

          {/* Event Section */}
          {(bisaDiikuti.length > 0 || sudahDiikuti.length > 0) && (
            <FormCard title="Event Komunitas">
              {bisaDiikuti.length > 0 && (
                <div className="mb-8 mt-2">
                  <h4 className="text-body-md font-medium text-ink mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Bisa Diikuti
                  </h4>
                  <div className="space-y-3">
                    {bisaDiikuti.map(evt => (
                      <div key={evt.id} className="border border-hairline rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-accent/30 transition-colors">
                        <div>
                          <p className="font-medium text-ink">{evt.sponsorshipapplication.namaAcara}</p>
                          <p className="text-body-sm text-muted mt-1">
                            {evt.sponsorshipapplication.tanggalAcara.toLocaleDateString("id-ID", {
                              weekday: "long", year: "numeric", month: "long", day: "numeric"
                            })}
                          </p>
                        </div>
                        <Link href={`/e/${evt.slug}`}>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-canvas text-ink hover:text-accent border border-hairline rounded-md transition-colors w-full sm:w-auto">
                            Buka Halaman Event <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sudahDiikuti.length > 0 && (
                <div className="mt-2">
                  <div className="space-y-3">
                    {sudahDiikuti.map(evt => (
                      <EventTicketCard 
                        key={evt.id}
                        eventName={evt.sponsorshipapplication.namaAcara}
                        eventDate={evt.sponsorshipapplication.tanggalAcara.toLocaleDateString("id-ID", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric"
                        })}
                        qrDataUrl={qrDataUrl}
                      />
                    ))}
                  </div>
                </div>
              )}

            </FormCard>
          )}

        </div>
      </div>
    </PageContainer>
  );
}
