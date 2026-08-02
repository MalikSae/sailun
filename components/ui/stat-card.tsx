import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  actionLabel?: string;
  actionHref?: string;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "attention";
}

export function StatCard({ title, value, icon: Icon, actionLabel, actionHref, trend, variant = "default" }: StatCardProps) {
  const isAttention = variant === "attention";
  
  return (
    <div className={`bg-card rounded-md px-[20px] py-[18px] border ${isAttention ? 'border-accent shadow-sm' : 'border-hairline'} flex flex-col justify-between h-full`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <span className={`font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] uppercase ${isAttention ? 'text-accent' : 'text-muted'}`}>{title}</span>
          <span className="text-stat-number font-mono text-ink">{value}</span>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${isAttention ? 'bg-accent-soft text-accent' : 'bg-canvas text-ink'}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || actionLabel) && (
        <div className="mt-auto pt-2 border-t border-hairline/50 flex items-center justify-between">
          {trend && (
            <div className="flex items-center gap-1.5">
              <span className={`flex items-center text-[12px] font-medium ${trend.value > 0 ? 'text-success' : trend.value < 0 ? 'text-danger' : 'text-muted'}`}>
                {trend.value > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : trend.value < 0 ? <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> : <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {trend.value > 0 ? '+' : ''}{trend.value}
              </span>
              <span className="text-[12px] text-muted">{trend.label}</span>
            </div>
          )}
          
          {actionLabel && actionHref && (
            <Link 
              href={actionHref}
              className={`text-[12px] font-semibold flex items-center gap-1 ${isAttention ? 'text-accent hover:text-accent-hover' : 'text-graphite-text hover:text-graphite'}`}
            >
              {actionLabel}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
