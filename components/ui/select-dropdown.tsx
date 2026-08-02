import * as React from "react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const SelectDropdown = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={`bg-card text-ink border border-hairline font-body text-[13.5px] font-normal leading-[1.5] rounded-sm px-[12px] h-[40px] w-full transition-colors focus:outline-none focus:border-hairline-strong appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
        ref={ref}
        {...props}
      />
    )
  }
)
SelectDropdown.displayName = "SelectDropdown"

export { SelectDropdown }
