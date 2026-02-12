export interface VibeProfileData {
  interests: string;
  lifestyle: string;
  personalitySocial: number;
  personalityOrganized: number;
  personalityParty: number;
  personalityFitness: number;
  personalityCalm: number;
}

export function calculateVibeScore(
  profile1: VibeProfileData | null,
  profile2: VibeProfileData | null
): number {
  if (!profile1 || !profile2) return 0;

  // Parse JSON strings
  let interests1: string[] = [];
  let interests2: string[] = [];
  let lifestyle1: string[] = [];
  let lifestyle2: string[] = [];

  try {
    interests1 = JSON.parse(profile1.interests);
  } catch {
    interests1 = [];
  }
  try {
    interests2 = JSON.parse(profile2.interests);
  } catch {
    interests2 = [];
  }
  try {
    lifestyle1 = JSON.parse(profile1.lifestyle);
  } catch {
    lifestyle1 = [];
  }
  try {
    lifestyle2 = JSON.parse(profile2.lifestyle);
  } catch {
    lifestyle2 = [];
  }

  // Common interests (40%)
  const commonInterests = interests1.filter((i: string) =>
    interests2.includes(i)
  ).length;
  const interestScore =
    (commonInterests / Math.max(interests1.length, 1)) * 40;

  // Compatible lifestyle (40%)
  const commonLifestyle = lifestyle1.filter((l: string) =>
    lifestyle2.includes(l)
  ).length;
  const lifestyleScore =
    (commonLifestyle / Math.max(lifestyle1.length, 1)) * 40;

  // Similar personality (20%)
  const personalityDiff =
    (Math.abs(profile1.personalitySocial - profile2.personalitySocial) +
      Math.abs(profile1.personalityParty - profile2.personalityParty) +
      Math.abs(profile1.personalityCalm - profile2.personalityCalm)) /
    30;
  const personalityScore = (1 - personalityDiff) * 20;

  const total = Math.round(interestScore + lifestyleScore + personalityScore);
  return Math.min(Math.max(total, 0), 100);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald/10 border-emerald/30";
  if (score >= 60) return "bg-yellow-500/10 border-yellow-500/30";
  return "bg-red-500/10 border-red-500/30";
}

export function getScoreRingColor(score: number): string {
  if (score >= 80) return "stroke-emerald";
  if (score >= 60) return "stroke-yellow-400";
  return "stroke-red-400";
}

export function getMatchDetails(
  profile1: VibeProfileData,
  profile2: VibeProfileData
) {
  let interests1: string[] = [];
  let interests2: string[] = [];
  let lifestyle1: string[] = [];
  let lifestyle2: string[] = [];

  try {
    interests1 = JSON.parse(profile1.interests);
  } catch {
    interests1 = [];
  }
  try {
    interests2 = JSON.parse(profile2.interests);
  } catch {
    interests2 = [];
  }
  try {
    lifestyle1 = JSON.parse(profile1.lifestyle);
  } catch {
    lifestyle1 = [];
  }
  try {
    lifestyle2 = JSON.parse(profile2.lifestyle);
  } catch {
    lifestyle2 = [];
  }

  const commonInterests = interests1.filter((i: string) =>
    interests2.includes(i)
  );
  const commonLifestyle = lifestyle1.filter((l: string) =>
    lifestyle2.includes(l)
  );

  const differences: string[] = [];
  if (Math.abs(profile1.personalitySocial - profile2.personalitySocial) > 3) {
    differences.push("Niveau social different");
  }
  if (Math.abs(profile1.personalityParty - profile2.personalityParty) > 3) {
    differences.push("Rapport a la fete different");
  }
  if (Math.abs(profile1.personalityCalm - profile2.personalityCalm) > 3) {
    differences.push("Besoin de calme different");
  }
  if (
    Math.abs(profile1.personalityOrganized - profile2.personalityOrganized) > 3
  ) {
    differences.push("Niveau d'organisation different");
  }
  if (
    Math.abs(profile1.personalityFitness - profile2.personalityFitness) > 3
  ) {
    differences.push("Rapport au sport different");
  }

  return {
    commonInterests,
    commonLifestyle,
    differences,
  };
}
