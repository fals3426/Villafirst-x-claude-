"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  CreditCard,
  Check,
  ArrowLeft,
  CalendarDays,
  BedDouble,
  MapPin,
  Shield,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { simulatePayment } from "@/lib/mockPayment";
import { Badge } from "@/components/ui/badge";

interface VillaData {
  id: string;
  title: string;
  zone: string;
  exactLocation: string;
  pricePerMonth: number;
  priceEUR: number;
  priceUSD: number;
  deposit: number;
  totalRooms: number;
  availableRooms: number;
  bathrooms: number;
  photos: string;
  description: string;
  amenities: string;
  vibe: string;
  verified: boolean;
  minimumStay: string;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  };
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [villa, setVilla] = useState<VillaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation

  // Form data
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [roomNumber, setRoomNumber] = useState(1);
  const [months, setMonths] = useState(1);

  // Payment result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    async function fetchVilla() {
      try {
        const res = await fetch(`/api/villas/${params.id}`);
        if (res.ok) {
          setVilla(await res.json());
        } else {
          router.push("/villas");
        }
      } catch {
        router.push("/villas");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchVilla();

    // Default dates: start next week, end 1 month later
    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [params.id, router]);

  // Calculate months when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const monthsCount = Math.max(1, Math.ceil(diffDays / 30));
      setMonths(monthsCount);
    }
  }, [startDate, endDate]);

  const serviceFee = 25;
  const rentTotal = villa ? villa.priceEUR * months : 0;
  const totalPrice = rentTotal + serviceFee;

  async function handlePayment() {
    if (!user || !villa) return;

    setProcessing(true);
    try {
      const paymentResult = await simulatePayment(totalPrice, "EUR");

      if (paymentResult.success) {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            villaId: villa.id,
            userId: user.id,
            roomNumber,
            startDate,
            endDate,
            totalPrice,
            transactionId: paymentResult.transactionId,
          }),
        });

        if (res.ok) {
          const bookingData = await res.json();
          setBooking(bookingData);
          setStep(3);
        } else if (res.status === 401) {
          alert("Session expirée. Veuillez vous reconnecter.");
          logout();
        } else {
          const err = await res.json();
          alert("Erreur: " + (err.error || "Echec de la reservation"));
        }
      } else {
        alert("Paiement echoue: " + paymentResult.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-white/40">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!villa || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            {!user ? "🔐" : "🏝️"}
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {!user ? "Connexion requise" : "Villa non trouvee"}
          </h2>
          <p className="mt-2 text-sm text-white/40">
            {!user
              ? "Connectez-vous pour reserver"
              : "Cette villa n'existe plus"}
          </p>
          <button
            onClick={() => router.push(user ? "/villas" : "/login")}
            className="glow-button mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {user ? "Explorer les villas" : "Se connecter"}
          </button>
        </div>
      </div>
    );
  }

  let vibes: string[] = [];
  try {
    vibes = JSON.parse(villa.vibe);
  } catch {
    vibes = [];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-[41px] z-30 border-b border-white/[0.06] bg-surface/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <button
            onClick={() =>
              step === 3 ? router.push("/dashboard") : router.back()
            }
            className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 3 ? "Voir mes reservations" : "Retour"}
          </button>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Shield className="h-3.5 w-3.5 text-emerald" />
            <span className="hidden sm:inline">Paiement securise</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Paiement" },
            { num: 3, label: "Confirmation" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-10 sm:w-10 ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-white/[0.08] bg-white/[0.04] text-white/30"
                }`}
              >
                {step > s.num ? <Check className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`ml-2 hidden text-sm sm:inline ${
                  step >= s.num ? "font-medium text-white" : "text-white/30"
                }`}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  className={`mx-3 h-[2px] w-8 rounded-full sm:mx-4 sm:w-16 ${
                    step > s.num ? "bg-primary" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ========== STEP 1: Details ========== */}
        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Form */}
            <div className="lg:col-span-3">
              <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
                Reserve ta chambre
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Remplis les details de ton sejour
              </p>

              {/* Villa summary */}
              <div className="glass-card mt-6 flex gap-4 p-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-surface to-accent/10 text-3xl">
                  🏡
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white">
                    {villa.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                    <MapPin className="h-3 w-3" />
                    {villa.zone} — {villa.exactLocation}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {villa.priceEUR}€/mois
                    </span>
                    {villa.verified && (
                      <Badge className="border-emerald/30 bg-emerald/10 text-[10px] text-emerald">
                        Verifiee
                      </Badge>
                    )}
                    {vibes.slice(0, 2).map((v) => (
                      <Badge
                        key={v}
                        className="border-primary/20 bg-primary/10 text-[10px] text-primary"
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date fields */}
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Date d&apos;arrivee
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Date de depart
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                    <BedDouble className="h-4 w-4 text-primary" />
                    Chambre souhaitee
                  </label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(parseInt(e.target.value))}
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    {Array.from(
                      { length: villa.availableRooms },
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Chambre {i + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Minimum stay notice */}
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-white/50">
                    Sejour minimum :{" "}
                    <span className="font-medium text-primary">
                      {villa.minimumStay}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Summary card */}
            <div className="lg:col-span-2">
              <div className="glass-card gradient-border sticky top-28 overflow-hidden">
                <div className="border-b border-white/[0.06] p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Resume
                  </h3>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Duree du sejour</span>
                    <span className="font-medium text-white">
                      {months} mois
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      Loyer ({months} × {villa.priceEUR}€)
                    </span>
                    <span className="font-medium text-white">{rentTotal}€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      Frais de service Villa First
                    </span>
                    <span className="font-medium text-white">
                      {serviceFee}€
                    </span>
                  </div>

                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-white">
                        Total
                      </span>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {totalPrice}€
                        </p>
                        <p className="text-xs text-white/30">
                          ~{(totalPrice * 17000).toLocaleString()} IDR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] p-6">
                  <button
                    onClick={() => setStep(2)}
                    className="glow-button h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    Continuer vers le paiement
                  </button>
                  <p className="mt-3 text-center text-[10px] text-white/30">
                    🎭 Mode demo — Aucun paiement reel
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== STEP 2: Payment ========== */}
        {step === 2 && (
          <div className="mx-auto max-w-xl">
            <h1 className="text-center font-display text-2xl font-bold text-white lg:text-3xl">
              Paiement securise
            </h1>
            <p className="mt-1 text-center text-sm text-white/40">
              Finalisez votre reservation
            </p>

            <div className="glass-card gradient-border mt-8 overflow-hidden">
              {/* Demo banner */}
              <div className="border-b border-primary/20 bg-primary/5 px-6 py-4">
                <p className="text-center text-sm font-semibold text-primary">
                  🎭 MODE DEMONSTRATION
                </p>
                <p className="mt-1 text-center text-xs text-white/40">
                  Aucun paiement reel. Cliquez sur &ldquo;Payer&rdquo; pour
                  simuler.
                </p>
              </div>

              <div className="p-6">
                {/* Card fields (disabled/simulated) */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs text-white/40">
                      Numero de carte
                    </label>
                    <input
                      type="text"
                      value="4242 4242 4242 4242"
                      disabled
                      className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm text-white/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs text-white/40">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value="12/26"
                        disabled
                        className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm text-white/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-white/40">
                        CVV
                      </label>
                      <input
                        type="text"
                        value="123"
                        disabled
                        className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm text-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="mt-6 border-t border-white/[0.06] pt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-white/50">
                      Montant a payer
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      {totalPrice}€
                    </span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="glow-button mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Payer {totalPrice}€
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep(1)}
              disabled={processing}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Modifier les details
            </button>
          </div>
        )}

        {/* ========== STEP 3: Confirmation ========== */}
        {step === 3 && booking && (
          <div className="mx-auto max-w-xl text-center">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald bg-emerald/10 shadow-lg shadow-emerald/10">
              <Check className="h-10 w-10 text-emerald" />
            </div>

            <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
              Reservation confirmee ! 🎉
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Felicitations ! Ta chambre est reservee.
            </p>

            {/* Booking details */}
            <div className="glass-card mt-8 overflow-hidden text-left">
              <div className="border-b border-white/[0.06] bg-primary/5 px-6 py-4">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Details de la reservation
                </h3>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">
                    N° de reservation
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-xs text-primary">
                    {booking.transactionId || booking.id.slice(0, 12)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Villa</span>
                  <span className="text-sm font-medium text-white">
                    {villa.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Chambre</span>
                  <span className="text-sm font-medium text-white">
                    Chambre {booking.roomNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Dates</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(booking.startDate).toLocaleDateString("fr-FR")} —{" "}
                    {new Date(booking.endDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-sm text-white/40">Montant paye</span>
                  <span className="text-lg font-bold text-primary">
                    {booking.totalPrice}€
                  </span>
                </div>
              </div>

              {/* Next steps */}
              <div className="border-t border-white/[0.06] bg-primary/5 p-6">
                <h4 className="mb-3 text-sm font-semibold text-white">
                  Prochaines etapes :
                </h4>
                <ol className="space-y-2.5 text-xs text-white/50">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✅</span>
                    Le proprietaire a recu ta demande
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📧</span>
                    Tu vas recevoir un email de confirmation
                  </li>
                  <li className="flex items-start gap-2">
                    <span>💬</span>
                    Contacte le proprietaire via le chat
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🏠</span>
                    Rendez-vous le{" "}
                    {new Date(booking.startDate).toLocaleDateString("fr-FR")} !
                  </li>
                </ol>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="glow-button h-12 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Mes reservations
              </button>
              <button
                onClick={() => router.push(`/villas/${villa.id}`)}
                className="h-12 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                Retour a la villa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
