import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("ownerId");

  if (!ownerId) {
    return NextResponse.json(
      { error: "ownerId required" },
      { status: 400 }
    );
  }

  try {
    // Get all villas owned by this user, then all bookings for those villas
    const villas = await prisma.villa.findMany({
      where: { ownerId },
      select: { id: true },
    });

    const villaIds = villas.map((v) => v.id);

    const bookings = await prisma.booking.findMany({
      where: { villaId: { in: villaIds } },
      include: {
        user: { include: { vibeProfile: true } },
        villa: {
          select: {
            id: true,
            title: true,
            zone: true,
            photos: true,
            priceEUR: true,
            totalRooms: true,
            availableRooms: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
