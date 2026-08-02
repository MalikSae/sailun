"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, ChevronDown } from "lucide-react"

export function UserProfileDropdown({ session, displayName }: { session: any; displayName?: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Handle outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[11px] hover:bg-black/5 p-2 rounded-md transition-colors"
      >
        <div className="w-[32px] h-[32px] shrink-0 rounded-full bg-accent text-on-accent flex items-center justify-center font-bold text-[13px]">
          {session?.user?.email?.[0].toUpperCase() || "A"}
        </div>
        <div className="flex flex-col text-left hidden sm:flex">
          <span className="font-medium text-[13px] text-ink truncate max-w-[120px]">{displayName || session?.user?.name || "Admin"}</span>
          <span className="text-[11.5px] text-muted truncate max-w-[120px]">{session?.user?.email}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-hairline rounded-md shadow-lg py-1 z-50">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-ink hover:bg-danger-soft hover:text-danger transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      )}
    </div>
  )
}
