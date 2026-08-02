import React from "react";
import { Coins } from "lucide-react";

export function PointsBalanceWidget({ balance }: { balance: number }) { 
  return (
    <div className="bg-card rounded-md px-[20px] py-[18px] border border-hairline flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
        <Coins className="w-6 h-6 text-accent" />
      </div>
      <div>
        <p className="font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] text-muted uppercase">Saldo Poin</p>
        <p className="text-stat-number font-mono text-accent">{balance}</p>
      </div>
    </div>
  ); 
}
