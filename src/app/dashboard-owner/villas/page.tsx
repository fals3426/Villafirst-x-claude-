"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  PlusCircle,
  Eye,
  Heart,
  CalendarDays,
  BedDouble,
  MapPin,
  ExternalLink,
  Pencil,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface VillaBooking {
  id: string;
  status: string;
  user: { id: string; name: string };
}

interface Villa {
  id: string;
  title: string;
  zone: string;
  pricePerMonth: number;
  priceEUR: number;
  priceUSD: number;
  totalRooms: number;
  availableRooms: number;
  photos: string;
  description: string;
  amenities: string;
  vibe: string;
  verified: boolean;
  badges: string;
  minimumStay: string;
  createdAt: string;
  bookings: VillaBooking[];
}

function VillaCard({
  villa,
  onTogglePause,
  onDelete,
  toggling,
  deleting,
}: {
  villa: Villa;
  onTogglePause: (id: string, currentVerified: boolean) => void;
  onDelete: (id: string) => void;
  toggling: boolean;
  deleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  let photos: string[] = [];
  try {
    photos = JSON.parse(villa.photos);
  } catch {
    photos = [];
  }

  let vibes: string[] = [];
  try {
    vibes = JSON.parse(villa.vibe);
  } catch {
    vibes = [];
  }

  const occupiedRooms = villa.totalRooms - villa.availableRooms;
  const occupancyPercent = Math.round(
    (occupiedRooms / villa.totalRooms) * 100
  );
  const bookingCount = villa.bookings.length;

  // Fictitious stats
  const fakeViews = 200 + Math.floor(villa.title.length * 17.3) % 400;
  const fakeFavorites = 10 + Math.floor(villa.title.length * 3.7) % 40;

  const isActive = villa.verified;

  return (
    <div className="glass-card overflow-hidden p-0 transition-all hover:border-primary/20">
      {/* Photo */}
      <div className="relative h-44 w-full overflow-hidden">
        {photos[0] ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photos[0]}
            alt={villa.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-5xl">
            🏡
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <Badge
            className={`text-[10px] backdrop-blur-sm ${
              isActive
                ? "border-emerald/40 bg-emerald/20 text-emerald"
                : "border-yellow-500/40 bg-yellow-500/20 text-yellow-400"
            }`}
          >
            <div
              className={`mr-1 h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald" : "bg-yellow-400"
              }`}
            />
            {isActive ? "Active" : "En pause"}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-lg bg-black/60 px-2.5 py-1 text-sm font-bold text-primary backdrop-blur-sm">
            {villa.priceEUR}€
            <span className="text-[10px] font-normal text-white/50">/mois</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + zone */}
        <h3 className="truncate text-base font-semibold text-white">
          {villa.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
          <MapPin className="h-3 w-3" />
          {villa.zone}
        </p>

        {/* Vibes */}
        {vibes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {vibes.slice(0, 3).map((v) => (
              <span
                key={v}
                className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/40"
              >
                {v}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Eye className="h-3.5 w-3.5" />
            <span>{fakeViews}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Heart className="h-3.5 w-3.5" />
            <span>{fakeFavorites}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{bookingCount}</span>
          </div>
        </div>

        {/* Availability bar */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-white/40">
              <BedDouble className="h-3 w-3" />
              Chambres
            </span>
            <span className="text-xs font-medium text-white/60">
              {villa.availableRooms}/{villa.totalRooms} libres
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all ${
                occupancyPercent >= 80
                  ? "bg-emerald"
                  : occupancyPercent >= 40
                    ? "bg-primary"
                    : "bg-white/20"
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/villas/${villa.id}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir
          </Link>
          <button
            onClick={() => alert("Edition de villa - Disponible en V2")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-medium text-white/60 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </button>
          <button
            onClick={() => onTogglePause(villa.id, villa.verified)}
            disabled={toggling}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all disabled:opacity-50 ${
              isActive
                ? "border border-yellow-500/20 text-yellow-400/60 hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-400"
                : "border border-emerald/20 text-emerald/60 hover:border-emerald/30 hover:bg-emerald/10 hover:text-emerald"
            }`}
          >
            {isActive ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {toggling
              ? "..."
              : isActive
                ? "Pause"
                : "Activer"}
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(villa.id)}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500/20 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
              >
                {deleting ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-red-400 border-t-transparent" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                Oui
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex flex-1 items-center justify-center rounded-lg border border-white/[0.08] py-2 text-xs text-white/40 hover:bg-white/[0.05]"
              >
                Non
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/15 py-2 text-xs font-medium text-red-400/40 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OwnerVillasPage() {
  const { user } = useAuth();
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchVillas = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/villas`);
        if (res.ok) {
          setVillas(await res.json());
        }
      } catch (err) {
        console.error("Error fetching villas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
  }, [user]);

  const handleTogglePause = async (villaId: string, currentVerified: boolean) => {
    setTogglingId(villaId);
    try {
      const res = await fetch(`/api/villas/${villaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentVerified }),
      });
      if (res.ok) {
        setVillas((prev) =>
          prev.map((v) =>
            v.id === villaId ? { ...v, verified: !currentVerified } : v
          )
        );
      }
    } catch (err) {
      console.error("Error toggling villa:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (villaId: string) => {
    setDeletingId(villaId);
    try {
      const res = await fetch(`/api/villas/${villaId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVillas((prev) => prev.filter((v) => v.id !== villaId));
      }
    } catch (err) {
      console.error("Error deleting villa:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  const activeCount = villas.filter((v) => v.verified).length;
  const totalRooms = villas.reduce((acc, v) => acc + v.totalRooms, 0);
  const totalAvailable = villas.reduce((acc, v) => acc + v.availableRooms, 0);

  return (
    <DashboardLayout requiredType="PROPRIETAIRE">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
            Mes Villas
          </h1>
          <p className="mt-1 text-white/40">
            {loading
              ? "Chargement..."
              : `${villas.length} villa${villas.length !== 1 ? "s" : ""} · ${activeCount} active${activeCount !== 1 ? "s" : ""} · ${totalAvailable}/${totalRooms} chambres libres`}
          </p>
        </div>
        <Link
          href="/dashboard-owner/publish"
          className="glow-button flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          Publier une villa
        </Link>
      </div>

      {/* Stats summary */}
      {!loading && villas.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{villas.length}</p>
              <p className="text-xs text-white/40">Total</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10">
              <Play className="h-5 w-5 text-emerald" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-white/40">Actives</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <BedDouble className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {totalRooms - totalAvailable}/{totalRooms}
              </p>
              <p className="text-xs text-white/40">Occupees</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
              <CalendarDays className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {villas.reduce((acc, v) => acc + v.bookings.length, 0)}
              </p>
              <p className="text-xs text-white/40">Reservations</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : villas.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <Building2 className="h-10 w-10 text-white/20" />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-white">
            Aucune villa publiee
          </h2>
          <p className="mb-6 max-w-sm text-center text-sm text-white/40">
            Publie ta premiere villa pour commencer a recevoir des demandes de colocation
          </p>
          <Link
            href="/dashboard-owner/publish"
            className="glow-button flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Publier ma premiere villa
          </Link>
        </div>
      ) : (
        /* Villa grid */
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {villas.map((villa) => (
            <VillaCard
              key={villa.id}
              villa={villa}
              onTogglePause={handleTogglePause}
              onDelete={handleDelete}
              toggling={togglingId === villa.id}
              deleting={deletingId === villa.id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
