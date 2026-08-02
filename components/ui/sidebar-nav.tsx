import * as React from "react"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={`fixed inset-y-0 left-0 z-40 w-[248px] bg-gradient-to-br from-graphite to-graphite-soft border-r border-hairline py-[28px] px-[20px] hidden lg:block ${className || ""}`}
        {...props}
      >
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </aside>
    )
  }
)
SidebarNav.displayName = "SidebarNav"

export { SidebarNav }
