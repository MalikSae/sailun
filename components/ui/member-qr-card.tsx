import React from "react";

export function MemberQrCard({ memberId, memberName, clubName }: { memberId: string, memberName: string, clubName: string }) { 
  return (
    <div className="bg-gradient-to-br from-graphite to-graphite-soft rounded-lg px-[24px] py-[24px] flex flex-col items-center gap-6 max-w-sm mx-auto shadow-xl">
      <div className="text-center">
        <h2 className="text-title-lg font-display text-graphite-text-strong">{memberName}</h2>
        <p className="font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] text-accent uppercase">{clubName}</p>
      </div>
      <div className="bg-card p-4 rounded-md shadow-inner w-48 h-48 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#15171A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full opacity-80">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <rect x="7" y="7" width="3" height="3"></rect>
          <rect x="14" y="7" width="3" height="3"></rect>
          <rect x="7" y="14" width="3" height="3"></rect>
          <rect x="14" y="14" width="3" height="3"></rect>
        </svg>
      </div>
      <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-graphite-text font-mono">ID: {memberId}</p>
    </div>
  ); 
}
