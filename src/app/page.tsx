import Link from "next/link";
import {
  Target,
  ShieldCheck,
  MessageCircle,
  UserPlus,
  Search,
  Handshake,
  MapPin,
  ArrowRight,
  Palmtree,
  Waves,
  Sparkles,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

async function getZoneCounts() {
  const villas = await prisma.villa.findMany({
    select: { zone: true, availableRooms: true },
  });

  const zones: Record<string, { total: number; available: number }> = {};
  for (const v of villas) {
    if (!zones[v.zone]) zones[v.zone] = { total: 0, available: 0 };
    zones[v.zone].total += 1;
    zones[v.zone].available += v.availableRooms;
  }
  return zones;
}

export default async function LandingPage() {
  const zones = await getZoneCounts();

  const zoneCards = [
    {
      name: "Canggu",
      description: "Le paradis des digital nomads et surfeurs",
      icon: Waves,
      emoji: "🏄",
    },
    {
      name: "Ubud",
      description: "Nature, yoga et spiritualite",
      icon: Palmtree,
      emoji: "🌿",
    },
    {
      name: "Seminyak",
      description: "Beach clubs, restaurants et lifestyle",
      icon: Crown,
      emoji: "✨",
    },
    {
      name: "Uluwatu",
      description: "Falaises, surf et couchers de soleil",
      icon: Waves,
      emoji: "🌊",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* =========== HEADER =========== */}
      <header className="sticky top-[41px] z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl font-bold text-white">Villa</span>
            <span className="text-xl font-bold text-gold-gradient">First</span>
            <span className="text-lg">🏝️</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/"
              className="text-white/50 transition-colors hover:text-white"
            >
              Accueil
            </Link>
            <a
              href="#how-it-works"
              className="text-white/50 transition-colors hover:text-white"
            >
              Comment ca marche
            </a>
            <a
              href="#zones"
              className="text-white/50 transition-colors hover:text-white"
            >
              Zones
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:bg-white/[0.06] hover:text-white"
              asChild
            >
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button
              size="sm"
              className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              asChild
            >
              <Link href="/villas">Explorer</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* =========== HERO =========== */}
      <section className="gradient-hero-premium pattern-dots relative overflow-hidden px-4 py-24 md:py-36 lg:py-44">
        {/* Decorative orbs */}
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-accent/[0.03] blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>La plateforme #1 de colocation a Bali</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-white">Trouve ta villa</span>
            <br />
            <span className="text-gold-gradient">de reve a Bali</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50 md:text-xl">
            Rencontre des colocataires qui partagent tes vibes. Matching
            intelligent, villas verifiees, communaute de confiance.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="glow-button w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto text-base px-8 py-6 font-semibold"
              asChild
            >
              <Link href="/villas">
                <Search className="mr-2 h-5 w-5" />
                Je cherche une chambre
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="shimmer w-full border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:text-primary sm:w-auto text-base px-8 py-6 font-semibold"
              asChild
            >
              <Link href="/login">
                <Palmtree className="mr-2 h-5 w-5" />
                Louer ma villa
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex items-center justify-center gap-8 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary/60" />
              <span>Villas verifiees</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Target className="h-4 w-4 text-primary/60" />
              <span>Matching IA</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary/60" />
              <span>Chat integre</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========== POURQUOI VILLA FIRST =========== */}
      <section className="relative px-4 py-24 md:py-32">
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-white/50">
              Pourquoi nous choisir
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Pourquoi{" "}
              <span className="text-gold-gradient">Villa First</span> ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/40">
              On a cree la plateforme qu&apos;on aurait voulu avoir en arrivant
              a Bali
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {/* Card 1 - Matching */}
            <div className="glass-card-hover group p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Matching intelligent
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                Trouve des colocs compatibles grace a notre algorithme de vibes.
                Fini les mauvaises surprises.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Budget
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Lifestyle
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Personnalite
                </Badge>
              </div>
            </div>

            {/* Card 2 - Verified */}
            <div className="glass-card-hover group p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
                <ShieldCheck className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Villas verifiees
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                Toutes nos villas sont verifiees pour ta securite. Photos
                reelles, proprio de confiance.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Photos verifiees
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Proprio certifie
                </Badge>
              </div>
            </div>

            {/* Card 3 - Chat */}
            <div className="glass-card-hover group p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8B5CF6]/10 ring-1 ring-[#8B5CF6]/20">
                <MessageCircle className="h-7 w-7 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Communication facile
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                Chat integre, fini le chaos des groupes Facebook. Discute
                directement avec tes futurs colocs.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Chat temps reel
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/[0.06] bg-white/[0.04] text-white/50"
                >
                  Notifications
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== COMMENT CA MARCHE =========== */}
      <section id="how-it-works" className="relative px-4 py-24 md:py-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-white/50">
              Simple et rapide
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Comment ca{" "}
              <span className="text-gold-gradient">marche</span> ?
            </h2>
          </div>

          <div className="mt-16 space-y-0">
            {/* Step 1 */}
            <div className="relative flex gap-6 pb-14">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-glow">
                  1
                </div>
                <div className="timeline-line mt-3 w-px flex-1" />
              </div>
              <div className="glass-card flex-1 p-6">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    Cree ton profil & definis tes vibes
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/40">
                  Dis-nous ton budget, ta zone preferee, ton lifestyle et ta
                  personnalite. Notre algorithme fera le reste pour trouver tes
                  colocs ideaux.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-6 pb-14">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-glow">
                  2
                </div>
                <div className="timeline-line mt-3 w-px flex-1" />
              </div>
              <div className="glass-card flex-1 p-6">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    Explore les villas & decouvre tes futurs colocs
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/40">
                  Parcours les villas verifiees, decouvre qui y habite deja et
                  trouve l&apos;endroit qui te correspond. Filtre par zone,
                  budget, et vibe.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-glow">
                  3
                </div>
              </div>
              <div className="glass-card flex-1 p-6">
                <div className="flex items-center gap-3">
                  <Handshake className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    Matche, reserve & emmenage !
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/40">
                  Connecte-toi avec tes futurs colocs, visite la villa et
                  reserve ta chambre en quelques clics. Bienvenue a Bali !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== ZONES POPULAIRES =========== */}
      <section id="zones" className="relative px-4 py-24 md:py-32">
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-white/50">
              <MapPin className="h-3.5 w-3.5" />
              Explorer
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Zones{" "}
              <span className="text-gold-gradient">populaires</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/40">
              Decouvre les quartiers les plus prises de Bali par la communaute
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2">
            {zoneCards.map((zone) => {
              const data = zones[zone.name];
              const Icon = zone.icon;
              return (
                <Link
                  key={zone.name}
                  href={`/villas?zone=${zone.name}`}
                  className="group"
                >
                  <div className="glass-card-hover relative flex h-48 flex-col justify-between overflow-hidden p-6">
                    {/* Background icon */}
                    <Icon className="absolute -bottom-6 -right-6 h-28 w-28 text-white/[0.03] transition-all duration-500 group-hover:text-primary/[0.08]" />

                    {/* Gold accent line */}
                    <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{zone.emoji}</span>
                        <h3 className="text-xl font-bold text-white">
                          {zone.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-white/40">
                        {zone.description}
                      </p>
                    </div>

                    <div className="relative flex items-end justify-between">
                      <div className="space-y-0.5 text-sm">
                        <p className="font-semibold text-primary">
                          {data?.total ?? 0} villa
                          {(data?.total ?? 0) > 1 ? "s" : ""}
                        </p>
                        <p className="text-white/30">
                          {data?.available ?? 0} chambre
                          {(data?.available ?? 0) > 1 ? "s" : ""} dispo
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors group-hover:text-primary">
                        Explorer
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========== CTA FINAL =========== */}
      <section className="relative overflow-hidden px-4 py-24 md:py-36">
        <div className="absolute inset-0 bg-background" />
        {/* Gold glow orbs */}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Pret a trouver
            <br />
            <span className="text-gold-gradient">ta villa ideale</span> ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/40">
            Rejoins des centaines de digital nomads qui ont deja trouve leur
            chez-eux a Bali grace a Villa First.
          </p>
          <div className="mt-12">
            <Button
              size="lg"
              className="glow-button animate-glow-pulse bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg font-semibold"
              asChild
            >
              <Link href="/villas">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========== FOOTER =========== */}
      <footer className="relative px-4 py-14">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">Villa</span>
                <span className="text-lg font-bold text-gold-gradient">
                  First
                </span>
                <span>🏝️</span>
              </Link>
              <p className="mt-1 text-sm text-white/30">
                Projet de demonstration - 2025
              </p>
            </div>

            <nav className="flex gap-6 text-sm text-white/30">
              <Link
                href="/about"
                className="transition-colors hover:text-primary"
              >
                A propos
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                CGU
              </Link>
            </nav>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-6 text-center text-xs text-white/20">
            &copy; 2025 Villa First. Tous droits reserves. Projet de
            demonstration.
          </div>
        </div>
      </footer>
    </div>
  );
}
