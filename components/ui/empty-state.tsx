import React from "react";
import { Inbox, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-hairline rounded-md">
      <div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-title-md font-display text-ink mb-2">{title}</h3>
      <p className="font-body text-[13.5px] font-normal leading-[1.5] text-muted max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
