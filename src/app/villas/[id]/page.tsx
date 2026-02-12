"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  BedDouble,
  Bath,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Utensils,
  Snowflake,
  Tv,
  Flower2,
  Coffee,
  Sun,
  Music,
  Printer,
  Eye,
  DollarSign,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  Heart,
  Users,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/AuthContext";
import {
  calculateVibeScore,
  getScoreColor,
  getScoreRingColor,
  type VibeProfileData,
} from "@/lib/matching";
import UserProfileModal from "@/components/UserProfileModal";

// Map amenity keywords to icons
function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("pool")) return Waves;
  if (lower.includes("kitchen") || lower.includes("cooking"))
    return Utensils;
  if (lower.includes("parking")) return Car;
  if (lower.includes("gym") || lower.includes("fitness")) return Dumbbell;
  if (lower.includes("ac") || lower.includes("air")) return Snowflake;
  if (lower.includes("tv") || lower.includes("smart")) return Tv;
  if (lower.includes("garden") || lower.includes("organic")) return Flower2;
  if (lower.includes("coworking") || lower.includes("workspace") || lower.includes("desk"))
    return Coffee;
  if (lower.includes("view") || lower.includes("terrace") || lower.includes("rooftop"))
    return Sun;
  if (lower.includes("sound") || lower.includes("music")) return Music;
  if (lower.includes("printer") || lower.includes("scanner")) return Printer;
  if (lower.includes("security")) return Eye;
  return ShieldCheck;
}

interface Roommate {
  id: string;
  name: string;
  avatar: string | null;
  nationality: string | null;
  age: number | null;
  languages: string;
  verified: boolean;
  badges: string;
  vibeProfile: (VibeProfileData & {
    bio: string | null;
    preferredZones: string;
    workStyle: string | null;
    schedule: string | null;
    smokingOk: boolean;
    petsOk: boolean;
    veganOk: boolean;
  }) | null;
}

interface VillaDetail {
  id: string;
  title: string;
  zone: string;
  exactLocation: string;
  pricePerMonth: number;
  priceEUR: number;
  priceUSD: number;
  deposit: number;
  totalRooms: number;
  availableRooms: number;
  bathrooms: number;
  photos: string;
  description: string;
  amenities: string;
  vibe: string;
  verified: boolean;
  badges: string;
  minimumStay: string;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
    languages: string;
    nationality: string | null;
    badges: string;
  };
  roommates: Roommate[];
}

function ScoreCircle({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringColor = getScoreRingColor(score);
  const textColor = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/[0.06]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={ringColor}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${textColor}`}>
        {score}%
      </span>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [villa, setVilla] = useState<VillaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Roommate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchVilla() {
      try {
        const res = await fetch(`/api/villas/${params.id}`);
        if (res.ok) {
          setVilla(await res.json());
        } else {
          router.push("/villas");
        }
      } catch {
        router.push("/villas");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchVilla();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!villa) return null;

  let amenities: string[] = [];
  let vibes: string[] = [];
  let badges: string[] = [];
  let ownerLanguages: string[] = [];
  try { amenities = JSON.parse(villa.amenities); } catch { amenities = []; }
  try { vibes = JSON.parse(villa.vibe); } catch { vibes = []; }
  try { badges = JSON.parse(villa.badges); } catch { badges = []; }
  try { ownerLanguages = JSON.parse(villa.owner.languages); } catch { ownerLanguages = []; }

  const depositEUR = Math.round(villa.deposit / (villa.pricePerMonth / villa.priceEUR));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <div className="sticky top-[41px] z-30 border-b border-white/[0.06] bg-surface/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                liked
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-primary text-primary" : "text-white/50"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hero gallery placeholder */}
      <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
        <div className="grid grid-cols-4 gap-2 overflow-hidden rounded-2xl">
          {/* Main large photo */}
          <div className="col-span-4 aspect-[16/9] bg-gradient-to-br from-primary/20 via-surface to-accent/10 lg:col-span-2 lg:row-span-2 lg:aspect-auto">
            <div className="flex h-full items-center justify-center text-7xl opacity-40">
              🏡
            </div>
          </div>
          {/* Small photos */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="hidden aspect-[4/3] bg-gradient-to-br from-white/[0.03] to-surface lg:block"
            >
              <div className="flex h-full items-center justify-center text-3xl opacity-20">
                📸
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-3">
            {/* Title & badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-primary/30 bg-primary/10 text-xs text-primary">
                  {villa.zone}
                </Badge>
                {villa.verified && (
                  <Badge className="border-emerald/30 bg-emerald/10 text-xs text-emerald">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verifiee
                  </Badge>
                )}
                {badges.map((b) => (
                  <Badge
                    key={b}
                    className="border-white/[0.1] bg-white/[0.05] text-[10px] text-white/50"
                  >
                    {b}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold text-white lg:text-3xl">
                {villa.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/40">
                <MapPin className="h-4 w-4" />
                {villa.exactLocation}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4" />
                  {villa.totalRooms} chambres ({villa.availableRooms} dispo)
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4" />
                  {villa.bathrooms} SdB
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Min. {villa.minimumStay}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-white">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-white/60">
                {villa.description}
              </p>
            </div>

            {/* Vibes */}
            <div className="glass-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-white">
                Vibes
              </h2>
              <div className="flex flex-wrap gap-2">
                {vibes.map((v) => (
                  <span
                    key={v}
                    className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="glass-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Equipements
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-xs text-white/60">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column — sticky price card */}
          <div className="lg:col-span-2">
            <div className="glass-card gradient-border sticky top-28 space-y-0 overflow-hidden">
              {/* Price */}
              <div className="border-b border-white/[0.06] p-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    {villa.priceEUR}€
                  </span>
                  <span className="text-sm text-white/30">/mois</span>
                </div>
                <p className="mt-1 text-xs text-white/30">
                  {villa.pricePerMonth.toLocaleString()} IDR · ${villa.priceUSD} USD
                </p>
              </div>

              {/* Price details */}
              <div className="border-b border-white/[0.06] p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/50">
                      <DollarSign className="h-3.5 w-3.5" />
                      Loyer mensuel
                    </span>
                    <span className="font-medium text-white">
                      {villa.priceEUR}€
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/50">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Depot de garantie
                    </span>
                    <span className="font-medium text-white">
                      ~{depositEUR}€
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      Sejour minimum
                    </span>
                    <span className="font-medium text-white">
                      {villa.minimumStay}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-white/30">
                  * Electricite, eau et menage inclus
                </p>
              </div>

              {/* CTA */}
              <div className="p-6 space-y-3">
                {villa.availableRooms > 0 ? (
                  <button
                    onClick={() => router.push(`/villas/${villa.id}/booking`)}
                    className="glow-button h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    Reserver maintenant
                  </button>
                ) : (
                  <button
                    disabled
                    className="h-12 w-full rounded-xl bg-white/[0.05] text-sm font-semibold text-white/30"
                  >
                    Complet
                  </button>
                )}
                <button className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white">
                  <MessageSquare className="h-4 w-4" />
                  Contacter le proprietaire
                </button>
              </div>

              {/* Owner */}
              <div className="border-t border-white/[0.06] p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
                      {getInitials(villa.owner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white">
                        {villa.owner.name}
                      </p>
                      {villa.owner.verified && (
                        <span className="text-xs text-emerald">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-white/30">
                      {villa.owner.nationality}
                      {ownerLanguages.length > 0 &&
                        ` · ${ownerLanguages.join(", ")}`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roommates section */}
        <div className="mt-12">
          <h2 className="mb-6 font-display text-xl font-bold text-white lg:text-2xl">
            <Users className="mr-2 inline h-6 w-6 text-primary" />
            Rencontre tes futurs colocs
          </h2>

          {villa.roommates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {villa.roommates.map((roommate) => {
                const score =
                  user?.vibeProfile && roommate.vibeProfile
                    ? calculateVibeScore(
                        user.vibeProfile,
                        roommate.vibeProfile
                      )
                    : 0;

                let rmInterests: string[] = [];
                let rmLifestyle: string[] = [];
                let rmLanguages: string[] = [];
                try { rmInterests = JSON.parse(roommate.vibeProfile?.interests ?? "[]"); } catch { rmInterests = []; }
                try { rmLifestyle = JSON.parse(roommate.vibeProfile?.lifestyle ?? "[]"); } catch { rmLifestyle = []; }
                try { rmLanguages = JSON.parse(roommate.languages); } catch { rmLanguages = []; }

                return (
                  <div
                    key={roommate.id}
                    className="glass-card-hover cursor-pointer overflow-hidden p-5"
                    onClick={() => {
                      setSelectedUser(roommate);
                      setModalOpen(true);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/20 text-base font-bold text-primary">
                          {getInitials(roommate.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-semibold text-white">
                            {roommate.name}
                          </h3>
                          {roommate.verified && (
                            <span className="text-xs text-emerald">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-white/40">
                          {roommate.age && `${roommate.age} ans`}
                          {roommate.nationality &&
                            ` · ${roommate.nationality}`}
                        </p>
                        {rmLanguages.length > 0 && (
                          <p className="mt-0.5 text-[10px] text-white/30">
                            {rmLanguages.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Score circle */}
                      {user?.vibeProfile && roommate.vibeProfile && user.id !== roommate.id && (
                        <ScoreCircle score={score} size={56} />
                      )}
                    </div>

                    {/* Bio excerpt */}
                    {roommate.vibeProfile?.bio && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/40">
                        {roommate.vibeProfile.bio}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {rmLifestyle.slice(0, 2).map((l) => (
                        <span
                          key={l}
                          className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/40"
                        >
                          {l}
                        </span>
                      ))}
                      {rmInterests.slice(0, 2).map((i) => (
                        <span
                          key={i}
                          className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary/70"
                        >
                          {i}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                      <span className="text-[10px] text-white/30">
                        Voir le profil complet
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-white/20" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
              <div className="text-4xl">🏝️</div>
              <p className="text-sm font-medium text-white/50">
                Sois le premier a t&apos;installer !
              </p>
              <p className="text-xs text-white/30">
                Cette villa n&apos;a pas encore de residents
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User profile modal */}
      <UserProfileModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
