import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { TopNav } from "@/components/ui/top-nav";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { MobileClubSidebar } from "@/components/ui/mobile-club-sidebar";
import { ClubNavLinks } from "@/components/ui/club-nav-links";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

export default async function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "CLUB") {
    redirect("/login");
  }

  // Ambil nama komunitas dari DB untuk ditampilkan di dropdown
  const club = await db.club.findFirst({
    where: { userId: session.user.id },
    select: { namaKomunitas: true },
  });
  const clubDisplayName = club?.namaKomunitas ?? "Portal Klub";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Mobile Top Bar — identik dengan admin */}
      <TopNav className="lg:hidden flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <MobileClubSidebar />
          <span className="text-title-lg font-display text-ink">Portal Klub</span>
        </div>
        <UserProfileDropdown session={session} displayName={clubDisplayName} />
      </TopNav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <SidebarNav className="hidden lg:flex flex-col">
          <div className="mb-4 px-2">
            <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-graphite-text mb-1">Sailun Community</p>
            <h2 className="font-display font-bold text-[17px] text-graphite-text-strong">Portal Klub</h2>
          </div>

          <div className="h-px bg-hairline/10 mx-2 mb-4" />

          <nav className="flex flex-col gap-1 flex-1">
            <ClubNavLinks />
          </nav>

          <div className="mt-auto pt-4 border-t border-hairline/10">
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-[11px] px-[12px] py-[11px] rounded-[6px] text-[12.5px] font-medium text-graphite-text hover:text-danger hover:bg-danger-soft transition-colors"
            >
              <LogOut className="w-[14px] h-[14px]" />
              <span>Logout</span>
            </Link>
          </div>
        </SidebarNav>

        {/* Main Content — offset by sidebar width on desktop */}
        <main className="flex-1 min-w-0 lg:pl-[248px] min-h-screen flex flex-col">
          {/* Desktop Top Bar — identik dengan admin */}
          <div className="hidden lg:flex sticky top-0 z-30 h-[64px] bg-canvas/80 backdrop-blur-md border-b border-hairline px-8 items-center justify-end">
            <UserProfileDropdown session={session} displayName={clubDisplayName} />
          </div>

          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
