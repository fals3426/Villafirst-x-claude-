"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import VillaCard from "@/components/VillaCard";
import VillaFilters from "@/components/VillaFilters";
import { useAuth } from "@/lib/AuthContext";

interface VillaData {
  id: string;
  title: string;
  zone: string;
  exactLocation: string;
  priceEUR: number;
  pricePerMonth: number;
  totalRooms: number;
  availableRooms: number;
  photos: string;
  amenities: string;
  vibe: string;
  verified: boolean;
  badges: string;
  minimumStay: string;
  description: string;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  };
  bookings?: { userId: string }[];
}

export default function VillasPage() {
  useAuth();
  const [villas, setVillas] = useState<VillaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    zone: "all",
    minPrice: 200,
    maxPrice: 700,
    vibe: "",
    verified: false,
  });

  const fetchVillas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.zone !== "all") params.set("zone", filters.zone);
      params.set("minPrice", filters.minPrice.toString());
      params.set("maxPrice", filters.maxPrice.toString());
      if (filters.vibe) params.set("vibe", filters.vibe);
      if (filters.verified) params.set("verified", "true");

      const res = await fetch(`/api/villas?${params}`);
      if (res.ok) {
        setVillas(await res.json());
      }
    } catch (err) {
      console.error("Error fetching villas:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVillas();
  }, [fetchVillas]);

  const activeFilterCount = [
    filters.zone !== "all",
    filters.minPrice !== 200 || filters.maxPrice !== 700,
    filters.vibe !== "",
    filters.verified,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-[41px] z-30 border-b border-white/[0.06] bg-surface/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-white lg:text-2xl">
                Trouve ta villa
              </h1>
              <p className="text-xs text-white/40">
                {loading ? "Recherche..." : `${villas.length} villa${villas.length !== 1 ? "s" : ""} disponible${villas.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="relative flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white/60 transition-colors hover:text-white lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <VillaFilters filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface">
                <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-surface px-5 py-3">
                  <h3 className="text-sm font-semibold text-white">Filtres</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-white/40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <VillaFilters
                    filters={filters}
                    onFilterChange={(f) => {
                      setFilters(f);
                    }}
                  />
                </div>
                <div className="sticky bottom-0 border-t border-white/[0.06] bg-surface p-4">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="glow-button h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    Voir {villas.length} resultats
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="glass-card aspect-[3/4] animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-white/[0.03]" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 rounded bg-white/[0.05]" />
                      <div className="h-3 w-1/2 rounded bg-white/[0.03]" />
                      <div className="flex gap-2">
                        <div className="h-5 w-16 rounded bg-white/[0.03]" />
                        <div className="h-5 w-12 rounded bg-white/[0.03]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : villas.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {villas.map((villa) => (
                  <VillaCard key={villa.id} villa={villa} />
                ))}
              </div>
            ) : (
              <div className="glass-card flex flex-col items-center gap-4 p-12 text-center">
                <Search className="h-12 w-12 text-white/10" />
                <div>
                  <p className="text-sm font-medium text-white/50">
                    Aucune villa trouvee
                  </p>
                  <p className="mt-1 text-xs text-white/30">
                    Essayez de modifier vos filtres
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      zone: "all",
                      minPrice: 200,
                      maxPrice: 700,
                      vibe: "",
                      verified: false,
                    })
                  }
                  className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                  Reinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
