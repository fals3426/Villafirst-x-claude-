import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { villaId, userId, roomNumber, startDate, endDate, totalPrice, transactionId } = body;

    if (!villaId || !userId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user exists (can be stale after re-seed)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    // Verify villa exists and has available rooms
    const villa = await prisma.villa.findUnique({
      where: { id: villaId },
    });

    if (!villa) {
      return NextResponse.json(
        { error: "Villa not found" },
        { status: 404 }
      );
    }

    if (villa.availableRooms <= 0) {
      return NextResponse.json(
        { error: "No rooms available" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        villaId,
        userId,
        roomNumber: roomNumber || 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: totalPrice || villa.priceEUR,
        status: "CONFIRMED",
        transactionId: transactionId || null,
      },
      include: {
        villa: true,
        user: true,
      },
    });

    // Decrement available rooms
    await prisma.villa.update({
      where: { id: villaId },
      data: { availableRooms: { decrement: 1 } },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId required" },
      { status: 400 }
    );
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        villa: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
