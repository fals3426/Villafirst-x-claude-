"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  CalendarDays,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  Eye,
  BedDouble,
  MessageSquare,
  Plus,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";

interface VillaBooking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  user: {
    name: string;
    nationality: string | null;
    email: string;
  };
}

interface OwnedVilla {
  id: string;
  title: string;
  zone: string;
  pricePerMonth: number;
  priceEUR: number;
  availableRooms: number;
  totalRooms: number;
  verified: boolean;
  photos: string;
  amenities: string;
  vibe: string;
  bookings: VillaBooking[];
}

export default function DashboardOwnerPage() {
  return (
    <Suspense>
      <DashboardOwnerContent />
    </Suspense>
  );
}

function DashboardOwnerContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [villas, setVillas] = useState<OwnedVilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/villas`);
        if (res.ok) {
          setVillas(await res.json());
        }
      } catch (err) {
        console.error("Error fetching owner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (searchParams.get("published") === "true") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!user) return null;

  const totalRooms = villas.reduce((acc, v) => acc + v.totalRooms, 0);
  const occupiedRooms = villas.reduce(
    (acc, v) => acc + (v.totalRooms - v.availableRooms),
    0
  );
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const totalRevenue = villas.reduce(
    (acc, v) => acc + (v.priceEUR ?? 0) * (v.totalRooms - v.availableRooms),
    0
  );
  const pendingRequests = villas.reduce(
    (acc, v) => acc + v.bookings.filter((b) => b.status === "PENDING").length,
    0
  );
  const verifiedCount = villas.filter((v) => v.verified).length;

  const stats = [
    {
      label: "Villas",
      value: villas.length,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Taux Occupation",
      value: `${occupancyRate}%`,
      icon: BedDouble,
      color: "text-emerald",
      bg: "bg-emerald/10",
    },
    {
      label: "Revenu Mensuel",
      value: `${totalRevenue.toLocaleString()}€`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Verifiees",
      value: `${verifiedCount}/${villas.length}`,
      icon: ShieldCheck,
      color: "text-emerald",
      bg: "bg-emerald/10",
    },
  ];

  return (
    <DashboardLayout requiredType="PROPRIETAIRE">
      {/* Success banner */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald/30 bg-emerald/10 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald" />
          <p className="flex-1 text-sm font-medium text-emerald">
            Villa publiee avec succes ! Elle est maintenant visible par tous les
            colocataires.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-emerald/50 hover:text-emerald"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
            Bonjour, {user.name.split(" ")[0]} 🏠
          </h1>
          <p className="mt-1 text-white/40">
            Gerez vos villas et suivez vos performances
          </p>
        </div>
        <Link
          href="/dashboard-owner/publish"
          className="glow-button hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:flex"
        >
          <Plus className="h-4 w-4" />
          Publier une villa
        </Link>
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
          {/* My Villas */}
          <section className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Building2 className="h-5 w-5 text-primary" />
                Mes Villas
              </h2>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard-owner/publish"
                  className="glow-button flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:hidden"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Publier
                </Link>
                <Link
                  href="/dashboard-owner/villas"
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                >
                  Tout voir
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : villas.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <Building2 className="h-10 w-10 text-white/15" />
                <div>
                  <p className="text-sm font-medium text-white/50">
                    Aucune villa publiee
                  </p>
                  <p className="mt-1 text-xs text-white/30">
                    Publiez votre premiere villa pour recevoir des demandes
                  </p>
                </div>
                <Link
                  href="/dashboard-owner/publish"
                  className="glow-button flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Publier ma premiere villa
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {villas.map((villa) => {
                  const occupied = villa.totalRooms - villa.availableRooms;
                  const villaOccupancy =
                    villa.totalRooms > 0
                      ? Math.round((occupied / villa.totalRooms) * 100)
                      : 0;

                  return (
                    <Link
                      key={villa.id}
                      href={`/villas/${villa.id}`}
                      className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-primary/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                          🏡
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-white">
                                {villa.title}
                              </h3>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                                <MapPin className="h-3 w-3" />
                                {villa.zone}
                              </p>
                            </div>
                            <Badge
                              className={`text-[10px] ${
                                villa.verified
                                  ? "border-emerald/30 bg-emerald/10 text-emerald"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {villa.verified ? "Verifiee" : "En attente"}
                            </Badge>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-[10px] text-white/30">Tarif</p>
                              <p className="text-sm font-bold text-primary">
                                {villa.priceEUR ?? 0}€
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-white/30">
                                Occupation
                              </p>
                              <p className="text-sm font-bold text-white">
                                {occupied}/{villa.totalRooms}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-white/30">
                                Reservations
                              </p>
                              <p className="text-sm font-bold text-white">
                                {villa.bookings.length}
                              </p>
                            </div>
                          </div>

                          {/* Occupancy bar */}
                          <div className="mt-2">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  villaOccupancy >= 80
                                    ? "bg-emerald"
                                    : villaOccupancy >= 50
                                    ? "bg-primary"
                                    : "bg-yellow-400"
                                }`}
                                style={{ width: `${villaOccupancy}%` }}
                              />
                            </div>
                          </div>
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
          {/* Pending Requests */}
          <section className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Users className="h-5 w-5 text-yellow-400" />
                Demandes
              </h2>
              {pendingRequests > 0 && (
                <Badge className="border-yellow-500/30 bg-yellow-500/10 text-[10px] text-yellow-400">
                  {pendingRequests} en attente
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-2">
                {villas
                  .flatMap((v) =>
                    v.bookings
                      .filter((b) => b.status === "PENDING")
                      .map((b) => ({
                        ...b,
                        villaName: v.title,
                        villaZone: v.zone,
                      }))
                  )
                  .slice(0, 5)
                  .map((request) => (
                    <div
                      key={request.id}
                      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10 text-xs font-bold text-yellow-400">
                          {request.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {request.user.name}
                          </p>
                          <p className="text-[10px] text-white/30">
                            {request.villaName} · {request.villaZone}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="flex-1 rounded-lg bg-emerald/20 py-1.5 text-xs font-medium text-emerald transition-colors hover:bg-emerald/30">
                          Accepter
                        </button>
                        <button className="flex-1 rounded-lg bg-red-500/10 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20">
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}

                {pendingRequests === 0 && (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <CalendarDays className="h-8 w-8 text-white/20" />
                    <p className="text-sm text-white/40">
                      Aucune demande en attente
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Quick Overview */}
          <section className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-primary" />
              Apercu Rapide
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Eye className="h-4 w-4" />
                  Vues ce mois
                </div>
                <span className="text-sm font-bold text-white">342</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <MessageSquare className="h-4 w-4" />
                  Messages recus
                </div>
                <span className="text-sm font-bold text-white">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Users className="h-4 w-4" />
                  Locataires actifs
                </div>
                <span className="text-sm font-bold text-white">
                  {occupiedRooms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <ShieldCheck className="h-4 w-4" />
                  Villas verifiees
                </div>
                <span className="text-sm font-bold text-white">
                  {verifiedCount}/{villas.length}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
