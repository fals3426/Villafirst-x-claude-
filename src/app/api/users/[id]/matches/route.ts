import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: params.id }, { user2Id: params.id }],
      },
      include: {
        user1: { include: { vibeProfile: true } },
        user2: { include: { vibeProfile: true } },
        villa: true,
      },
      orderBy: { score: "desc" },
    });

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
