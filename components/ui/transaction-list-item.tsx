import React from "react";

export function TransactionListItem({ title, date, amount, points }: { title: string, date: string, amount: string, points: string }) { 
  return (
    <div className="bg-card rounded-sm px-[16px] py-[12px] border border-hairline flex items-center justify-between hover:bg-[#FAFAF8] transition-colors">
      <div>
        <h4 className="font-body text-[12.5px] font-medium leading-[1.5] text-ink">{title}</h4>
        <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted">{date}</p>
      </div>
      <div className="text-right">
        <p className="font-body text-[12.5px] font-medium leading-[1.5] text-ink">{amount}</p>
        <p className="font-body text-[11.5px] font-medium leading-[1.4] tracking-[0.15px] text-success">+{points} Poin</p>
      </div>
    </div>
  ); 
}
