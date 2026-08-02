import React from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { TopNav } from "@/components/ui/top-nav";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { MobileMemberSidebar } from "@/components/ui/mobile-member-sidebar";
import { MemberNavLinks } from "@/components/ui/member-nav-links";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "MEMBER") {
    redirect("/login");
  }

  const member = await db.member.findFirst({
    where: { userId: session.user.id },
    select: { nama: true },
  });
  const memberDisplayName = member?.nama ?? "Portal Member";

  return (
    <div className="min-h-screen bg-canvas">
      {/* Mobile Top Bar */}
      <TopNav className="lg:hidden flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <MobileMemberSidebar />
          <span className="text-title-lg font-display text-ink">Portal Member</span>
        </div>
        <UserProfileDropdown session={session} displayName={memberDisplayName} />
      </TopNav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <SidebarNav className="hidden lg:flex flex-col">
          <div className="mb-4 px-2">
            <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-graphite-text mb-1">Sailun Community</p>
            <h2 className="font-display font-bold text-[17px] text-graphite-text-strong">Portal Member</h2>
          </div>

          <div className="h-px bg-hairline/10 mx-2 mb-4" />

          <nav className="flex flex-col gap-1 flex-1">
            <MemberNavLinks />
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

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-[248px] min-h-screen flex flex-col">
          {/* Desktop Top Bar */}
          <div className="hidden lg:flex sticky top-0 z-30 h-[64px] bg-canvas/80 backdrop-blur-md border-b border-hairline px-8 items-center justify-end">
            <UserProfileDropdown session={session} displayName={memberDisplayName} />
          </div>

          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
