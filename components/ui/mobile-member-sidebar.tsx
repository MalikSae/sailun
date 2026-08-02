"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { MemberNavLinks } from "@/components/ui/member-nav-links"

export function MobileMemberSidebar() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-ink hover:bg-black/5 rounded-md transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-gradient-to-br from-graphite to-graphite-soft flex flex-col shadow-2xl">
              <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
                <span className="font-display font-bold text-lg text-graphite-text-strong">Portal Member</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-graphite-text hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                <MemberNavLinks onClick={() => setIsOpen(false)} />
              </nav>

              <div className="p-4 border-t border-white/10">
                <Link
                  href="/api/auth/signout"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-[14px] font-medium text-graphite-text hover:text-danger hover:bg-danger-soft transition-colors"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
