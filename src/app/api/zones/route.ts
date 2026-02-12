import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const villas = await prisma.villa.findMany({
    select: { zone: true, availableRooms: true },
  });

  const zoneCounts: Record<string, { total: number; available: number }> = {};

  for (const villa of villas) {
    if (!zoneCounts[villa.zone]) {
      zoneCounts[villa.zone] = { total: 0, available: 0 };
    }
    zoneCounts[villa.zone].total += 1;
    zoneCounts[villa.zone].available += villa.availableRooms;
  }

  return NextResponse.json(zoneCounts);
}
