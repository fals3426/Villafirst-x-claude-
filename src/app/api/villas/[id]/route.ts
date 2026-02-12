import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const villa = await prisma.villa.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true,
            languages: true,
            nationality: true,
            badges: true,
          },
        },
        bookings: {
          where: { status: "CONFIRMED" },
          include: {
            user: {
              include: {
                vibeProfile: true,
              },
            },
          },
        },
      },
    });

    if (!villa) {
      return NextResponse.json({ error: "Villa not found" }, { status: 404 });
    }

    // Extract current roommates from confirmed bookings
    const roommates = villa.bookings.map((b) => b.user);

    return NextResponse.json({
      ...villa,
      roommates,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const villa = await prisma.villa.update({
      where: { id: params.id },
      data: {
        ...(body.verified !== undefined && { verified: body.verified }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    return NextResponse.json(villa);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related records first
    await prisma.match.deleteMany({ where: { villaId: params.id } });
    await prisma.booking.deleteMany({ where: { villaId: params.id } });

    await prisma.villa.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
