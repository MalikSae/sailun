import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`bg-card text-ink border border-hairline font-body text-[13.5px] font-normal leading-[1.5] rounded-sm px-[12px] py-[9px] h-[40px] w-full transition-colors focus:outline-none focus:border-hairline-strong placeholder:text-muted disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
        ref={ref}
        {...props}
      />
    )
  }
)
TextInput.displayName = "TextInput"

export { TextInput }
