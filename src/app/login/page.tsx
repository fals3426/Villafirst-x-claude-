"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";

const DEMO_EMAILS = [
  { email: "alex.thompson@gmail.com", label: "Alex", desc: "Digital Nomad" },
  { email: "sophie.martin@gmail.com", label: "Sophie", desc: "Yoga" },
  { email: "jake.wilson@gmail.com", label: "Jake", desc: "Party" },
  { email: "maria.garcia@gmail.com", label: "Maria", desc: "Tech" },
  { email: "tom.anderson@gmail.com", label: "Tom", desc: "Fitness" },
  { email: "wayan.putra@gmail.com", label: "Wayan", desc: "Proprio" },
  { email: "david.chen@gmail.com", label: "David", desc: "Proprio" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email);
      if (user.type === "PROPRIETAIRE") {
        router.push("/dashboard-owner");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Email non trouve. Essayez un des emails de demo ci-dessous.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 pattern-dots">
      {/* Background orbs */}
      <div className="fixed -left-32 top-1/3 h-64 w-64 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="fixed -right-32 bottom-1/3 h-80 w-80 rounded-full bg-accent/[0.02] blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-card gradient-border p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-white">Villa</span>
              <span className="text-2xl font-bold text-gold-gradient">
                First
              </span>
              <span className="text-xl">🏝️</span>
            </Link>
          </div>

          {/* Title */}
          <h1 className="font-display text-center text-3xl font-bold text-white">
            Connexion
          </h1>
          <p className="mt-2 text-center text-sm text-white/40">
            Accedez a votre espace
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-white/[0.08] bg-white/[0.04] pl-10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="glow-button h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Demo emails */}
          <div className="mt-8">
            <div className="flex items-center gap-2 text-xs text-primary/80">
              <span>🎭</span>
              <span>Mode demo — Cliquez sur un profil :</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_EMAILS.map((item) => (
                <button
                  key={item.email}
                  onClick={() => setEmail(item.email)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                    email === item.email
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/[0.06] bg-white/[0.03] text-white/50 hover:border-white/[0.12] hover:text-white/70"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-1 text-white/30">({item.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/30 transition-colors hover:text-white/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
