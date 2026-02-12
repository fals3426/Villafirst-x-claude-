import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !["CONFIRMED", "CANCELLED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: true,
        villa: true,
      },
    });

    // If accepting a PENDING booking, decrement available rooms
    if (booking.status === "PENDING" && status === "CONFIRMED") {
      await prisma.villa.update({
        where: { id: booking.villaId },
        data: { availableRooms: { decrement: 1 } },
      });
    }

    // If cancelling a CONFIRMED booking, increment available rooms
    if (booking.status === "CONFIRMED" && status === "CANCELLED") {
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
