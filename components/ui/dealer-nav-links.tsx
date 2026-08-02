"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, History } from "lucide-react";

export const dealerNavItems = [
  { href: "/dealer/scan", label: "Scan QR", icon: ScanLine },
  { href: "/dealer/transaksi", label: "Riwayat Transaksi", icon: History },
];

export function DealerNavLinks({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();

  return (
    <>
      {dealerNavItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        if (variant === "mobile") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] transition-colors ${
                isActive ? "text-accent" : "text-muted hover:text-accent"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="truncate w-full text-center">{item.label.split(" ")[0]}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
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
