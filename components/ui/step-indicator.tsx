import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between w-full relative mb-8">
      {/* Background connecting line */}
      <div className="absolute top-5 left-0 w-full h-[2px] bg-hairline -translate-y-1/2 z-0"></div>
      
      {/* Active connecting line */}
      <div 
        className="absolute top-5 left-0 h-[2px] bg-success -translate-y-1/2 z-0 transition-all duration-300"
        style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={index} className="flex flex-col items-center relative z-10 w-24">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-uppercase transition-colors duration-300 shadow-sm
                ${isCompleted ? 'bg-success text-card border-none' : ''}
                ${isActive ? 'bg-accent text-on-accent ring-4 ring-accent-soft border-none' : ''}
                ${isUpcoming ? 'bg-canvas border-2 border-hairline text-muted' : ''}
              `}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span
              className={`mt-3 text-caption text-center leading-tight
                ${isActive ? 'text-accent font-semibold' : ''}
                ${isCompleted ? 'text-success font-medium' : ''}
                ${isUpcoming ? 'text-muted' : ''}
              `}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
