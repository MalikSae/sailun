import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "default" | "lg";
  }

const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = size === "lg" 
      ? "text-[16px] px-[32px] h-[52px]" 
      : "text-[13.5px] px-[20px] h-[40px]";
      
    return (
      <button
        ref={ref}
        className={`bg-accent text-on-accent font-display font-semibold leading-none tracking-[0.1px] rounded-sm inline-flex items-center justify-center transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${className || ""}`}
        {...props}
      />
    )
  }
)
ButtonPrimary.displayName = "ButtonPrimary"

export { ButtonPrimary }
