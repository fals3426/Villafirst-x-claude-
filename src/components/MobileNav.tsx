"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  CalendarDays,
  Menu,
  Building2,
  BarChart3,
  MapPin,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const COLOC_TABS = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explorer", href: "/villas", icon: MapPin },
  { label: "Matchs", href: "/dashboard/matches", icon: Heart },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
];

const OWNER_TABS = [
  { label: "Home", href: "/dashboard-owner", icon: LayoutDashboard },
  { label: "Villas", href: "/dashboard-owner/villas", icon: Building2 },
  { label: "Publier", href: "/dashboard-owner/publish", icon: PlusCircle, highlight: true },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Stats", href: "/dashboard-owner/stats", icon: BarChart3 },
];

export default function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!user) return null;

  const isOwner = user.type === "PROPRIETAIRE";
  const tabs = isOwner ? OWNER_TABS : COLOC_TABS;

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-[41px] z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-surface/95 px-4 backdrop-blur-lg lg:hidden">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-base font-bold text-white">Villa</span>
          <span className="text-base font-bold text-gold-gradient">First</span>
          <span className="text-sm">🏝️</span>
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white">
              <Menu className="h-4.5 w-4.5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] border-white/[0.06] bg-surface p-0"
          >
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div onClick={() => setSheetOpen(false)}>
              <Sidebar className="w-full border-r-0" />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-surface/95 backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/dashboard" &&
                tab.href !== "/dashboard-owner" &&
                pathname.startsWith(tab.href));
            const Icon = tab.icon;
            const isHighlight = "highlight" in tab && tab.highlight;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors ${
                  isHighlight && !isActive
                    ? "text-primary"
                    : isActive
                    ? "text-primary"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <div className={isHighlight && !isActive ? "rounded-full bg-primary/20 p-1" : ""}>
                  <Icon className={`h-5 w-5 ${isHighlight || isActive ? "text-primary" : ""}`} />
                </div>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Safe area bottom for iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  );
}
