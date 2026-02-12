"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Heart,
  MessageSquare,
  MapPin,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Home,
  Users,
  BedDouble,
} from "lucide-react";
import Link from "next/link";

interface Villa {
  id: string;
  title: string;
  zone: string;
  pricePerMonth: number;
  priceEUR: number;
  availableRooms: number;
  totalRooms: number;
  photos: string;
  amenities: string;
  vibe: string;
  owner: { name: string };
}

interface Booking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  villa: {
    id: string;
    title: string;
    zone: string;
    photos: string;
    priceEUR: number;
    owner: { name: string };
  };
}

interface Match {
  id: string;
  score: number;
  status: string;
  user1: { id: string; name: string; nationality: string | null };
  user2: { id: string; name: string; nationality: string | null };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [suggestedVillas, setSuggestedVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [bookingsRes, matchesRes, villasRes] = await Promise.all([
          fetch(`/api/users/${user.id}/bookings`),
          fetch(`/api/users/${user.id}/matches`),
          fetch("/api/villas/suggested?limit=3"),
        ]);

        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (matchesRes.ok) setMatches(await matchesRes.json());
        if (villasRes.ok) setSuggestedVillas(await villasRes.json());
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const acceptedMatches = matches.filter((m) => m.status === "ACCEPTED");
  const avgScore =
    matches.length > 0
      ? Math.round(
          matches.reduce((acc, m) => acc + m.score, 0) / matches.length
        )
      : 0;

  const stats = [
    {
      label: "Reservations",
      value: confirmedBookings.length,
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Matchs",
      value: matches.length,
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      label: "Compatibles",
      value: acceptedMatches.length,
      icon: Users,
      color: "text-emerald",
      bg: "bg-emerald/10",
    },
    {
      label: "Score Moyen",
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  // Parse vibe profile preferred zones
  let preferredZones: string[] = [];
  if (user.vibeProfile?.preferredZones) {
    try {
      preferredZones = JSON.parse(user.vibeProfile.preferredZones);
    } catch {
      preferredZones = [];
    }
  }

  return (
    <DashboardLayout requiredType="COLOCATAIRE">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
          Bienvenue, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-white/40">
          Trouve ta prochaine colocation de reve a Bali
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card flex items-center gap-3 p-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Reservations */}
          <section className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <CalendarDays className="h-5 w-5 text-primary" />
                Mes Reservations
              </h2>
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              >
                Tout voir
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : confirmedBookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Home className="h-10 w-10 text-white/15" />
                <div>
                  <p className="text-sm font-medium text-white/50">
                    Pas encore de reservation
                  </p>
                  <p className="mt-1 text-xs text-white/30">
                    Explore les villas disponibles pour trouver ton chez-toi
                  </p>
                </div>
                <Link
                  href="/villas"
                  className="glow-button mt-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Trouver une villa
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {confirmedBookings.slice(0, 3).map((booking) => {
                  let photos: string[] = [];
                  try {
                    photos = JSON.parse(booking.villa.photos);
                  } catch {
                    photos = [];
                  }

                  return (
                    <Link
                      key={booking.id}
                      href={`/villas/${booking.villa.id}`}
                      className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      {/* Photo thumbnail */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                        {photos[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={photos[0]}
                            alt={booking.villa.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🏠
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {booking.villa.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-white/40">
                          <MapPin className="h-3 w-3" />
                          {booking.villa.zone} · {booking.villa.owner.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">
                            {booking.villa.priceEUR}€/mois
                          </span>
                          <span className="text-[10px] text-white/30">
                            Du{" "}
                            {new Date(booking.startDate).toLocaleDateString(
                              "fr-FR",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        </div>
                      </div>
                      <Badge className="border-emerald/30 bg-emerald/10 text-[10px] text-emerald">
                        Confirme
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Suggested Villas */}
          <section className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Sparkles className="h-5 w-5 text-primary" />
                Villas Suggerees
              </h2>
              <Link
                href="/villas"
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              >
                Tout voir
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : suggestedVillas.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">
                Aucune villa disponible pour le moment
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedVillas.map((villa) => {
                  let vibes: string[] = [];
                  try {
                    vibes = JSON.parse(villa.vibe);
                  } catch {
                    vibes = [];
                  }

                  return (
                    <Link
                      href={`/villas/${villa.id}`}
                      key={villa.id}
                      className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      {/* Villa card top */}
                      <div className="p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl transition-transform group-hover:scale-110">
                            🏡
                          </div>
                          <div className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            <BedDouble className="h-3 w-3" />
                            {villa.availableRooms} dispo
                          </div>
                        </div>
                        <h3 className="truncate text-sm font-semibold text-white group-hover:text-primary">
                          {villa.title}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                          <MapPin className="h-3 w-3" />
                          {villa.zone}
                        </p>

                        {/* Vibes */}
                        {vibes.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {vibes.slice(0, 2).map((v) => (
                              <span
                                key={v}
                                className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/40"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm font-bold text-primary">
                            {villa.priceEUR ?? 0}€
                            <span className="text-[10px] font-normal text-white/30">
                              /mois
                            </span>
                          </p>
                          <p className="text-[10px] text-white/30">
                            {villa.availableRooms}/{villa.totalRooms} dispo
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar - 1 col */}
        <div className="space-y-6">
          {/* Vibe Profile Summary */}
          {user.vibeProfile && (
            <section className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <TrendingUp className="h-5 w-5 text-primary" />
                Mon Profil Vibe
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: "Social",
                    value: user.vibeProfile.personalitySocial,
                  },
                  {
                    label: "Organise",
                    value: user.vibeProfile.personalityOrganized,
                  },
                  {
                    label: "Fete",
                    value: user.vibeProfile.personalityParty,
                  },
                  {
                    label: "Fitness",
                    value: user.vibeProfile.personalityFitness,
                  },
                  {
                    label: "Calme",
                    value: user.vibeProfile.personalityCalm,
                  },
                ].map((trait) => (
                  <div key={trait.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {trait.label}
                      </span>
                      <span className="text-xs font-medium text-white/70">
                        {trait.value}/10
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                        style={{ width: `${trait.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {preferredZones.length > 0 && (
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <p className="mb-2 text-xs text-white/40">Zones preferees</p>
                  <div className="flex flex-wrap gap-1">
                    {preferredZones.map((zone) => (
                      <Badge
                        key={zone}
                        className="border-primary/20 bg-primary/10 text-[10px] text-primary"
                      >
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Recent Matches */}
          <section className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Heart className="h-5 w-5 text-pink-400" />
                Matchs Recents
              </h2>
              <Link
                href="/dashboard/matches"
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              >
                Voir tout
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : matches.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Heart className="h-8 w-8 text-white/20" />
                <p className="text-sm text-white/40">
                  Aucun match pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.slice(0, 4).map((match) => {
                  const otherUser =
                    match.user1.id === user.id ? match.user2 : match.user1;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 text-xs font-bold text-pink-400">
                        {otherUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {otherUser.name}
                        </p>
                        <p className="text-[10px] text-white/30">
                          Score: {match.score}%
                        </p>
                      </div>
                      <Badge
                        className={`text-[10px] ${
                          match.status === "ACCEPTED"
                            ? "border-emerald/30 bg-emerald/10 text-emerald"
                            : match.status === "PENDING"
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                            : "border-white/10 bg-white/5 text-white/40"
                        }`}
                      >
                        {match.status === "ACCEPTED"
                          ? "Accepte"
                          : match.status === "PENDING"
                          ? "En attente"
                          : match.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Sparkles className="h-5 w-5 text-primary" />
              Actions Rapides
            </h2>
            <div className="space-y-2">
              <Link
                href="/villas"
                className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-white/70">Explorer les villas</span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20" />
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-white/70">Mes messages</span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20" />
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10">
                  <TrendingUp className="h-4 w-4 text-emerald" />
                </div>
                <span className="text-sm text-white/70">Mon profil vibe</span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
