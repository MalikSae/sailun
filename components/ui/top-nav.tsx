import * as React from "react"

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {}

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={`sticky top-0 z-50 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline h-[64px] px-6 flex items-center justify-between ${className || ""}`}
        {...props}
      >
        {children}
      </header>
    )
  }
)
TopNav.displayName = "TopNav"

export { TopNav }
