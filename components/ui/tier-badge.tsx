import React from "react";

interface TierBadgeProps {
  tier: string | null;
}

export function TierBadge({ tier }: TierBadgeProps) {
  if (!tier) return <span className="text-muted text-[12.5px] font-body italic">Belum Ada</span>;

  return (
    <span className="inline-flex items-center justify-center px-[12px] py-[4px] rounded-xs bg-transparent text-body font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] uppercase border border-hairline-strong">
      {tier}
    </span>
  );
}
