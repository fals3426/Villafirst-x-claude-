import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const existing = await prisma.vibeProfile.findUnique({
      where: { userId: params.id },
    });

    if (!existing) {
      // Create if doesn't exist
      const profile = await prisma.vibeProfile.create({
        data: {
          userId: params.id,
          budget: body.budget ?? "",
          duration: body.duration ?? "",
          preferredZones: body.preferredZones ?? "[]",
          interests: body.interests ?? "[]",
          lifestyle: body.lifestyle ?? "[]",
          workStyle: body.workStyle ?? null,
          schedule: body.schedule ?? null,
          personalitySocial: body.personalitySocial ?? 5,
          personalityOrganized: body.personalityOrganized ?? 5,
          personalityParty: body.personalityParty ?? 5,
          personalityFitness: body.personalityFitness ?? 5,
          personalityCalm: body.personalityCalm ?? 5,
          smokingOk: body.smokingOk ?? false,
          petsOk: body.petsOk ?? true,
          veganOk: body.veganOk ?? true,
          bio: body.bio ?? null,
        },
      });
      return NextResponse.json(profile);
    }

    const profile = await prisma.vibeProfile.update({
      where: { userId: params.id },
      data: {
        ...(body.budget !== undefined && { budget: body.budget }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.preferredZones !== undefined && { preferredZones: body.preferredZones }),
        ...(body.interests !== undefined && { interests: body.interests }),
        ...(body.lifestyle !== undefined && { lifestyle: body.lifestyle }),
        ...(body.workStyle !== undefined && { workStyle: body.workStyle }),
        ...(body.schedule !== undefined && { schedule: body.schedule }),
        ...(body.personalitySocial !== undefined && { personalitySocial: body.personalitySocial }),
        ...(body.personalityOrganized !== undefined && { personalityOrganized: body.personalityOrganized }),
        ...(body.personalityParty !== undefined && { personalityParty: body.personalityParty }),
        ...(body.personalityFitness !== undefined && { personalityFitness: body.personalityFitness }),
        ...(body.personalityCalm !== undefined && { personalityCalm: body.personalityCalm }),
        ...(body.smokingOk !== undefined && { smokingOk: body.smokingOk }),
        ...(body.petsOk !== undefined && { petsOk: body.petsOk }),
        ...(body.veganOk !== undefined && { veganOk: body.veganOk }),
        ...(body.bio !== undefined && { bio: body.bio }),
      },
    });

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
