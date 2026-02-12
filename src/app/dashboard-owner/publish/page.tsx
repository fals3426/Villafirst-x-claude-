"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Check,
  Zap,
  Loader2,
  Sparkles,
  MapPin,
  BedDouble,
  Bath,
} from "lucide-react";

const ZONES = [
  "Canggu",
  "Ubud",
  "Seminyak",
  "Sanur",
  "Uluwatu",
  "Berawa",
  "Pererenan",
];

const AMENITIES = [
  { label: "WiFi Haut Debit", icon: "📶" },
  { label: "Piscine", icon: "🏊" },
  { label: "Cuisine Equipee", icon: "🍳" },
  { label: "Espace Coworking", icon: "💻" },
  { label: "Parking", icon: "🚗" },
  { label: "Machine a Laver", icon: "🧺" },
  { label: "Climatisation", icon: "❄️" },
  { label: "Eau Chaude", icon: "🚿" },
  { label: "Securite 24/7", icon: "🔒" },
  { label: "Jardin", icon: "🌿" },
  { label: "Salle de Sport", icon: "💪" },
  { label: "BBQ", icon: "🔥" },
  { label: "Yoga Shala", icon: "🧘" },
  { label: "Surf Board Storage", icon: "🏄" },
  { label: "Rooftop", icon: "🌅" },
  { label: "Smart TV", icon: "📺" },
];

const VIBES = [
  { label: "Surf", emoji: "🏄" },
  { label: "Yoga", emoji: "🧘" },
  { label: "Party", emoji: "🎉" },
  { label: "Digital Nomad", emoji: "💻" },
  { label: "Wellness", emoji: "🌿" },
  { label: "Entrepreneur", emoji: "🚀" },
  { label: "Calm", emoji: "🧘‍♂️" },
  { label: "Beach clubs", emoji: "🍹" },
  { label: "Nature", emoji: "🌳" },
  { label: "Social", emoji: "🤝" },
  { label: "Luxury", emoji: "✨" },
  { label: "Budget-friendly", emoji: "💰" },
];

export default function PublishVillaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedVilla, setPublishedVilla] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    zone: "Canggu",
    exactLocation: "",
    description: "",
    priceEUR: 400,
    deposit: 400,
    totalRooms: 4,
    availableRooms: 4,
    bathrooms: 2,
    amenities: [] as string[],
    vibe: [] as string[],
    minimumStay: "1 mois",
    photos: [
      "/placeholder-villa.jpg",
      "/placeholder-villa.jpg",
      "/placeholder-villa.jpg",
    ],
  });

  const totalSteps = 5;

  function updateField(field: string, value: string | number | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field: "amenities" | "vibe", item: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return formData.title.length >= 5 && formData.description.length >= 20;
      case 2:
        return formData.priceEUR >= 100;
      case 3:
        return formData.amenities.length >= 2 && formData.vibe.length >= 1;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);

    try {
      const res = await fetch("/api/villas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerId: user.id,
          pricePerMonth: formData.priceEUR * 17000,
          priceUSD: Math.round(formData.priceEUR * 1.08),
          latitude: -8.6481,
          longitude: 115.1366,
        }),
      });

      const villa = await res.json();

      if (res.ok) {
        setPublishedVilla({ id: villa.id, title: villa.title });
        setPublished(true);
      } else {
        alert("Erreur lors de la publication: " + villa.error);
      }
    } catch (error) {
      console.error("Error publishing villa:", error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  // Access guard
  if (!user || user.type !== "PROPRIETAIRE") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <Home className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Acces reserve aux proprietaires
          </h2>
          <p className="mb-6 text-sm text-foreground-secondary">
            Connectez-vous en tant que proprietaire pour publier une villa.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (published && publishedVilla) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="glass-card max-w-lg p-8 text-center">
          {/* Success animation */}
          <div className="relative mx-auto mb-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/30">
                <Check className="h-8 w-8 text-emerald" />
              </div>
            </div>
            <div className="absolute -right-2 -top-2">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-display font-bold text-foreground">
            Villa publiee avec succes ! 🎉
          </h2>
          <p className="mb-2 text-lg font-semibold text-primary">
            {publishedVilla.title}
          </p>
          <p className="mb-8 text-sm text-foreground-secondary">
            Votre annonce est maintenant visible par tous les colocataires.
            Elle sera verifiee par notre equipe sous 24h.
          </p>

          <div className="mb-6 space-y-3 rounded-xl bg-white/[0.03] p-4 text-left">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10">
                <Check className="h-4 w-4 text-emerald" />
              </div>
              <span className="text-foreground-secondary">
                Annonce visible immediatement
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
                <Loader2 className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-foreground-secondary">
                Verification en cours (24-48h)
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground-secondary">
                Badge &quot;Verified Villa&quot; apres verification
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/villas/${publishedVilla.id}`)}
              className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.05]"
            >
              Voir l&apos;annonce
            </button>
            <button
              onClick={() => router.push("/dashboard-owner")}
              className="glow-button flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Mon Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-surface/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            {step > 1 ? "Etape precedente" : "Retour"}
          </button>
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Sparkles className="h-4 w-4 text-primary" />
            Etape {step}/{totalSteps}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 lg:py-12">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              Publier ma villa
            </h1>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < step
                    ? "bg-primary"
                    : i === step
                    ? "bg-primary/40"
                    : "bg-white/[0.06]"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-foreground-secondary">
            <span className={step >= 1 ? "text-primary" : ""}>Infos</span>
            <span className={step >= 2 ? "text-primary" : ""}>Prix</span>
            <span className={step >= 3 ? "text-primary" : ""}>Equipements</span>
            <span className={step >= 4 ? "text-primary" : ""}>Photos</span>
            <span className={step >= 5 ? "text-primary" : ""}>Recap</span>
          </div>
        </div>

        {/* Step 1: Informations de base */}
        {step === 1 && (
          <div className="glass-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Informations de base
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Decrivez votre villa pour attirer les meilleurs colocataires
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm text-foreground-secondary">
                  Titre de l&apos;annonce *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ex: Villa moderne avec piscine a Canggu"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder-foreground-secondary/50 transition-colors focus:border-primary focus:outline-none"
                />
                {formData.title.length > 0 && formData.title.length < 5 && (
                  <p className="mt-1 text-xs text-red-400">
                    Le titre doit faire au moins 5 caracteres
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-foreground-secondary">
                    <MapPin className="h-4 w-4" />
                    Zone *
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => updateField("zone", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                  >
                    {ZONES.map((zone) => (
                      <option key={zone} value={zone} className="bg-surface">
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground-secondary">
                    Adresse complete
                  </label>
                  <input
                    type="text"
                    value={formData.exactLocation}
                    onChange={(e) =>
                      updateField("exactLocation", e.target.value)
                    }
                    placeholder="Ex: Jl. Batu Bolong 123"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder-foreground-secondary/50 transition-colors focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-foreground-secondary">
                  Description de la villa *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={5}
                  placeholder="Decris ta villa : localisation, ambiance, points forts, ce qui la rend unique..."
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder-foreground-secondary/50 transition-colors focus:border-primary focus:outline-none"
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span
                    className={
                      formData.description.length >= 20
                        ? "text-emerald"
                        : "text-foreground-secondary"
                    }
                  >
                    {formData.description.length >= 20
                      ? "✓ Bonne description"
                      : `${formData.description.length}/20 caracteres minimum`}
                  </span>
                  <span className="text-foreground-secondary">
                    {formData.description.length} caracteres
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-foreground-secondary">
                    <BedDouble className="h-4 w-4" />
                    Chambres totales *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.totalRooms}
                    onChange={(e) =>
                      updateField("totalRooms", parseInt(e.target.value) || 1)
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-foreground-secondary">
                    <BedDouble className="h-4 w-4" />
                    Chambres disponibles *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.totalRooms}
                    value={formData.availableRooms}
                    onChange={(e) =>
                      updateField(
                        "availableRooms",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-foreground-secondary">
                    <Bath className="h-4 w-4" />
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      updateField("bathrooms", parseInt(e.target.value) || 1)
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tarification */}
        {step === 2 && (
          <div className="glass-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Tarification
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Definissez le prix et les conditions de location
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm text-foreground-secondary">
                  Prix par chambre par mois (EUR) *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                    €
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    step="10"
                    value={formData.priceEUR}
                    onChange={(e) =>
                      updateField("priceEUR", parseInt(e.target.value) || 100)
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-2xl font-bold text-foreground transition-colors focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-sm text-foreground-secondary">
                  ≈{" "}
                  {(formData.priceEUR * 17000).toLocaleString()} IDR{" · "}≈ $
                  {Math.round(formData.priceEUR * 1.08)} USD
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-foreground-secondary">
                  Depot de garantie (EUR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.deposit}
                  onChange={(e) =>
                    updateField("deposit", parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-xs text-foreground-secondary">
                  Generalement equivalent a 1 mois de loyer
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-foreground-secondary">
                  Duree minimum de location
                </label>
                <select
                  value={formData.minimumStay}
                  onChange={(e) => updateField("minimumStay", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none"
                >
                  <option value="1 mois" className="bg-surface">
                    1 mois
                  </option>
                  <option value="2 mois" className="bg-surface">
                    2 mois
                  </option>
                  <option value="3 mois" className="bg-surface">
                    3 mois
                  </option>
                  <option value="6 mois" className="bg-surface">
                    6 mois
                  </option>
                  <option value="1 an" className="bg-surface">
                    1 an
                  </option>
                </select>
              </div>

              {/* Revenue summary */}
              <div className="gradient-border rounded-xl">
                <div className="rounded-xl bg-background/80 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Estimation des revenus
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground-secondary">
                        {formData.availableRooms} chambre(s) × €
                        {formData.priceEUR}/mois
                      </span>
                      <span className="font-bold text-primary">
                        €{formData.availableRooms * formData.priceEUR}/mois
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground-secondary">
                        Revenus annuels potentiels
                      </span>
                      <span className="font-bold text-primary">
                        €
                        {(
                          formData.availableRooms *
                          formData.priceEUR *
                          12
                        ).toLocaleString()}
                        /an
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Equipements & Vibes */}
        {step === 3 && (
          <div className="glass-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Equipements & Vibes
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Selectionnez au moins 2 equipements et 1 vibe
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Amenities */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  Equipements disponibles
                  <span className="text-xs font-normal text-foreground-secondary">
                    ({formData.amenities.length} selectionne
                    {formData.amenities.length > 1 ? "s" : ""})
                  </span>
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity.label}
                      onClick={() =>
                        toggleArrayItem("amenities", amenity.label)
                      }
                      className={`flex items-center gap-2 rounded-lg border-2 px-3 py-3 text-left text-sm transition-all ${
                        formData.amenities.includes(amenity.label)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/[0.06] text-foreground-secondary hover:border-primary/30"
                      }`}
                    >
                      <span className="text-lg">{amenity.icon}</span>
                      <span className="flex-1">{amenity.label}</span>
                      {formData.amenities.includes(amenity.label) && (
                        <Check className="h-4 w-4 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibes */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  Vibe de la villa
                  <span className="text-xs font-normal text-foreground-secondary">
                    ({formData.vibe.length} selectionnee
                    {formData.vibe.length > 1 ? "s" : ""})
                  </span>
                </h3>
                <p className="mb-4 text-sm text-foreground-secondary">
                  Quelle ambiance correspond a ta villa ? Les colocataires
                  filtrent par vibe !
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {VIBES.map((vibe) => (
                    <button
                      key={vibe.label}
                      onClick={() => toggleArrayItem("vibe", vibe.label)}
                      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm transition-all ${
                        formData.vibe.includes(vibe.label)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/[0.06] text-foreground-secondary hover:border-primary/30"
                      }`}
                    >
                      <span className="text-lg">{vibe.emoji}</span>
                      <span>{vibe.label}</span>
                      {formData.vibe.includes(vibe.label) && (
                        <Check className="h-4 w-4 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div className="glass-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Photos de la villa
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Ajoutez des photos pour attirer plus de colocataires
                </p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
              <ImageIcon className="mx-auto mb-4 h-16 w-16 text-primary/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Mode Demonstration
              </h3>
              <p className="mb-6 text-sm text-foreground-secondary">
                L&apos;upload de photos sera disponible dans la version finale.
                <br />
                Pour cette demo, des images placeholder seront utilisees.
              </p>
              <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
                {formData.photos.map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-video items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-1 h-8 w-8 text-white/20" />
                      <span className="text-xs text-foreground-secondary">
                        Photo {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-foreground-secondary">
                Conseil: Ajoutez au moins 5 photos de qualite pour maximiser vos
                chances !
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Recapitulatif */}
        {step === 5 && (
          <div className="glass-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Recapitulatif
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Verifiez les informations avant de publier
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Title & Zone */}
              <div className="rounded-xl bg-white/[0.03] p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs text-foreground-secondary">Titre</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formData.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-primary hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-foreground-secondary">Zone</p>
                    <p className="flex items-center gap-1 text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {formData.zone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-secondary">Adresse</p>
                    <p className="text-foreground">
                      {formData.exactLocation || "Non specifiee"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl bg-white/[0.03] p-4">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-foreground-secondary">
                    Description
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-primary hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                <p className="mt-1 text-sm text-foreground">
                  {formData.description || "Aucune description"}
                </p>
              </div>

              {/* Pricing */}
              <div className="rounded-xl bg-white/[0.03] p-4">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-foreground-secondary">
                    Tarification
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-primary hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      €{formData.priceEUR}
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      par mois
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      €{formData.deposit}
                    </p>
                    <p className="text-xs text-foreground-secondary">depot</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {formData.availableRooms}/{formData.totalRooms}
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      chambres dispo
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {formData.minimumStay}
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      duree min
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities & Vibes */}
              <div className="rounded-xl bg-white/[0.03] p-4">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-foreground-secondary">
                    Equipements & Vibes
                  </p>
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-primary hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-foreground-secondary">
                    Equipements ({formData.amenities.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-lg bg-primary/10 px-3 py-1 text-xs text-primary"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-foreground-secondary">
                    Vibes ({formData.vibe.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.vibe.map((v) => (
                      <span
                        key={v}
                        className="rounded-lg bg-emerald/10 px-3 py-1 text-xs text-emerald"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirmation info */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-foreground-secondary">
                    <Check className="h-4 w-4 text-emerald" />
                    Ton annonce sera visible immediatement apres publication
                  </p>
                  <p className="flex items-center gap-2 text-foreground-secondary">
                    <Check className="h-4 w-4 text-emerald" />
                    Tu pourras la modifier a tout moment depuis ton dashboard
                  </p>
                  <p className="flex items-center gap-2 text-foreground-secondary">
                    <Check className="h-4 w-4 text-emerald" />
                    Notre equipe la verifiera sous 24-48h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.05]"
            >
              <ArrowLeft className="mr-2 inline h-4 w-4" />
              Precedent
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="glow-button flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuer
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="glow-button flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Publier ma villa
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
