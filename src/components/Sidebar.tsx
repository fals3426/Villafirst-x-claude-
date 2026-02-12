"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Heart,
  MessageSquare,
  CalendarDays,
  User,
  LogOut,
  Building2,
  BarChart3,
  Users,
  Settings,
  Star,
  MapPin,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const COLOC_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explorer", href: "/villas", icon: MapPin },
  { label: "Mes Matchs", href: "/dashboard/matches", icon: Heart, badge: 3 },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: 5,
  },
  {
    label: "Reservations",
    href: "/dashboard/bookings",
    icon: CalendarDays,
  },
  { label: "Mon Profil", href: "/dashboard/profile", icon: User },
];

const OWNER_NAV = [
  { label: "Dashboard", href: "/dashboard-owner", icon: LayoutDashboard },
  { label: "Mes Villas", href: "/dashboard-owner/villas", icon: Building2 },
  {
    label: "Publier une villa",
    href: "/dashboard-owner/publish",
    icon: PlusCircle,
    highlight: true,
  },
  {
    label: "Demandes",
    href: "/dashboard-owner/requests",
    icon: Users,
    badge: 4,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: 2,
  },
  {
    label: "Statistiques",
    href: "/dashboard-owner/stats",
    icon: BarChart3,
  },
  { label: "Avis", href: "/dashboard-owner/reviews", icon: Star },
  { label: "Parametres", href: "/dashboard-owner/settings", icon: Settings },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({ className = "" }: { className?: string }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isOwner = user.type === "PROPRIETAIRE";
  const navItems = isOwner ? OWNER_NAV : COLOC_NAV;

  return (
    <aside
      className={`flex h-full w-[280px] flex-col border-r border-white/[0.06] bg-surface ${className}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">Villa</span>
          <span className="text-lg font-bold text-gold-gradient">First</span>
          <span className="text-base">🏝️</span>
        </Link>
      </div>

      {/* User profile mini */}
      <div className="border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
          <Avatar className="h-10 w-10 border border-primary/30">
            <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="text-xs text-white/40">
              {isOwner ? "Proprietaire" : "Colocataire"}
            </p>
          </div>
          {user.verified && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald/20 text-[10px]">
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/dashboard-owner" &&
                pathname.startsWith(item.href));
            const Icon = item.icon;
            const isHighlight = "highlight" in item && item.highlight;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isHighlight && !isActive
                    ? "border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                    : isActive
                    ? "bg-primary/10 text-primary"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 ${
                    isHighlight || isActive
                      ? "text-primary"
                      : "text-white/30 group-hover:text-white/60"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-white/[0.08] text-white/50"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: Home + Logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/[0.05] hover:text-white/70"
        >
          <Home className="h-4 w-4" />
          <span>Retour a l&apos;accueil</span>
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>
  );
}
