import React from "react";

export function OrangeStreakDivider({ className }: { className?: string }) { 
  return (
    <div className={`h-1 w-full bg-gradient-to-r from-accent via-accent-hover to-transparent ${className || ""}`}></div>
  ); 
}
