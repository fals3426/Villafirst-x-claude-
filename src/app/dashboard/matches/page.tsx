"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import UserProfileModal from "@/components/UserProfileModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Users,
  MapPin,
  MessageSquare,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import {
  calculateVibeScore,
  getScoreColor,
  getScoreRingColor,
  type VibeProfileData,
} from "@/lib/matching";

interface VibeProfileFull extends VibeProfileData {
  bio: string | null;
  preferredZones: string;
  workStyle: string | null;
  schedule: string | null;
  smokingOk: boolean;
  petsOk: boolean;
  veganOk: boolean;
}

interface MatchUser {
  id: string;
  name: string;
  avatar: string | null;
  nationality: string | null;
  age: number | null;
  languages: string;
  verified: boolean;
  badges: string;
  vibeProfile: VibeProfileFull | null;
}

interface MatchVilla {
  id: string;
  title: string;
  zone: string;
  photos: string;
}

interface Match {
  id: string;
  score: number;
  status: string;
  user1: MatchUser;
  user2: MatchUser;
  villa: MatchVilla | null;
}

type ScoreFilter = "all" | "80" | "60";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
  const colorClass = getScoreRingColor(score);
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
          className={colorClass}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${textColor}`}>
        {score}%
      </span>
    </div>
  );
}

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MatchUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/matches`);
        if (res.ok) {
          setMatches(await res.json());
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  // Recalculate scores using vibeProfile for more accuracy
  const enrichedMatches = useMemo(() => {
    if (!user) return [];

    return matches.map((match) => {
      const otherUser =
        match.user1.id === user.id ? match.user2 : match.user1;

      // Recalculate live score if both have vibeProfile
      const liveScore =
        user.vibeProfile && otherUser.vibeProfile
          ? calculateVibeScore(user.vibeProfile, otherUser.vibeProfile)
          : match.score;

      return { ...match, otherUser, liveScore };
    });
  }, [matches, user]);

  // Apply filter
  const filteredMatches = useMemo(() => {
    if (scoreFilter === "80")
      return enrichedMatches.filter((m) => m.liveScore >= 80);
    if (scoreFilter === "60")
      return enrichedMatches.filter((m) => m.liveScore >= 60);
    return enrichedMatches;
  }, [enrichedMatches, scoreFilter]);

  // Group by villa
  const groupedByVilla = useMemo(() => {
    const groups: Record<
      string,
      { villa: MatchVilla | null; matches: typeof filteredMatches }
    > = {};

    for (const match of filteredMatches) {
      const key = match.villa?.id ?? "no-villa";
      if (!groups[key]) {
        groups[key] = { villa: match.villa, matches: [] };
      }
      groups[key].matches.push(match);
    }

    return Object.values(groups);
  }, [filteredMatches]);

  if (!user) return null;

  const filterLabels: Record<ScoreFilter, string> = {
    all: "Tous les matchs",
    "80": "Score > 80%",
    "60": "Score > 60%",
  };

  return (
    <DashboardLayout requiredType="COLOCATAIRE">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
              Mes Matchs
            </h1>
            <p className="mt-1 text-white/40">
              {loading
                ? "Chargement..."
                : `${filteredMatches.length} match${filteredMatches.length !== 1 ? "s" : ""} trouves`}
            </p>
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition-all hover:border-primary/30 hover:bg-white/[0.06]"
            >
              <Filter className="h-4 w-4 text-primary" />
              {filterLabels[scoreFilter]}
              <ChevronDown
                className={`h-4 w-4 text-white/30 transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {filterOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setFilterOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-surface shadow-xl">
                  {(["all", "80", "60"] as ScoreFilter[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setScoreFilter(key);
                        setFilterOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        scoreFilter === key
                          ? "bg-primary/10 text-primary"
                          : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {filterLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredMatches.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <Users className="h-10 w-10 text-white/20" />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-white">
            Aucun match pour le moment
          </h2>
          <p className="mb-6 max-w-sm text-center text-sm text-white/40">
            Explore les villas pour trouver des colocs compatibles
          </p>
          <Link
            href="/villas"
            className="glow-button flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
            Rechercher des villas
          </Link>
        </div>
      ) : (
        /* Matches grouped by villa */
        <div className="space-y-8">
          {groupedByVilla.map((group, groupIndex) => (
            <section key={group.villa?.id ?? groupIndex}>
              {/* Villa header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  🏡
                </div>
                <div className="min-w-0 flex-1">
                  {group.villa ? (
                    <Link
                      href={`/villas/${group.villa.id}`}
                      className="group flex items-center gap-2"
                    >
                      <h2 className="truncate text-lg font-semibold text-white transition-colors group-hover:text-primary">
                        {group.villa.title}
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="text-lg font-semibold text-white">
                      Matchs generaux
                    </h2>
                  )}
                  {group.villa && (
                    <p className="flex items-center gap-1 text-xs text-white/40">
                      <MapPin className="h-3 w-3" />
                      {group.villa.zone}
                    </p>
                  )}
                </div>
                <Badge className="border-white/[0.08] bg-white/[0.04] text-xs text-white/50">
                  {group.matches.length} match
                  {group.matches.length > 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Match cards grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.matches.map((match) => {
                  const other = match.otherUser;

                  return (
                    <div
                      key={match.id}
                      className="glass-card group overflow-hidden p-0 transition-all hover:border-primary/20"
                    >
                      {/* Card header with score */}
                      <div className="flex items-center gap-4 border-b border-white/[0.06] p-5">
                        <Avatar className="h-14 w-14 border-2 border-primary/20 transition-all group-hover:border-primary/40">
                          <AvatarFallback className="bg-primary/15 text-base font-bold text-primary">
                            {getInitials(other.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-white">
                            {other.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                            {other.age && <span>{other.age} ans</span>}
                            {other.nationality && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {other.nationality}
                              </span>
                            )}
                          </div>
                        </div>
                        <ScoreCircle score={match.liveScore} />
                      </div>

                      {/* Villa commune */}
                      {group.villa && (
                        <div className="border-b border-white/[0.06] px-5 py-3">
                          <p className="flex items-center gap-1.5 text-xs text-white/30">
                            <Heart className="h-3 w-3 text-pink-400" />
                            Villa commune :{" "}
                            <span className="font-medium text-white/50">
                              {group.villa.title}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="border-b border-white/[0.06] px-5 py-3">
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

                      {/* Actions */}
                      <div className="flex gap-2 p-4">
                        <button
                          onClick={() => {
                            setSelectedUser(other);
                            setModalOpen(true);
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-white/60 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                        >
                          <Users className="h-3.5 w-3.5" />
                          Voir le profil
                        </button>
                        <Link
                          href="/messages"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/20"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Message
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </DashboardLayout>
  );
}
