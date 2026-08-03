"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Gift, Users, UserCircle } from "lucide-react";

export const clubNavItems = [
  { href: "/club/dashboard", label: "Dashboard", icon: Home },
  { href: "/club/profil", label: "Profil", icon: UserCircle },
  { href: "/club/anggota", label: "Anggota", icon: Users },
  { href: "/ajukan-sponsorship", label: "Ajukan Sponsorship", icon: ClipboardList },
  { href: "/club/redeem", label: "Tukar Poin", icon: Gift },
];

export function ClubNavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {clubNavItems.map((item) => {
        // Special check for /ajukan-sponsorship to not be highlighted on every subpath unless it matches
        const isActive = item.href === "/ajukan-sponsorship" 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

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
