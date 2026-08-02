import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ButtonGhost = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`bg-transparent text-body font-display text-[13.5px] font-semibold leading-none tracking-[0.1px] px-[10px] py-[8px] inline-flex items-center justify-center transition-colors hover:text-ink hover:bg-canvas rounded-sm disabled:opacity-50 disabled:pointer-events-none ${className || ""}`}
        {...props}
      />
    )
  }
)
ButtonGhost.displayName = "ButtonGhost"

export { ButtonGhost }
