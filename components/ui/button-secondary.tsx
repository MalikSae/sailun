import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`bg-transparent text-ink border border-hairline-strong font-display text-[13.5px] font-semibold leading-none tracking-[0.1px] rounded-sm px-[20px] h-[40px] inline-flex items-center justify-center transition-colors hover:bg-canvas disabled:opacity-50 disabled:pointer-events-none ${className || ""}`}
        {...props}
      />
    )
  }
)
ButtonSecondary.displayName = "ButtonSecondary"

export { ButtonSecondary }
