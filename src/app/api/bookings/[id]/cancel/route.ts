import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking already cancelled" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    // Re-increment available rooms
    if (booking.status === "CONFIRMED") {
      await prisma.villa.update({
        where: { id: booking.villaId },
        data: { availableRooms: { increment: 1 } },
      });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
