"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, FlaskConical } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

const DEMO_USERS = [
  { email: "alex.thompson@gmail.com", name: "Alex Thompson", type: "COLOCATAIRE", flag: "🇺🇸" },
  { email: "sophie.martin@gmail.com", name: "Sophie Martin", type: "COLOCATAIRE", flag: "🇫🇷" },
  { email: "jake.wilson@gmail.com", name: "Jake Wilson", type: "COLOCATAIRE", flag: "🇦🇺" },
  { email: "maria.garcia@gmail.com", name: "Maria Garcia", type: "COLOCATAIRE", flag: "🇪🇸" },
  { email: "tom.anderson@gmail.com", name: "Tom Anderson", type: "COLOCATAIRE", flag: "🇬🇧" },
  { email: "wayan.putra@gmail.com", name: "Wayan Putra", type: "PROPRIETAIRE", flag: "🇮🇩" },
  { email: "david.chen@gmail.com", name: "David Chen", type: "PROPRIETAIRE", flag: "🇨🇦" },
  { email: "emma.rodriguez@gmail.com", name: "Emma Rodriguez", type: "PROPRIETAIRE", flag: "🇲🇽" },
  { email: "john.smith@gmail.com", name: "John Smith", type: "PROPRIETAIRE", flag: "🇺🇸" },
  { email: "lisa.wong@gmail.com", name: "Lisa Wong", type: "PROPRIETAIRE", flag: "🇸🇬" },
];

export default function DemoModeBanner() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Find current demo user based on logged-in user email
  const currentDemoUser = DEMO_USERS.find((u) => u.email === user?.email) || null;

  const handleSelectUser = async (demoUser: (typeof DEMO_USERS)[0]) => {
    setIsOpen(false);
    if (demoUser.email === user?.email) return; // Already this user

    setIsSwitching(true);
    try {
      const loggedInUser = await login(demoUser.email);
      // Redirect to correct dashboard
      if (loggedInUser.type === "PROPRIETAIRE") {
        router.push("/dashboard-owner");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error switching user:", err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      // Logout current user since IDs will change after re-seed
      logout();
      window.location.href = "/";
    } catch {
      alert("Erreur lors de la reinitialisation");
    } finally {
      setIsResetting(false);
    }
  };

  const displayName = currentDemoUser?.name || user?.name || "Non connecte";
  const displayFlag = currentDemoUser?.flag || "";

  return (
    <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#111111] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Demo label */}
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/20">
              <FlaskConical className="h-3 w-3 text-primary" />
            </div>
            <span className="hidden text-primary sm:inline">
              MODE DEMO
            </span>
            <span className="text-primary sm:hidden">DEMO</span>
            <span className="hidden text-white/40 md:inline">
              — Donnees fictives
            </span>
          </div>

          {/* Right: User switcher + Reset */}
          <div className="flex items-center gap-2">
            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isSwitching}
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm transition-all hover:border-primary/30 hover:bg-white/[0.08] disabled:opacity-50"
              >
                {isSwitching ? (
                  <span className="text-white/50 animate-pulse">Chargement...</span>
                ) : (
                  <>
                    <span className="hidden text-white/50 sm:inline">
                      Profil :
                    </span>
                    {displayFlag && <span className="text-xs">{displayFlag}</span>}
                    <span className="font-medium text-white">
                      {displayName}
                    </span>
                    {user && (
                      <span className={`hidden text-[10px] px-1.5 py-0.5 rounded-full sm:inline ${
                        user.type === "PROPRIETAIRE"
                          ? "bg-accent/20 text-accent"
                          : "bg-primary/20 text-primary"
                      }`}>
                        {user.type === "PROPRIETAIRE" ? "Proprio" : "Coloc"}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-white/40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl border border-white/[0.08] bg-[#161616] shadow-2xl">
                    <div className="p-1.5">
                      <p className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Colocataires
                      </p>
                      {DEMO_USERS.filter((u) => u.type === "COLOCATAIRE").map(
                        (demoUser) => (
                          <button
                            key={demoUser.email}
                            onClick={() => handleSelectUser(demoUser)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                              user?.email === demoUser.email
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                            }`}
                          >
                            <span className="text-xs">{demoUser.flag}</span>
                            <span>{demoUser.name}</span>
                            {user?.email === demoUser.email && (
                              <span className="ml-auto text-xs text-primary">
                                ●
                              </span>
                            )}
                          </button>
                        )
                      )}

                      <div className="my-1.5 border-t border-white/[0.06]" />

                      <p className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                        Proprietaires
                      </p>
                      {DEMO_USERS.filter((u) => u.type === "PROPRIETAIRE").map(
                        (demoUser) => (
                          <button
                            key={demoUser.email}
                            onClick={() => handleSelectUser(demoUser)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all ${
                              user?.email === demoUser.email
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                            }`}
                          >
                            <span className="text-xs">{demoUser.flag}</span>
                            <span>{demoUser.name}</span>
                            {user?.email === demoUser.email && (
                              <span className="ml-auto text-xs text-primary">
                                ●
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Reset button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-white/60 transition-all hover:border-primary/30 hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
            >
              <RotateCcw
                className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isResetting ? "..." : "Reset"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
