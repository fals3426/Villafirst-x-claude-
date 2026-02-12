import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const zone = searchParams.get("zone");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const vibe = searchParams.get("vibe");
    const verified = searchParams.get("verified");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (zone && zone !== "all") {
      where.zone = zone;
    }

    if (minPrice || maxPrice) {
      where.priceEUR = {};
      if (minPrice) where.priceEUR.gte = parseInt(minPrice);
      if (maxPrice) where.priceEUR.lte = parseInt(maxPrice);
    }

    if (verified === "true") {
      where.verified = true;
    }

    let villas = await prisma.villa.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
          },
        },
        bookings: {
          where: { status: "CONFIRMED" },
          select: { userId: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter by vibe (stored as JSON string) - SQLite doesn't support JSON contains natively
    if (vibe) {
      villas = villas.filter((v) => {
        try {
          const vibes: string[] = JSON.parse(v.vibe);
          return vibes.some(
            (vibeItem) =>
              vibeItem.toLowerCase().includes(vibe.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }

    return NextResponse.json(villas);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
