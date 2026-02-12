"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  calculateVibeScore,
  getMatchDetails,
  getScoreColor,
  getScoreRingColor,
  type VibeProfileData,
} from "@/lib/matching";

interface UserData {
  id: string;
  name: string;
  avatar: string | null;
  nationality: string | null;
  age: number | null;
  languages: string;
  verified: boolean;
  badges: string;
  vibeProfile: VibeProfileData & {
    bio: string | null;
    preferredZones: string;
    workStyle: string | null;
    schedule: string | null;
    smokingOk: boolean;
    petsOk: boolean;
    veganOk: boolean;
  } | null;
}

interface UserProfileModalProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
}

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
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 4;
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
      <span
        className={`absolute text-lg font-bold ${textColor}`}
      >
        {score}%
      </span>
    </div>
  );
}

export default function UserProfileModal({
  user: profileUser,
  open,
  onClose,
}: UserProfileModalProps) {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [sendingMsg, setSendingMsg] = useState(false);

  if (!profileUser) return null;

  let languages: string[] = [];
  let badges: string[] = [];
  let interests: string[] = [];
  let lifestyle: string[] = [];
  let zones: string[] = [];

  try {
    languages = JSON.parse(profileUser.languages);
  } catch {
    languages = [];
  }
  try {
    badges = JSON.parse(profileUser.badges);
  } catch {
    badges = [];
  }

  if (profileUser.vibeProfile) {
    try {
      interests = JSON.parse(profileUser.vibeProfile.interests);
    } catch {
      interests = [];
    }
    try {
      lifestyle = JSON.parse(profileUser.vibeProfile.lifestyle);
    } catch {
      lifestyle = [];
    }
    try {
      zones = JSON.parse(profileUser.vibeProfile.preferredZones);
    } catch {
      zones = [];
    }
  }

  // Calculate compatibility
  const score =
    currentUser?.vibeProfile && profileUser.vibeProfile
      ? calculateVibeScore(currentUser.vibeProfile, profileUser.vibeProfile)
      : 0;

  const matchDetails =
    currentUser?.vibeProfile && profileUser.vibeProfile
      ? getMatchDetails(currentUser.vibeProfile, profileUser.vibeProfile)
      : null;

  const personalityTraits = profileUser.vibeProfile
    ? [
        { label: "Social", value: profileUser.vibeProfile.personalitySocial },
        { label: "Organise", value: profileUser.vibeProfile.personalityOrganized },
        { label: "Fetard", value: profileUser.vibeProfile.personalityParty },
        { label: "Sportif", value: profileUser.vibeProfile.personalityFitness },
        { label: "Calme", value: profileUser.vibeProfile.personalityCalm },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-white/[0.08] bg-surface p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Profil de {profileUser.name}</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative border-b border-white/[0.06] p-6 pt-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">
                {getInitials(profileUser.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {profileUser.name}
                </h2>
                {profileUser.verified && (
                  <span className="text-emerald text-sm">✓</span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
                {profileUser.age && <span>{profileUser.age} ans</span>}
                {profileUser.nationality && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profileUser.nationality}
                  </span>
                )}
              </div>
              {languages.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-white/30">
                  <Globe className="h-3 w-3" />
                  {languages.join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <Badge
                  key={b}
                  className="border-primary/20 bg-primary/10 text-[10px] text-primary"
                >
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        {profileUser.vibeProfile?.bio && (
          <div className="border-b border-white/[0.06] p-6">
            <p className="text-sm leading-relaxed text-white/60">
              {profileUser.vibeProfile.bio}
            </p>
          </div>
        )}

        {/* Vibes */}
        {profileUser.vibeProfile && (
          <div className="border-b border-white/[0.06] p-6">
            {interests.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Centres d&apos;interet
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {lifestyle.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Lifestyle
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {lifestyle.map((l) => (
                    <span
                      key={l}
                      className="rounded-md border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 text-xs text-white/60"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {zones.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Zones preferees
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {zones.map((z) => (
                    <span
                      key={z}
                      className="rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs text-accent"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personality */}
        {personalityTraits.length > 0 && (
          <div className="border-b border-white/[0.06] p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              Personnalite
            </h3>
            <div className="space-y-2.5">
              {personalityTraits.map((trait) => (
                <div key={trait.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-white/50">{trait.label}</span>
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
          </div>
        )}

        {/* Compatibility */}
        {currentUser?.vibeProfile && profileUser.vibeProfile && currentUser.id !== profileUser.id && (
          <div className="border-b border-white/[0.06] p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
              Notre compatibilite
            </h3>
            <div className="flex items-center gap-6">
              <ScoreCircle score={score} />
              <div className="flex-1 space-y-2">
                {matchDetails && matchDetails.commonInterests.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-emerald">
                      Vous partagez
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {matchDetails.commonInterests.map((i) => (
                        <span
                          key={i}
                          className="rounded bg-emerald/10 px-1.5 py-0.5 text-[10px] text-emerald"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {matchDetails && matchDetails.differences.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-yellow-400">
                      Vos differences
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {matchDetails.differences.map((d) => (
                        <span
                          key={d}
                          className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-[10px] text-yellow-400"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6">
          <button
            disabled={sendingMsg || !currentUser}
            onClick={async () => {
              if (!currentUser) return;
              setSendingMsg(true);
              try {
                await fetch("/api/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    senderId: currentUser.id,
                    receiverId: profileUser.id,
                    content: `Salut ${profileUser.name.split(" ")[0]} ! J'ai vu qu'on etait compatibles, j'aimerais en discuter !`,
                  }),
                });
                onClose();
                router.push("/messages");
              } catch (err) {
                console.error("Error sending message:", err);
              } finally {
                setSendingMsg(false);
              }
            }}
            className="glow-button flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {sendingMsg ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            {sendingMsg ? "Envoi..." : "Envoyer un message"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
