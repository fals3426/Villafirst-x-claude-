import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const villas = await prisma.villa.findMany({
      where: { ownerId: params.id },
      include: {
        bookings: {
          include: { user: true },
          where: { status: "CONFIRMED" },
        },
      },
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
