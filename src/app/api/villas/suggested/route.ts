import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const zones = searchParams.get("zones");
    const limit = parseInt(searchParams.get("limit") || "3");

    const where = zones
      ? { zone: { in: zones.split(",") }, availableRooms: { gt: 0 } }
      : { availableRooms: { gt: 0 } };

    const villas = await prisma.villa.findMany({
      where,
      include: { owner: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(villas);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
