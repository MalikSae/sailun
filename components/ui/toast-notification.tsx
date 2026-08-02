import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

export function ToastNotification({ type, message, onClose }: { type: "success" | "error" | "warning" | "info", message: string, onClose?: () => void }) {
  const icons = { 
    success: <CheckCircle className="w-5 h-5 text-success"/>, 
    error: <XCircle className="w-5 h-5 text-danger"/>, 
    warning: <AlertTriangle className="w-5 h-5 text-warning"/>, 
    info: <Info className="w-5 h-5 text-info"/> 
  };
  
  const borderColors = { 
    success: "border-success/30", 
    error: "border-danger/30", 
    warning: "border-warning/30", 
    info: "border-info/30" 
  };
  
  return (
    <div className={`bg-ink text-on-accent rounded-sm px-[16px] py-[12px] flex items-start gap-3 border ${borderColors[type]}`}>
      {icons[type]}
      <p className="flex-1 font-body text-[12.5px] font-normal leading-[1.5] mt-0.5">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-muted hover:text-on-accent transition-colors shrink-0">
          <X className="w-4 h-4"/>
        </button>
      )}
    </div>
  ); 
}
