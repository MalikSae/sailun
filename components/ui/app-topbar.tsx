import React from "react";
import { Menu, User, Bell } from "lucide-react";

export function AppTopbar({ 
  onMenuClick, 
  userName,
  userRole 
}: { 
  onMenuClick?: () => void,
  userName?: string,
  userRole?: string
}) {
  return (
    <header className="h-[64px] bg-card border-b border-hairline flex items-center justify-between px-4 lg:px-6 shrink-0 z-30">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-ink hover:bg-canvas p-2 rounded-md transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Optional Logo/Brand space for mobile if needed */}
      </div>

      {/* Right Side Actions & Profile */}
      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-ink transition-colors p-2 relative">
          <Bell className="w-5 h-5" />
          {/* Optional unread dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-card"></span>
        </button>

        <div className="h-6 w-px bg-hairline-strong hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="font-body text-[12.5px] font-medium leading-[1.5] text-ink">{userName || "User"}</p>
            <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted">{userRole || "Member"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-canvas border border-hairline-strong flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
}
