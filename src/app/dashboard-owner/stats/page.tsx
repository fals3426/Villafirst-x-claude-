"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3 } from "lucide-react";

export default function StatsPage() {
  return (
    <DashboardLayout requiredType="PROPRIETAIRE">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">
          Statistiques
        </h1>
        <p className="text-white/40 text-sm">
          Cette fonctionnalite arrive bientot
        </p>
        <div className="mt-4 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          Coming soon
        </div>
      </div>
    </DashboardLayout>
  );
}
