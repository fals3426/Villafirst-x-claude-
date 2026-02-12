"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredType?: "COLOCATAIRE" | "PROPRIETAIRE";
}

export default function DashboardLayout({
  children,
  requiredType,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && requiredType && user.type !== requiredType) {
      if (user.type === "PROPRIETAIRE") {
        router.push("/dashboard-owner");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router, requiredType]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-white/40">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 top-[41px] z-30">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-[280px]">
        {/* Mobile nav */}
        <MobileNav />

        {/* Page content */}
        <main className="min-h-[calc(100vh-41px)] p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
