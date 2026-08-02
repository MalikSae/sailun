"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import { DealerNavLinks } from "@/components/ui/dealer-nav-links"

export function MobileDealerSidebar() {
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
                <h2 className="font-display font-bold text-[17px] text-graphite-text-strong">Dealer Panel</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-graphite-text hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="h-px bg-hairline/10 mx-2 mb-4 shrink-0" />

            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
              <DealerNavLinks variant="desktop" />
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
