"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { ClubNavLinks } from "@/components/ui/club-nav-links"

export function MobileClubSidebar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-ink hover:text-accent transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div className={`fixed inset-y-0 left-0 z-[70] w-[280px] bg-gradient-to-br from-graphite to-graphite-soft border-r border-hairline py-[28px] px-[20px] transition-transform duration-300 lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-4 px-2">
              <div>
                <p className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-graphite-text mb-1">Sailun Community</p>
                <h2 className="font-display font-bold text-[17px] text-graphite-text-strong">Portal Klub</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-graphite-text hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-px bg-hairline/10 mx-2 mb-4 shrink-0" />

            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
              <ClubNavLinks onClick={() => setIsOpen(false)} />
            </nav>

            <div className="pt-4 border-t border-hairline/10 mt-auto shrink-0">
              <Link
                href="/api/auth/signout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-[11px] px-[12px] py-[11px] rounded-[6px] text-[12.5px] font-medium text-graphite-text hover:text-danger hover:bg-danger-soft transition-colors"
              >
                <LogOut className="w-[14px] h-[14px]" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
