"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Gift } from "lucide-react";

export const memberNavItems = [
  { href: "/member/dashboard", label: "Dashboard", icon: Home },
  { href: "/member/transaksi", label: "Riwayat Transaksi", icon: ClipboardList },
  { href: "/member/redeem", label: "Tukar Poin", icon: Gift },
];

export function MemberNavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {memberNavItems.map((item) => {
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
