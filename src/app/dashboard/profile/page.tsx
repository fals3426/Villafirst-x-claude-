"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import UserProfileModal from "@/components/UserProfileModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Save,
  Sparkles,
  Eye,
  Check,
  Loader2,
  MapPin,
  Globe,
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────

const LANGUAGES_OPTIONS = [
  "English",
  "Français",
  "Español",
  "中文",
  "Bahasa Indonesia",
  "Deutsch",
  "Italiano",
  "Português",
  "日本語",
  "한국어",
  "Русский",
  "العربية",
];

const ZONES = ["Canggu", "Ubud", "Seminyak", "Sanur", "Uluwatu", "Berawa"];

const INTERESTS = [
  "Surf",
  "Yoga",
  "Coworking",
  "Beach clubs",
  "Meditation",
  "Hiking",
  "Photography",
  "Coding",
  "Cooking",
  "Gym",
  "Running",
  "Nightlife",
  "Networking",
  "Startups",
  "Nature",
  "Content creation",
  "Scooter trips",
  "Breathwork",
  "Beach volleyball",
  "Meal prep",
];

const LIFESTYLES = [
  "Digital Nomad",
  "Entrepreneur",
  "Yoga",
  "Wellness",
  "Fitness",
  "Content Creator",
  "Party",
  "Beach",
  "Calm",
  "Social",
  "Tech",
  "Balanced",
  "Explorer",
  "Healthy",
];

const DURATIONS = [
  "1 month",
  "2 months",
  "3 months",
  "4 months",
  "6 months",
  "12 months",
];

const PERSONALITY_TRAITS = [
  { key: "personalitySocial", label: "Social", emoji: "🗣️" },
  { key: "personalityOrganized", label: "Organise", emoji: "📋" },
  { key: "personalityParty", label: "Fetard", emoji: "🎉" },
  { key: "personalityFitness", label: "Sportif", emoji: "💪" },
  { key: "personalityCalm", label: "Calme", emoji: "🧘" },
] as const;

// ─── Helpers ───────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function safeJsonParse<T>(str: string | undefined | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// ─── Toggle chip component ────────────────────────────

function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
        selected
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Save button component ────────────────────────────

function SaveButton({
  saving,
  saved,
  onClick,
  label,
}: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="glow-button flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
    >
      {saving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <Check className="h-4 w-4" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {saving ? "Sauvegarde..." : saved ? "Sauvegarde !" : label}
    </button>
  );
}

// ─── Main page ─────────────────────────────────────────

export default function ProfilePage() {
  const { user, loginById } = useAuth();

  // Personal info state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savedPersonal, setSavedPersonal] = useState(false);

  // Vibe profile state
  const [budget, setBudget] = useState(400);
  const [duration, setDuration] = useState("3 months");
  const [zones, setZones] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [personalitySocial, setPersonalitySocial] = useState(5);
  const [personalityOrganized, setPersonalityOrganized] = useState(5);
  const [personalityParty, setPersonalityParty] = useState(5);
  const [personalityFitness, setPersonalityFitness] = useState(5);
  const [personalityCalm, setPersonalityCalm] = useState(5);
  const [bio, setBio] = useState("");
  const [savingVibe, setSavingVibe] = useState(false);
  const [savedVibe, setSavedVibe] = useState(false);

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // Initialize from user context
  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setAge(user.age?.toString() ?? "");
    setNationality(user.nationality ?? "");
    setLanguages(safeJsonParse(user.languages, []));

    if (user.vibeProfile) {
      const vp = user.vibeProfile;
      // Parse budget - extract EUR value
      const budgetMatch = vp.budget?.match(/(\d+)/);
      setBudget(budgetMatch ? parseInt(budgetMatch[1]) : 400);
      setDuration(vp.duration ?? "3 months");
      setZones(safeJsonParse(vp.preferredZones, []));
      setInterests(safeJsonParse(vp.interests, []));
      setLifestyle(safeJsonParse(vp.lifestyle, []));
      setPersonalitySocial(vp.personalitySocial);
      setPersonalityOrganized(vp.personalityOrganized);
      setPersonalityParty(vp.personalityParty);
      setPersonalityFitness(vp.personalityFitness);
      setPersonalityCalm(vp.personalityCalm);
      setBio(vp.bio ?? "");
    }
  }, [user]);

  const toggleArray = useCallback(
    (arr: string[], item: string, setter: (v: string[]) => void) => {
      if (arr.includes(item)) {
        setter(arr.filter((i) => i !== item));
      } else {
        setter([...arr, item]);
      }
    },
    []
  );

  const handleSavePersonal = async () => {
    if (!user) return;
    setSavingPersonal(true);
    setSavedPersonal(false);

    try {
      await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: age ? parseInt(age) : null,
          nationality: nationality || null,
          languages: JSON.stringify(languages),
        }),
      });

      // Refresh user context
      await loginById(user.id);
      setSavedPersonal(true);
      setTimeout(() => setSavedPersonal(false), 2000);
    } catch (err) {
      console.error("Error saving personal info:", err);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveVibe = async () => {
    if (!user) return;
    setSavingVibe(true);
    setSavedVibe(false);

    try {
      await fetch(`/api/users/${user.id}/vibe-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: `${budget} EUR`,
          duration,
          preferredZones: JSON.stringify(zones),
          interests: JSON.stringify(interests),
          lifestyle: JSON.stringify(lifestyle),
          personalitySocial,
          personalityOrganized,
          personalityParty,
          personalityFitness,
          personalityCalm,
          bio: bio || null,
        }),
      });

      await loginById(user.id);
      setSavedVibe(true);
      setTimeout(() => setSavedVibe(false), 2000);
    } catch (err) {
      console.error("Error saving vibe profile:", err);
    } finally {
      setSavingVibe(false);
    }
  };

  // Build preview user data for modal
  const previewUser = user
    ? {
        id: user.id,
        name,
        avatar: user.avatar,
        nationality: nationality || null,
        age: age ? parseInt(age) : null,
        languages: JSON.stringify(languages),
        verified: user.verified,
        badges: user.badges,
        vibeProfile: {
          interests: JSON.stringify(interests),
          lifestyle: JSON.stringify(lifestyle),
          personalitySocial,
          personalityOrganized,
          personalityParty,
          personalityFitness,
          personalityCalm,
          bio: bio || null,
          preferredZones: JSON.stringify(zones),
          workStyle: user.vibeProfile?.workStyle ?? null,
          schedule: user.vibeProfile?.schedule ?? null,
          smokingOk: user.vibeProfile?.smokingOk ?? false,
          petsOk: user.vibeProfile?.petsOk ?? true,
          veganOk: user.vibeProfile?.veganOk ?? true,
        },
      }
    : null;

  if (!user) return null;

  const personalitySetters: Record<string, (v: number) => void> = {
    personalitySocial: setPersonalitySocial,
    personalityOrganized: setPersonalityOrganized,
    personalityParty: setPersonalityParty,
    personalityFitness: setPersonalityFitness,
    personalityCalm: setPersonalityCalm,
  };

  const personalityValues: Record<string, number> = {
    personalitySocial,
    personalityOrganized,
    personalityParty,
    personalityFitness,
    personalityCalm,
  };

  return (
    <DashboardLayout requiredType="COLOCATAIRE">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
            Mon Profil
          </h1>
          <p className="mt-1 text-white/40">
            Gere tes informations et ton profil vibe
          </p>
        </div>
        <button
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition-all hover:border-primary/30 hover:bg-white/[0.06]"
        >
          <Eye className="h-4 w-4 text-primary" />
          Voir mon profil public
        </button>
      </div>

      <div className="space-y-8">
        {/* ─── SECTION 1: Informations personnelles ──── */}
        <section className="glass-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Informations personnelles
              </h2>
              <p className="text-xs text-white/40">
                Tes informations de base visibles par les autres
              </p>
            </div>
          </div>

          {/* Avatar + name row */}
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary">
                {getInitials(name || user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-white">{name || user.name}</p>
              <p className="text-xs text-white/40">Photo de profil en V2</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Nom complet
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton nom"
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-primary/40"
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Age
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                min={18}
                max={99}
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-primary/40"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Nationalite
              </label>
              <Input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="France"
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-primary/40"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="mt-5">
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
              <Globe className="h-3 w-3" />
              Langues parlees
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_OPTIONS.map((lang) => (
                <ToggleChip
                  key={lang}
                  label={lang}
                  selected={languages.includes(lang)}
                  onToggle={() => toggleArray(languages, lang, setLanguages)}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="mt-6 flex justify-end">
            <SaveButton
              saving={savingPersonal}
              saved={savedPersonal}
              onClick={handleSavePersonal}
              label="Sauvegarder"
            />
          </div>
        </section>

        {/* ─── SECTION 2: Profil Vibes ──────────────── */}
        <section className="glass-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Mon Profil Vibes
              </h2>
              <p className="text-xs text-white/40">
                Definis ton vibe pour trouver des colocs compatibles
              </p>
            </div>
          </div>

          {/* Budget slider */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-white/50">
                Budget mensuel
              </label>
              <span className="text-sm font-bold text-primary">{budget}€/mois</span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={(v) => setBudget(v[0])}
              min={200}
              max={800}
              step={25}
            />
            <div className="mt-1 flex justify-between text-[10px] text-white/25">
              <span>200€</span>
              <span>800€</span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-white/50">
              Duree souhaitee
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    duration === d
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Zones */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
              <MapPin className="h-3 w-3" />
              Zones preferees
            </label>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((zone) => (
                <ToggleChip
                  key={zone}
                  label={zone}
                  selected={zones.includes(zone)}
                  onToggle={() => toggleArray(zones, zone, setZones)}
                />
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-white/50">
              Centres d&apos;interet
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  selected={interests.includes(item)}
                  onToggle={() => toggleArray(interests, item, setInterests)}
                />
              ))}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-white/50">
              Lifestyle
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFESTYLES.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  selected={lifestyle.includes(item)}
                  onToggle={() => toggleArray(lifestyle, item, setLifestyle)}
                />
              ))}
            </div>
          </div>

          {/* Personality sliders */}
          <div className="mb-6">
            <label className="mb-4 block text-xs font-medium text-white/50">
              Personnalite
            </label>
            <div className="space-y-5">
              {PERSONALITY_TRAITS.map((trait) => (
                <div key={trait.key}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-white/60">
                      <span>{trait.emoji}</span>
                      {trait.label}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {personalityValues[trait.key]}/10
                    </span>
                  </div>
                  <Slider
                    value={[personalityValues[trait.key]]}
                    onValueChange={(v) => personalitySetters[trait.key](v[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parle de toi, de ce que tu recherches, de ton mode de vie..."
              rows={4}
              className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-primary/40"
            />
            <p className="mt-1 text-right text-[10px] text-white/25">
              {bio.length}/500
            </p>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <SaveButton
              saving={savingVibe}
              saved={savedVibe}
              onClick={handleSaveVibe}
              label="Sauvegarder mes vibes"
            />
          </div>
        </section>

        {/* ─── SECTION 3: Preview ───────────────────── */}
        <section className="glass-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Comment les autres me voient
              </h2>
              <p className="text-xs text-white/40">
                Apercu de ton profil tel qu&apos;il apparait aux autres utilisateurs
              </p>
            </div>
          </div>

          {/* Mini preview card */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/20 text-xl font-bold text-primary">
                  {getInitials(name || user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-white">
                    {name || user.name}
                  </p>
                  {user.verified && (
                    <span className="text-sm text-emerald">✓</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-sm text-white/40">
                  {age && <span>{age} ans</span>}
                  {nationality && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {nationality}
                    </span>
                  )}
                </div>
                {languages.length > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-white/30">
                    <Globe className="h-3 w-3" />
                    {languages.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Tags preview */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {zones.map((z) => (
                <Badge
                  key={z}
                  className="border-primary/20 bg-primary/10 text-[10px] text-primary"
                >
                  {z}
                </Badge>
              ))}
              {interests.slice(0, 4).map((i) => (
                <Badge
                  key={i}
                  className="border-white/[0.1] bg-white/[0.05] text-[10px] text-white/50"
                >
                  {i}
                </Badge>
              ))}
              {interests.length > 4 && (
                <Badge className="border-white/[0.1] bg-white/[0.05] text-[10px] text-white/30">
                  +{interests.length - 4}
                </Badge>
              )}
            </div>

            {/* Personality bars mini */}
            {(personalitySocial > 0 || personalityOrganized > 0) && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {PERSONALITY_TRAITS.map((trait) => (
                  <div key={trait.key} className="text-center">
                    <div className="text-lg">{trait.emoji}</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${personalityValues[trait.key] * 10}%`,
                        }}
                      />
                    </div>
                    <p className="mt-0.5 text-[9px] text-white/30">
                      {personalityValues[trait.key]}/10
                    </p>
                  </div>
                ))}
              </div>
            )}

            {bio && (
              <p className="mt-4 border-t border-white/[0.06] pt-4 text-sm text-white/50">
                {bio.length > 150 ? bio.slice(0, 150) + "..." : bio}
              </p>
            )}

            <button
              onClick={() => setPreviewOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 text-xs font-medium text-white/50 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Eye className="h-3.5 w-3.5" />
              Voir le profil complet
            </button>
          </div>
        </section>
      </div>

      {/* Full preview modal */}
      <UserProfileModal
        user={previewUser}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </DashboardLayout>
  );
}
