import React from "react";

interface BenefitCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function BenefitCard({ title, description, icon }: BenefitCardProps) {
  return (
    <div className="bg-card rounded-md px-[22px] py-[22px] border border-hairline transition-all hover:bg-[#FAFAF8] shadow-sm hover:shadow-md">
      {icon && <div className="text-accent mb-4 text-3xl">{icon}</div>}
      <h3 className="text-title-md font-display text-ink font-semibold mb-2">{title}</h3>
      <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted">{description}</p>
    </div>
  );
}
