"use client";

import { MapPin, DollarSign, Sparkles, ShieldCheck, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const ZONES = [
  { value: "all", label: "Toutes les zones", emoji: "🌏" },
  { value: "Canggu", label: "Canggu", emoji: "🏄" },
  { value: "Ubud", label: "Ubud", emoji: "🌿" },
  { value: "Seminyak", label: "Seminyak", emoji: "✨" },
  { value: "Sanur", label: "Sanur", emoji: "🌅" },
  { value: "Uluwatu", label: "Uluwatu", emoji: "🏖️" },
  { value: "Berawa", label: "Berawa", emoji: "🌊" },
];

const VIBES = [
  "Surf",
  "Yoga",
  "Party",
  "Digital Nomad",
  "Wellness",
  "Startup",
  "Calm",
  "Beach clubs",
  "Nature",
  "Social",
  "Luxury",
  "Fitness",
];

interface Filters {
  zone: string;
  minPrice: number;
  maxPrice: number;
  vibe: string;
  verified: boolean;
}

interface VillaFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function VillaFilters({
  filters,
  onFilterChange,
}: VillaFiltersProps) {
  const updateFilter = (key: keyof Filters, value: string | number | boolean) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      zone: "all",
      minPrice: 200,
      maxPrice: 700,
      vibe: "",
      verified: false,
    });
  };

  return (
    <div className="glass-card sticky top-24 space-y-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
        <h3 className="text-sm font-semibold text-white">Filtres</h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-primary"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Zone */}
      <div className="p-5">
        <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <MapPin className="h-3.5 w-3.5" />
          Zone
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ZONES.map((zone) => (
            <button
              key={zone.value}
              onClick={() => updateFilter("zone", zone.value)}
              className={`rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                filters.zone === zone.value
                  ? "border border-primary/40 bg-primary/10 text-primary font-medium"
                  : "border border-white/[0.04] bg-white/[0.02] text-white/50 hover:border-white/[0.1] hover:text-white/70"
              } ${zone.value === "all" ? "col-span-2" : ""}`}
            >
              <span className="mr-1">{zone.emoji}</span>
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Budget */}
      <div className="p-5">
        <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <DollarSign className="h-3.5 w-3.5" />
          Budget mensuel
        </label>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-white/50">
            {filters.minPrice}€
          </span>
          <span className="text-sm font-bold text-primary">
            {filters.minPrice}€ - {filters.maxPrice}€
          </span>
          <span className="text-xs text-white/50">
            {filters.maxPrice}€
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <span className="mb-1 block text-[10px] text-white/30">Minimum</span>
            <Slider
              value={[filters.minPrice]}
              min={100}
              max={filters.maxPrice - 50}
              step={25}
              onValueChange={([val]) => updateFilter("minPrice", val)}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/50 [&_[role=slider]]:shadow-glow [&_.range]:bg-primary/60"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] text-white/30">Maximum</span>
            <Slider
              value={[filters.maxPrice]}
              min={filters.minPrice + 50}
              max={1000}
              step={25}
              onValueChange={([val]) => updateFilter("maxPrice", val)}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/50 [&_[role=slider]]:shadow-glow [&_.range]:bg-primary/60"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Vibes */}
      <div className="p-5">
        <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Vibe
        </label>
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              onClick={() =>
                updateFilter("vibe", filters.vibe === vibe ? "" : vibe)
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                filters.vibe === vibe
                  ? "border border-primary/40 bg-primary/10 text-primary font-medium"
                  : "border border-white/[0.04] bg-white/[0.02] text-white/50 hover:border-white/[0.1] hover:text-white/70"
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Verified */}
      <div className="p-5">
        <button
          onClick={() => updateFilter("verified", !filters.verified)}
          className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
            filters.verified
              ? "border-primary/40 bg-primary/10"
              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
          }`}
        >
          <ShieldCheck
            className={`h-4 w-4 ${
              filters.verified ? "text-primary" : "text-white/30"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              filters.verified ? "text-primary" : "text-white/50"
            }`}
          >
            Villas verifiees uniquement
          </span>
          <div
            className={`ml-auto flex h-5 w-9 items-center rounded-full transition-colors ${
              filters.verified ? "bg-primary" : "bg-white/[0.1]"
            }`}
          >
            <div
              className={`h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                filters.verified ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
