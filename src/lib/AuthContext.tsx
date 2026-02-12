"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface VibeProfile {
  id: string;
  userId: string;
  budget: string;
  duration: string;
  preferredZones: string;
  interests: string;
  lifestyle: string;
  workStyle: string | null;
  schedule: string | null;
  personalitySocial: number;
  personalityOrganized: number;
  personalityParty: number;
  personalityFitness: number;
  personalityCalm: number;
  smokingOk: boolean;
  petsOk: boolean;
  veganOk: boolean;
  bio: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: string;
  avatar: string | null;
  nationality: string | null;
  age: number | null;
  languages: string;
  verified: boolean;
  badges: string;
  createdAt: string;
  vibeProfile: VibeProfile | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<User>;
  loginById: (userId: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("villa-first-userId");
    if (savedUserId) {
      fetch(`/api/users/${savedUserId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("User not found");
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("villa-first-userId");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string): Promise<User> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }

    const userData: User = await res.json();
    localStorage.setItem("villa-first-userId", userData.id);
    setUser(userData);
    return userData;
  }, []);

  const loginById = useCallback(async (userId: string): Promise<User> => {
    const res = await fetch(`/api/users/${userId}`);

    if (!res.ok) {
      throw new Error("User not found");
    }

    const userData: User = await res.json();
    localStorage.setItem("villa-first-userId", userData.id);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("villa-first-userId");
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginById, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
