"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, Gift, ClipboardList, Users, ShieldCheck, Store, Layers } from "lucide-react";

export const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/approval", label: "Approval Sponsorship", icon: ClipboardCheck },
  { href: "/admin/redeem", label: "Approval Redeem", icon: Gift },
  { href: "/admin/transaksi", label: "Riwayat Transaksi", icon: ClipboardList },
  { href: "/admin/member", label: "Data Member", icon: Users },
  { href: "/admin/klub", label: "Data Klub", icon: ShieldCheck },
  { href: "/admin/dealer", label: "Data Dealer", icon: Store },
  { href: "/admin/pengaturan-poin", label: "Pengaturan Poin", icon: Layers },
];

export function AdminNavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {adminNavItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-[11px] px-[12px] py-[11px] rounded-[6px] text-[13.5px] font-medium transition-colors ${
              isActive 
                ? "bg-white/5 text-[#FAFAF9]" 
                : "text-graphite-text hover:bg-white/5 hover:text-[#FAFAF9]"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
