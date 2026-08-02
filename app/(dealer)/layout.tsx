import React from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { TopNav } from "@/components/ui/top-nav";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { MobileDealerSidebar } from "@/components/ui/mobile-dealer-sidebar";
import { DealerNavLinks } from "@/components/ui/dealer-nav-links";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "DEALER") {
    redirect("/login");
  }

  // Get dealer info for UserProfileDropdown if needed, but session.user.name is used now.
  const staff = await db.dealerstaff.findUnique({
    where: { userId: session.user.id },
    include: { dealer: true }
  });

  const displayName = staff?.dealer?.namaDealer ?? "Dealer Panel";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Mobile Top Bar */}
      <TopNav className="lg:hidden flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <MobileDealerSidebar />
          <span className="text-title-lg font-display text-ink">Sailun Dealer</span>
        </div>
        <UserProfileDropdown session={session} displayName={displayName} />
      </TopNav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <SidebarNav className="hidden lg:flex flex-col">
          <div className="mb-4 px-2">
            <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-graphite-text mb-1">Sailun Community</p>
            <h2 className="font-display font-bold text-[17px] text-graphite-text-strong">Dealer Panel</h2>
          </div>

          <div className="h-px bg-hairline/10 mx-2 mb-4" />

          <nav className="flex flex-col gap-1 flex-1">
            <DealerNavLinks variant="desktop" />
          </nav>
        </SidebarNav>

        {/* Main Content — offset by sidebar width on desktop */}
        <main className="flex-1 min-w-0 lg:pl-[248px] min-h-screen flex flex-col">
          {/* Desktop Top Bar */}
          <div className="hidden lg:flex sticky top-0 z-30 h-[64px] bg-canvas/80 backdrop-blur-md border-b border-hairline px-8 items-center justify-end">
            <UserProfileDropdown session={session} displayName={displayName} />
          </div>
          
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
