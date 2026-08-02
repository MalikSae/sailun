import * as React from "react"

export interface BottomNavMobileProps extends React.HTMLAttributes<HTMLElement> {}

const BottomNavMobile = React.forwardRef<HTMLElement, BottomNavMobileProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={`fixed bottom-0 left-0 z-50 w-full h-[64px] bg-canvas/90 backdrop-blur-md border-t border-hairline px-4 flex items-center justify-around lg:hidden ${className || ""}`}
        {...props}
      >
        {children}
      </nav>
    )
  }
)
BottomNavMobile.displayName = "BottomNavMobile"

export { BottomNavMobile }
