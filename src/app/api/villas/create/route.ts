import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      zone,
      exactLocation,
      latitude,
      longitude,
      ownerId,
      pricePerMonth,
      priceEUR,
      priceUSD,
      currency,
      deposit,
      totalRooms,
      availableRooms,
      bathrooms,
      photos,
      description,
      amenities,
      vibe,
      minimumStay,
    } = body;

    // Validation
    if (!title || !zone || !ownerId || !priceEUR) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify owner exists and is a PROPRIETAIRE
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner || owner.type !== "PROPRIETAIRE") {
      return NextResponse.json(
        { error: "Invalid owner or not a proprietaire" },
        { status: 403 }
      );
    }

    const villa = await prisma.villa.create({
      data: {
        title,
        zone,
        exactLocation: exactLocation || "",
        latitude: latitude || 0,
        longitude: longitude || 0,
        ownerId,
        pricePerMonth: pricePerMonth || priceEUR * 17000,
        priceEUR,
        priceUSD: priceUSD || Math.round(priceEUR * 1.08),
        currency: currency || "EUR",
        deposit: deposit || priceEUR,
        totalRooms: totalRooms || 1,
        availableRooms: availableRooms || totalRooms || 1,
        bathrooms: bathrooms || 1,
        photos: JSON.stringify(photos || ["/placeholder-villa.jpg"]),
        description: description || "",
        amenities: JSON.stringify(amenities || []),
        vibe: JSON.stringify(vibe || []),
        verified: false,
        badges: JSON.stringify([]),
        minimumStay: minimumStay || "1 mois",
      },
    });

    return NextResponse.json(villa, { status: 201 });
  } catch (error) {
    console.error("Error creating villa:", error);
    return NextResponse.json(
      { error: "Failed to create villa" },
      { status: 500 }
    );
  }
}
