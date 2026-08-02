import * as React from "react"

export type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "VOIDED" | "FULFILLED" | "INFO" | string;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, ...props }, ref) => {
    let colorClass = "bg-info-soft text-info"
    const upperStatus = status.toUpperCase()
    
    if (upperStatus === "PENDING" || upperStatus === "UNVERIFIED") {
      colorClass = "bg-warning-soft text-warning"
    } else if (upperStatus === "APPROVED" || upperStatus === "FULFILLED" || upperStatus === "ACTIVE") {
      colorClass = "bg-success-soft text-success"
    } else if (upperStatus === "REJECTED" || upperStatus === "VOIDED" || upperStatus === "INACTIVE") {
      colorClass = "bg-danger-soft text-danger"
    } else if (upperStatus === "INFO") {
      colorClass = "bg-info-soft text-info"
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center justify-center rounded-xs px-[9px] py-[4px] font-mono text-[10.5px] font-medium leading-[1.3] tracking-[0.8px] uppercase ${colorClass} ${className || ""}`}
        {...props}
      >
        {upperStatus === "ACTIVE" ? "VERIFIED" : status}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge }
