"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import UserProfileModal from "@/components/UserProfileModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  MessageSquare,
  Eye,
  Inbox,
  Ban,
} from "lucide-react";
import Link from "next/link";

interface BookingUser {
  id: string;
  name: string;
  avatar: string | null;
  age: number | null;
  nationality: string | null;
  languages: string;
  verified: boolean;
  badges: string;
  vibeProfile: {
    interests: string;
    lifestyle: string;
    personalitySocial: number;
    personalityOrganized: number;
    personalityParty: number;
    personalityFitness: number;
    personalityCalm: number;
    bio: string | null;
    preferredZones: string;
    workStyle: string | null;
    schedule: string | null;
    smokingOk: boolean;
    petsOk: boolean;
    veganOk: boolean;
  } | null;
}

interface BookingVilla {
  id: string;
  title: string;
  zone: string;
  photos: string;
  priceEUR: number;
  totalRooms: number;
  availableRooms: number;
}

interface OwnerBooking {
  id: string;
  roomNumber: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  transactionId: string | null;
  createdAt: string;
  user: BookingUser;
  villa: BookingVilla;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDurationMonths(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  return Math.max(months, 1);
}

function RequestCard({
  booking,
  tab,
  onAccept,
  onReject,
  onViewProfile,
  actionLoading,
}: {
  booking: OwnerBooking;
  tab: "pending" | "confirmed" | "cancelled";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewProfile: (user: BookingUser) => void;
  actionLoading: string | null;
}) {
  const duration = getDurationMonths(booking.startDate, booking.endDate);
  const isLoading = actionLoading === booking.id;

  return (
    <div className="glass-card overflow-hidden p-0 transition-all hover:border-primary/20">
      <div className="flex flex-col sm:flex-row">
        {/* Left: user info */}
        <div className="flex items-start gap-4 border-b border-white/[0.06] p-5 sm:w-72 sm:border-b-0 sm:border-r">
          <Avatar className="h-14 w-14 flex-shrink-0 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/15 text-base font-bold text-primary">
              {getInitials(booking.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-semibold text-white">
                {booking.user.name}
              </p>
              {booking.user.verified && (
                <span className="text-xs text-emerald">✓</span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
              {booking.user.age && <span>{booking.user.age} ans</span>}
              {booking.user.nationality && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {booking.user.nationality}
                </span>
              )}
            </div>
            <button
              onClick={() => onViewProfile(booking.user)}
              className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80"
            >
              <Eye className="h-3 w-3" />
              Voir le profil complet
            </button>
          </div>
        </div>

        {/* Right: booking details + actions */}
        <div className="flex flex-1 flex-col p-5">
          {/* Villa + status */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/villas/${booking.villa.id}`}
                className="truncate text-sm font-medium text-white/70 transition-colors hover:text-primary"
              >
                {booking.villa.title}
              </Link>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/30">
                <MapPin className="h-3 w-3" />
                {booking.villa.zone}
              </p>
            </div>
            <Badge
              className={`flex-shrink-0 text-[10px] ${
                tab === "pending"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                  : tab === "confirmed"
                    ? "border-emerald/30 bg-emerald/10 text-emerald"
                    : "border-red-400/30 bg-red-400/10 text-red-400"
              }`}
            >
              {tab === "pending" && <Clock className="mr-1 h-3 w-3" />}
              {tab === "confirmed" && (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              {tab === "cancelled" && <Ban className="mr-1 h-3 w-3" />}
              {tab === "pending"
                ? "En attente"
                : tab === "confirmed"
                  ? "Acceptee"
                  : "Refusee"}
            </Badge>
          </div>

          {/* Details grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                Dates
              </p>
              <p className="mt-0.5 text-sm text-white/60">
                {formatDateShort(booking.startDate)} → {formatDateShort(booking.endDate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                Duree
              </p>
              <p className="mt-0.5 text-sm text-white/60">{duration} mois</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                Prix total
              </p>
              <p className="mt-0.5 text-sm font-semibold text-primary">
                {booking.totalPrice.toLocaleString("fr-FR")} IDR
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                Chambre
              </p>
              <p className="mt-0.5 text-sm text-white/60">
                #{booking.roomNumber}
              </p>
            </div>
          </div>

          {/* Sent date */}
          <p className="mb-3 text-[10px] text-white/20">
            Demande envoyee le{" "}
            {new Date(booking.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2">
            {tab === "pending" && onAccept && onReject && (
              <>
                <button
                  onClick={() => onAccept(booking.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald/15 px-4 py-2 text-xs font-medium text-emerald transition-all hover:bg-emerald/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border border-emerald border-t-transparent" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Accepter
                </button>
                <button
                  onClick={() => onReject(booking.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 text-xs font-medium text-red-400/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Refuser
                </button>
              </>
            )}
            <Link
              href="/messages"
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Discuter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Inbox;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="mb-1 font-display text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="max-w-xs text-center text-sm text-white/40">
        {description}
      </p>
    </div>
  );
}

export default function RequestsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<BookingUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings/owner?ownerId=${user.id}`);
        if (res.ok) {
          setBookings(await res.json());
        }
      } catch (err) {
        console.error("Error fetching owner bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "PENDING"),
    [bookings]
  );
  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === "CONFIRMED"),
    [bookings]
  );
  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === "CANCELLED"),
    [bookings]
  );

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "CONFIRMED" | "CANCELLED"
  ) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b
          )
        );
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = (bookingUser: BookingUser) => {
    setSelectedUser(bookingUser);
    setModalOpen(true);
  };

  if (!user) return null;

  return (
    <DashboardLayout requiredType="PROPRIETAIRE">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
          Demandes de reservation
        </h1>
        <p className="mt-1 text-white/40">
          {loading
            ? "Chargement..."
            : `${bookings.length} demande${bookings.length !== 1 ? "s" : ""} au total · ${pendingBookings.length} en attente`}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-6 h-11 w-full gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 sm:w-auto">
            <TabsTrigger
              value="pending"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-yellow-500/15 data-[state=active]:text-yellow-400 data-[state=inactive]:text-white/50"
            >
              <Clock className="h-3.5 w-3.5" />
              En attente
              {pendingBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500/20 px-1 text-[10px] font-bold text-yellow-400">
                  {pendingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="confirmed"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-emerald/15 data-[state=active]:text-emerald data-[state=inactive]:text-white/50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acceptees
              {confirmedBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald/15 px-1 text-[10px] font-bold text-emerald">
                  {confirmedBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 data-[state=inactive]:text-white/50"
            >
              <Ban className="h-3.5 w-3.5" />
              Refusees
              {cancelledBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1 text-[10px] font-bold text-red-400">
                  {cancelledBookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pending */}
          <TabsContent value="pending">
            {pendingBookings.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Aucune demande en attente"
                description="Les nouvelles demandes de reservation apparaitront ici"
              />
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <RequestCard
                    key={booking.id}
                    booking={booking}
                    tab="pending"
                    onAccept={(id) => handleUpdateStatus(id, "CONFIRMED")}
                    onReject={(id) => handleUpdateStatus(id, "CANCELLED")}
                    onViewProfile={handleViewProfile}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Confirmed */}
          <TabsContent value="confirmed">
            {confirmedBookings.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Aucune demande acceptee"
                description="Les reservations confirmees apparaitront ici"
              />
            ) : (
              <div className="space-y-4">
                {confirmedBookings.map((booking) => (
                  <RequestCard
                    key={booking.id}
                    booking={booking}
                    tab="confirmed"
                    onViewProfile={handleViewProfile}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cancelled */}
          <TabsContent value="cancelled">
            {cancelledBookings.length === 0 ? (
              <EmptyState
                icon={Ban}
                title="Aucune demande refusee"
                description="Les demandes refusees apparaitront ici"
              />
            ) : (
              <div className="space-y-4">
                {cancelledBookings.map((booking) => (
                  <RequestCard
                    key={booking.id}
                    booking={booking}
                    tab="cancelled"
                    onViewProfile={handleViewProfile}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Profile modal */}
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
