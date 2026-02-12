"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Wifi,
  BedDouble,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getScoreColor } from "@/lib/matching";

interface VillaOwner {
  id: string;
  name: string;
  avatar: string | null;
  verified: boolean;
}

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
  owner: VillaOwner;
  bookings?: { userId: string }[];
}

export default function VillaCard({ villa }: { villa: VillaData }) {
  const router = useRouter();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  let vibes: string[] = [];
  let amenities: string[] = [];
  try {
    vibes = JSON.parse(villa.vibe);
  } catch {
    vibes = [];
  }
  try {
    amenities = JSON.parse(villa.amenities);
  } catch {
    amenities = [];
  }

  const hasWifi = amenities.some((a) =>
    a.toLowerCase().includes("wifi")
  );
  const wifiSpeed = amenities
    .find((a) => a.toLowerCase().includes("wifi"))
    ?.match(/\d+/)?.[0];

  // Estimate a simple vibe-based score based on user's interests
  // Real matching would compare with villa roommates
  let vibeScore = 0;
  if (user?.vibeProfile) {
    // Simple score: how many of user's interests match villa vibes
    let userInterests: string[] = [];
    let userLifestyle: string[] = [];
    try {
      userInterests = JSON.parse(user.vibeProfile.interests);
    } catch {
      userInterests = [];
    }
    try {
      userLifestyle = JSON.parse(user.vibeProfile.lifestyle);
    } catch {
      userLifestyle = [];
    }
    const allUserVibes = [...userInterests, ...userLifestyle].map((v) =>
      v.toLowerCase()
    );
    const villaVibesLower = vibes.map((v) => v.toLowerCase());
    const matchCount = villaVibesLower.filter(
      (v) =>
        allUserVibes.some(
          (uv) => uv.includes(v) || v.includes(uv)
        )
    ).length;
    vibeScore = Math.min(
      Math.round((matchCount / Math.max(villaVibesLower.length, 1)) * 100),
      100
    );
    // Ensure a minimum floor for realism
    vibeScore = Math.max(vibeScore, 25);
  }

  const occupants = villa.bookings?.length ?? 0;

  return (
    <div
      className="glass-card-hover cursor-pointer overflow-hidden group"
      onClick={() => router.push(`/villas/${villa.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {/* Placeholder gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-accent/10" />
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50">
          🏡
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge zone */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            {villa.zone}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 backdrop-blur-md transition-all hover:bg-surface hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-primary text-primary" : "text-white/50"
            }`}
          />
        </button>

        {/* Verified badge */}
        {villa.verified && (
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center gap-1 rounded-md border border-emerald/50 bg-emerald/20 px-2 py-0.5 text-[10px] font-medium text-emerald backdrop-blur-md">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
        )}

        {/* Occupants */}
        {occupants > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="flex items-center gap-1 rounded-md border border-white/20 bg-surface/80 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-md">
              <Users className="h-3 w-3" />
              {occupants} resident{occupants > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-primary">
          {villa.title}
        </h3>

        {/* Location */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{villa.exactLocation}</span>
        </div>

        {/* Vibes */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vibes.slice(0, 3).map((v) => (
            <span
              key={v}
              className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
            >
              {v}
            </span>
          ))}
          {vibes.length > 3 && (
            <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/30">
              +{vibes.length - 3}
            </span>
          )}
        </div>

        {/* Amenities quick */}
        <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            <span>
              {villa.availableRooms}/{villa.totalRooms} dispo
            </span>
          </div>
          {hasWifi && (
            <div className="flex items-center gap-1">
              <Wifi className="h-3.5 w-3.5" />
              <span>{wifiSpeed || ""}Mbps</span>
            </div>
          )}
        </div>

        {/* Price + Score */}
        <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
          <div>
            <span className="text-xl font-bold text-primary">
              {villa.priceEUR}€
            </span>
            <span className="text-xs text-white/30"> /mois</span>
          </div>

          {user?.vibeProfile && vibeScore > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-white/30">Compatibilite</p>
              <p className={`text-lg font-bold ${getScoreColor(vibeScore)}`}>
                {vibeScore}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
