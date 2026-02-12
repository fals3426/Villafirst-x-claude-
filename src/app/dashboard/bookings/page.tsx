"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  MessageSquare,
  ExternalLink,
  XCircle,
  Clock,
  CheckCircle2,
  Ban,
  Home,
  Receipt,
} from "lucide-react";
import Link from "next/link";

interface BookingVilla {
  id: string;
  title: string;
  zone: string;
  photos: string;
  priceEUR: number;
  pricePerMonth: number;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface Booking {
  id: string;
  villaId: string;
  roomNumber: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  transactionId: string | null;
  createdAt: string;
  villa: BookingVilla;
}

function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function getDurationMonths(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  return Math.max(months, 1);
}

function BookingCard({
  booking,
  type,
  onCancel,
  cancelling,
}: {
  booking: Booking;
  type: "active" | "past" | "cancelled";
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  let photos: string[] = [];
  try {
    photos = JSON.parse(booking.villa.photos);
  } catch {
    photos = [];
  }

  const duration = getDurationMonths(booking.startDate, booking.endDate);

  return (
    <div className="glass-card overflow-hidden p-0 transition-all hover:border-primary/20">
      <div className="flex flex-col md:flex-row">
        {/* Photo */}
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden md:h-auto md:w-56">
          {photos[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photos[0]}
              alt={booking.villa.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-4xl">
              🏠
            </div>
          )}
          {/* Status overlay */}
          <div className="absolute left-3 top-3">
            <Badge
              className={`text-[10px] backdrop-blur-sm ${
                type === "active"
                  ? "border-emerald/40 bg-emerald/20 text-emerald"
                  : type === "cancelled"
                    ? "border-red-400/40 bg-red-500/20 text-red-400"
                    : "border-white/20 bg-white/10 text-white/60"
              }`}
            >
              {type === "active" && (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              {type === "cancelled" && <Ban className="mr-1 h-3 w-3" />}
              {type === "past" && <Clock className="mr-1 h-3 w-3" />}
              {type === "active"
                ? "Confirme"
                : type === "cancelled"
                  ? "Annule"
                  : "Termine"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Title + zone */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white">
              {booking.villa.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/40">
              <MapPin className="h-3.5 w-3.5" />
              {booking.villa.zone} · {booking.villa.owner.name}
            </p>
          </div>

          {/* Details grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Dates
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                {formatDateShort(booking.startDate)} →{" "}
                {formatDateShort(booking.endDate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Duree
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                {duration} mois
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Prix total
              </p>
              <p className="mt-0.5 text-sm font-semibold text-primary">
                {booking.totalPrice.toLocaleString("fr-FR")}€
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Chambre
              </p>
              <p className="mt-0.5 text-sm text-white/70">
                #{booking.roomNumber}
              </p>
            </div>
          </div>

          {/* Transaction ID */}
          {booking.transactionId && (
            <div className="mb-4 flex items-center gap-1.5 text-xs text-white/25">
              <Receipt className="h-3 w-3" />
              Transaction : {booking.transactionId}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2">
            <Link
              href={`/villas/${booking.villa.id}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/60 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Voir la villa
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/20"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Contacter le proprio
            </Link>
            {type === "active" && onCancel && (
              <>
                {confirmCancel ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400">Confirmer ?</span>
                    <button
                      onClick={() => onCancel(booking.id)}
                      disabled={cancelling}
                      className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {cancelling ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-red-400 border-t-transparent" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      Oui, annuler
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/40 transition-all hover:bg-white/[0.05]"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-4 py-2 text-xs font-medium text-red-400/60 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Annuler
                  </button>
                )}
              </>
            )}
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
  action,
}: {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="mb-1 font-display text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mb-5 max-w-xs text-center text-sm text-white/40">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="glow-button flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          <Home className="h-4 w-4" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${user.id}`);
        if (res.ok) {
          setBookings(await res.json());
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const now = useMemo(() => new Date(), []);

  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "CONFIRMED" && new Date(b.endDate) > now
      ),
    [bookings, now]
  );

  const pastBookings = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === "CONFIRMED" && new Date(b.endDate) <= now
      ),
    [bookings, now]
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === "CANCELLED"),
    [bookings]
  );

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout requiredType="COLOCATAIRE">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
          Mes Reservations
        </h1>
        <p className="mt-1 text-white/40">
          {loading
            ? "Chargement..."
            : `${bookings.length} reservation${bookings.length !== 1 ? "s" : ""} au total`}
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList className="mb-6 h-11 w-full gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 sm:w-auto">
            <TabsTrigger
              value="active"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=inactive]:text-white/50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              En cours
              {activeBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-bold text-primary">
                  {activeBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=inactive]:text-white/50"
            >
              <Clock className="h-3.5 w-3.5" />
              Passees
              {pastBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1 text-[10px] font-bold text-white/50">
                  {pastBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="gap-1.5 rounded-lg px-4 text-sm data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 data-[state=inactive]:text-white/50"
            >
              <Ban className="h-3.5 w-3.5" />
              Annulees
              {cancelledBookings.length > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1 text-[10px] font-bold text-red-400">
                  {cancelledBookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Active bookings */}
          <TabsContent value="active">
            {activeBookings.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Aucune reservation en cours"
                description="Explore les villas disponibles pour trouver ta prochaine colocation"
                action={{ label: "Explorer les villas", href: "/villas" }}
              />
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    type="active"
                    onCancel={handleCancel}
                    cancelling={cancellingId === booking.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past bookings */}
          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Aucune reservation passee"
                description="Tes reservations terminees apparaitront ici"
              />
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    type="past"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cancelled bookings */}
          <TabsContent value="cancelled">
            {cancelledBookings.length === 0 ? (
              <EmptyState
                icon={Ban}
                title="Aucune reservation annulee"
                description="Les reservations annulees apparaitront ici"
              />
            ) : (
              <div className="space-y-4">
                {cancelledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    type="cancelled"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}
