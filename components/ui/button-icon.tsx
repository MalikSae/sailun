import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`bg-card text-body border border-hairline rounded-full w-[36px] h-[36px] inline-flex items-center justify-center transition-colors hover:bg-canvas disabled:opacity-50 disabled:pointer-events-none ${className || ""}`}
        {...props}
      />
    )
  }
)
ButtonIcon.displayName = "ButtonIcon"

export { ButtonIcon }
