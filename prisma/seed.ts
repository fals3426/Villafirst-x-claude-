import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.match.deleteMany();
  await prisma.message.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vibeProfile.deleteMany();
  await prisma.villa.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // ============================================
  // COLOCATAIRES (5 users)
  // ============================================

  const alex = await prisma.user.create({
    data: {
      email: "alex.thompson@gmail.com",
      name: "Alex Thompson",
      password: "hashed_password_123",
      type: "COLOCATAIRE",
      avatar: "/avatars/alex.jpg",
      nationality: "USA",
      age: 28,
      languages: JSON.stringify(["English", "Español"]),
      verified: true,
      badges: JSON.stringify(["Verified ID", "Trusted Member", "Early Adopter"]),
    },
  });

  const sophie = await prisma.user.create({
    data: {
      email: "sophie.martin@gmail.com",
      name: "Sophie Martin",
      password: "hashed_password_123",
      type: "COLOCATAIRE",
      avatar: "/avatars/sophie.jpg",
      nationality: "France",
      age: 25,
      languages: JSON.stringify(["Français", "English"]),
      verified: true,
      badges: JSON.stringify(["Verified ID", "Wellness Guru"]),
    },
  });

  const jake = await prisma.user.create({
    data: {
      email: "jake.wilson@gmail.com",
      name: "Jake Wilson",
      password: "hashed_password_123",
      type: "COLOCATAIRE",
      avatar: "/avatars/jake.jpg",
      nationality: "Australia",
      age: 24,
      languages: JSON.stringify(["English"]),
      verified: false,
      badges: JSON.stringify([]),
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: "maria.garcia@gmail.com",
      name: "Maria Garcia",
      password: "hashed_password_123",
      type: "COLOCATAIRE",
      avatar: "/avatars/maria.jpg",
      nationality: "Spain",
      age: 30,
      languages: JSON.stringify(["Español", "English"]),
      verified: true,
      badges: JSON.stringify(["Verified ID", "Tech Pro"]),
    },
  });

  const tom = await prisma.user.create({
    data: {
      email: "tom.anderson@gmail.com",
      name: "Tom Anderson",
      password: "hashed_password_123",
      type: "COLOCATAIRE",
      avatar: "/avatars/tom.jpg",
      nationality: "UK",
      age: 27,
      languages: JSON.stringify(["English"]),
      verified: true,
      badges: JSON.stringify(["Verified ID", "Fitness Enthusiast"]),
    },
  });

  console.log("✅ Created 5 colocataires");

  // ============================================
  // PROPRIETAIRES (5 users)
  // ============================================

  const wayan = await prisma.user.create({
    data: {
      email: "wayan.putra@gmail.com",
      name: "Wayan Putra",
      password: "hashed_password_123",
      type: "PROPRIETAIRE",
      avatar: "/avatars/wayan.jpg",
      nationality: "Indonesia",
      age: 35,
      languages: JSON.stringify(["Bahasa Indonesia", "English"]),
      verified: true,
      badges: JSON.stringify(["Verified Owner", "Top Host", "Super Responsive"]),
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david.chen@gmail.com",
      name: "David Chen",
      password: "hashed_password_123",
      type: "PROPRIETAIRE",
      avatar: "/avatars/david.jpg",
      nationality: "Canada",
      age: 42,
      languages: JSON.stringify(["English", "中文"]),
      verified: true,
      badges: JSON.stringify(["Verified Owner", "Trusted Host"]),
    },
  });

  const emma = await prisma.user.create({
    data: {
      email: "emma.rodriguez@gmail.com",
      name: "Emma Rodriguez",
      password: "hashed_password_123",
      type: "PROPRIETAIRE",
      avatar: "/avatars/emma.jpg",
      nationality: "Mexico",
      age: 29,
      languages: JSON.stringify(["Español", "English"]),
      verified: true,
      badges: JSON.stringify(["Verified ID", "Trusted Member"]),
    },
  });

  const john = await prisma.user.create({
    data: {
      email: "john.smith@gmail.com",
      name: "John Smith",
      password: "hashed_password_123",
      type: "PROPRIETAIRE",
      avatar: "/avatars/john.jpg",
      nationality: "USA",
      age: 38,
      languages: JSON.stringify(["English"]),
      verified: true,
      badges: JSON.stringify(["Verified Owner"]),
    },
  });

  const lisa = await prisma.user.create({
    data: {
      email: "lisa.wong@gmail.com",
      name: "Lisa Wong",
      password: "hashed_password_123",
      type: "PROPRIETAIRE",
      avatar: "/avatars/lisa.jpg",
      nationality: "Singapore",
      age: 33,
      languages: JSON.stringify(["English", "中文"]),
      verified: false,
      badges: JSON.stringify([]),
    },
  });

  console.log("✅ Created 5 proprietaires");

  // ============================================
  // VIBE PROFILES (for colocataires)
  // ============================================

  await prisma.vibeProfile.create({
    data: {
      userId: alex.id,
      budget: "5-8M IDR",
      duration: "3 months",
      preferredZones: JSON.stringify(["Canggu", "Seminyak"]),
      interests: JSON.stringify(["Coworking", "Surf", "Beach clubs", "Networking", "Startups"]),
      lifestyle: JSON.stringify(["Digital Nomad", "Entrepreneur", "Social"]),
      workStyle: "Remote - Flexible hours",
      schedule: "Early riser, work 9-5, surf mornings",
      personalitySocial: 8,
      personalityOrganized: 7,
      personalityParty: 6,
      personalityFitness: 7,
      personalityCalm: 5,
      smokingOk: false,
      petsOk: true,
      veganOk: true,
      bio: "Building my startup remotely from Bali. Love surfing in the morning and working from cool cafes. Looking for motivated housemates who enjoy the hustle but also know how to have fun. Early riser, clean, and always down for a sunset session.",
    },
  });

  await prisma.vibeProfile.create({
    data: {
      userId: sophie.id,
      budget: "4-6M IDR",
      duration: "6 months",
      preferredZones: JSON.stringify(["Ubud", "Canggu"]),
      interests: JSON.stringify(["Yoga", "Meditation", "Healthy cooking", "Nature", "Breathwork"]),
      lifestyle: JSON.stringify(["Yoga", "Wellness", "Calm"]),
      workStyle: "Yoga instructor - Morning/evening classes",
      schedule: "Up at 5am for practice, classes until noon, evenings quiet",
      personalitySocial: 6,
      personalityOrganized: 9,
      personalityParty: 2,
      personalityFitness: 10,
      personalityCalm: 9,
      smokingOk: false,
      petsOk: true,
      veganOk: true,
      bio: "Yoga teacher looking for a peaceful villa to continue my practice and teaching. I love morning rituals, healthy cooking, and being surrounded by nature. Prefer quiet evenings and mindful living. Looking for like-minded souls.",
    },
  });

  await prisma.vibeProfile.create({
    data: {
      userId: jake.id,
      budget: "6-10M IDR",
      duration: "2 months",
      preferredZones: JSON.stringify(["Seminyak", "Canggu"]),
      interests: JSON.stringify(["Beach clubs", "Surfing", "Photography", "Nightlife", "Content creation"]),
      lifestyle: JSON.stringify(["Content Creator", "Party", "Beach"]),
      workStyle: "Content creator - Shoot during golden hour",
      schedule: "Sleep late, create content afternoon, party at night",
      personalitySocial: 10,
      personalityOrganized: 4,
      personalityParty: 10,
      personalityFitness: 6,
      personalityCalm: 3,
      smokingOk: true,
      petsOk: true,
      veganOk: false,
      bio: "Content creator here for the vibes! Always looking for the next photo spot and the best beach club. I work hard but play harder. Looking for fun housemates who don't mind music and spontaneous adventures.",
    },
  });

  await prisma.vibeProfile.create({
    data: {
      userId: maria.id,
      budget: "5-7M IDR",
      duration: "4 months",
      preferredZones: JSON.stringify(["Canggu", "Ubud"]),
      interests: JSON.stringify(["Coding", "Hiking", "Cooking", "Scooter trips", "Co-working"]),
      lifestyle: JSON.stringify(["Tech", "Balanced", "Explorer"]),
      workStyle: "Software engineer - 9 to 6 remote",
      schedule: "Morning gym, work during day, explore evenings",
      personalitySocial: 7,
      personalityOrganized: 8,
      personalityParty: 5,
      personalityFitness: 6,
      personalityCalm: 7,
      smokingOk: false,
      petsOk: true,
      veganOk: true,
      bio: "Senior dev working remotely from Bali. I love coding from rice field cafes and exploring the island on weekends. Looking for a balanced villa with good WiFi, nice people, and a mix of work and fun. Clean and respectful.",
    },
  });

  await prisma.vibeProfile.create({
    data: {
      userId: tom.id,
      budget: "4-6M IDR",
      duration: "3 months",
      preferredZones: JSON.stringify(["Canggu"]),
      interests: JSON.stringify(["Gym", "Surfing", "Meal prep", "Beach volleyball", "Running"]),
      lifestyle: JSON.stringify(["Fitness", "Healthy", "Social"]),
      workStyle: "Online fitness coaching - Flexible",
      schedule: "5am gym, clients morning/afternoon, beach evenings",
      personalitySocial: 8,
      personalityOrganized: 9,
      personalityParty: 4,
      personalityFitness: 10,
      personalityCalm: 6,
      smokingOk: false,
      petsOk: true,
      veganOk: true,
      bio: "Fitness coach living the Bali dream. Up early for the gym, surf sessions, and online clients. I meal prep on Sundays and keep things clean. Looking for active housemates who respect shared spaces and enjoy a healthy lifestyle.",
    },
  });

  console.log("✅ Created 5 vibe profiles");

  // ============================================
  // VILLAS (8 villas)
  // ============================================

  const villa1 = await prisma.villa.create({
    data: {
      title: "Modern Surf Villa - Canggu Beach",
      zone: "Canggu",
      exactLocation: "Jl. Batu Bolong No. 45, Canggu",
      latitude: -8.6478,
      longitude: 115.1385,
      ownerId: wayan.id,
      pricePerMonth: 6500000,
      priceEUR: 410,
      priceUSD: 440,
      currency: "IDR",
      deposit: 6500000,
      totalRooms: 4,
      availableRooms: 2,
      bathrooms: 3,
      photos: JSON.stringify([
        "/villas/canggu-surf/photo1.jpg",
        "/villas/canggu-surf/photo2.jpg",
        "/villas/canggu-surf/photo3.jpg",
        "/villas/canggu-surf/photo4.jpg",
        "/villas/canggu-surf/photo5.jpg",
        "/villas/canggu-surf/photo6.jpg",
        "/villas/canggu-surf/photo7.jpg",
      ]),
      description:
        "Beautiful 4-bedroom villa in the heart of Canggu, 5 minutes walk from Batu Bolong beach. Modern design with a spacious pool, fully equipped kitchen, and a dedicated coworking space. Perfect for digital nomads who love surfing. Great community of like-minded people already living here.",
      amenities: JSON.stringify([
        "WiFi 100Mbps",
        "Pool",
        "Kitchen",
        "Coworking space",
        "Parking",
        "Washing machine",
        "AC",
        "Hot water",
        "Garden",
        "Surf board storage",
        "BBQ area",
      ]),
      vibe: JSON.stringify(["Social", "Surf", "Digital Nomad", "Balanced"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Top Location", "Fast WiFi", "Pool"]),
      minimumStay: "1 month",
    },
  });

  const villa2 = await prisma.villa.create({
    data: {
      title: "Peaceful Jungle Villa - Ubud",
      zone: "Ubud",
      exactLocation: "Jl. Tirta Tawar No. 12, Ubud",
      latitude: -8.5069,
      longitude: 115.2625,
      ownerId: david.id,
      pricePerMonth: 4500000,
      priceEUR: 285,
      priceUSD: 305,
      currency: "IDR",
      deposit: 4500000,
      totalRooms: 3,
      availableRooms: 1,
      bathrooms: 2,
      photos: JSON.stringify([
        "/villas/ubud-jungle/photo1.jpg",
        "/villas/ubud-jungle/photo2.jpg",
        "/villas/ubud-jungle/photo3.jpg",
        "/villas/ubud-jungle/photo4.jpg",
        "/villas/ubud-jungle/photo5.jpg",
      ]),
      description:
        "Serene 3-bedroom villa nestled in the Ubud jungle with stunning rice terrace views. Traditional Balinese architecture meets modern comfort. Yoga shala on-site, organic garden, and a natural stone pool. Perfect for wellness enthusiasts seeking peace and inspiration.",
      amenities: JSON.stringify([
        "WiFi 50Mbps",
        "Natural pool",
        "Kitchen",
        "Yoga shala",
        "Parking",
        "Washing machine",
        "Fan & AC",
        "Hot water",
        "Organic garden",
        "Meditation space",
        "Rice field view",
      ]),
      vibe: JSON.stringify(["Wellness", "Yoga", "Nature", "Calm", "Spiritual"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Eco-Friendly", "Yoga Space"]),
      minimumStay: "2 months",
    },
  });

  const villa3 = await prisma.villa.create({
    data: {
      title: "Luxury Beach Villa - Seminyak",
      zone: "Seminyak",
      exactLocation: "Jl. Kayu Aya No. 88, Seminyak",
      latitude: -8.6891,
      longitude: 115.1568,
      ownerId: emma.id,
      pricePerMonth: 9500000,
      priceEUR: 600,
      priceUSD: 645,
      currency: "IDR",
      deposit: 19000000,
      totalRooms: 5,
      availableRooms: 3,
      bathrooms: 4,
      photos: JSON.stringify([
        "/villas/seminyak-luxury/photo1.jpg",
        "/villas/seminyak-luxury/photo2.jpg",
        "/villas/seminyak-luxury/photo3.jpg",
        "/villas/seminyak-luxury/photo4.jpg",
        "/villas/seminyak-luxury/photo5.jpg",
        "/villas/seminyak-luxury/photo6.jpg",
      ]),
      description:
        "Stunning 5-bedroom luxury villa in the heart of Seminyak, walking distance to the best beach clubs and restaurants. Infinity pool, modern interiors, and rooftop sunset lounge. Ideal for those who want the premium Bali lifestyle with all the conveniences.",
      amenities: JSON.stringify([
        "WiFi 150Mbps",
        "Infinity pool",
        "Full kitchen",
        "Workspace",
        "Parking",
        "Laundry service",
        "AC",
        "Hot water",
        "Rooftop lounge",
        "Gym equipment",
        "Smart TV",
        "Security 24/7",
      ]),
      vibe: JSON.stringify(["Luxury", "Beach clubs", "Social", "Upscale"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Premium", "Beach clubs nearby"]),
      minimumStay: "1 month",
    },
  });

  const villa4 = await prisma.villa.create({
    data: {
      title: "Canggu Party House",
      zone: "Canggu",
      exactLocation: "Jl. Pantai Berawa No. 22, Canggu",
      latitude: -8.6551,
      longitude: 115.1445,
      ownerId: john.id,
      pricePerMonth: 5500000,
      priceEUR: 350,
      priceUSD: 375,
      currency: "IDR",
      deposit: 5500000,
      totalRooms: 4,
      availableRooms: 2,
      bathrooms: 2,
      photos: JSON.stringify([
        "/villas/canggu-party/photo1.jpg",
        "/villas/canggu-party/photo2.jpg",
        "/villas/canggu-party/photo3.jpg",
        "/villas/canggu-party/photo4.jpg",
        "/villas/canggu-party/photo5.jpg",
      ]),
      description:
        "Fun 4-bedroom villa in Berawa, Canggu. Known for its lively atmosphere and social vibes. Large pool area perfect for pool parties, open-plan living, and close to all the best nightlife spots. If you're here for a good time, this is your place.",
      amenities: JSON.stringify([
        "WiFi 80Mbps",
        "Large pool",
        "Kitchen",
        "Parking",
        "Washing machine",
        "AC",
        "Hot water",
        "Sound system",
        "BBQ area",
        "Pool table",
      ]),
      vibe: JSON.stringify(["Party", "Beach clubs", "Young", "Social"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Social Hotspot"]),
      minimumStay: "1 month",
    },
  });

  const villa5 = await prisma.villa.create({
    data: {
      title: "Sanur Family Villa",
      zone: "Sanur",
      exactLocation: "Jl. Danau Tamblingan No. 55, Sanur",
      latitude: -8.6783,
      longitude: 115.2631,
      ownerId: lisa.id,
      pricePerMonth: 5000000,
      priceEUR: 315,
      priceUSD: 340,
      currency: "IDR",
      deposit: 5000000,
      totalRooms: 3,
      availableRooms: 1,
      bathrooms: 2,
      photos: JSON.stringify([
        "/villas/sanur-family/photo1.jpg",
        "/villas/sanur-family/photo2.jpg",
        "/villas/sanur-family/photo3.jpg",
        "/villas/sanur-family/photo4.jpg",
      ]),
      description:
        "Quiet and charming 3-bedroom villa in the peaceful Sanur area. Beautiful garden, clean pool, and a relaxed atmosphere. Close to local markets, the beach promenade, and family-friendly restaurants. Perfect for those seeking a calm and authentic Bali experience.",
      amenities: JSON.stringify([
        "WiFi 50Mbps",
        "Pool",
        "Kitchen",
        "Parking",
        "Washing machine",
        "AC",
        "Hot water",
        "Garden",
        "Bicycle rental",
      ]),
      vibe: JSON.stringify(["Calm", "Family-friendly", "Quiet", "Expat"]),
      verified: false,
      badges: JSON.stringify([]),
      minimumStay: "2 months",
    },
  });

  const villa6 = await prisma.villa.create({
    data: {
      title: "Uluwatu Cliff Villa",
      zone: "Uluwatu",
      exactLocation: "Jl. Labuan Sait No. 8, Uluwatu",
      latitude: -8.8291,
      longitude: 115.0849,
      ownerId: wayan.id,
      pricePerMonth: 7500000,
      priceEUR: 475,
      priceUSD: 510,
      currency: "IDR",
      deposit: 7500000,
      totalRooms: 3,
      availableRooms: 2,
      bathrooms: 2,
      photos: JSON.stringify([
        "/villas/uluwatu-cliff/photo1.jpg",
        "/villas/uluwatu-cliff/photo2.jpg",
        "/villas/uluwatu-cliff/photo3.jpg",
        "/villas/uluwatu-cliff/photo4.jpg",
        "/villas/uluwatu-cliff/photo5.jpg",
      ]),
      description:
        "Breathtaking 3-bedroom villa perched on the Uluwatu cliffs with panoramic ocean views. Perfect for surfers wanting access to world-class breaks. Secluded location offers ultimate privacy while being minutes from Padang Padang and Bingin beaches.",
      amenities: JSON.stringify([
        "WiFi 40Mbps",
        "Infinity pool",
        "Kitchen",
        "Parking",
        "AC",
        "Hot water",
        "Ocean view",
        "Cliff terrace",
        "Surf board storage",
      ]),
      vibe: JSON.stringify(["Surf", "Nature", "Isolated", "Adventure"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Ocean View", "Surf Paradise"]),
      minimumStay: "1 month",
    },
  });

  const villa7 = await prisma.villa.create({
    data: {
      title: "Canggu Entrepreneur Hub",
      zone: "Canggu",
      exactLocation: "Jl. Raya Semat No. 15, Canggu",
      latitude: -8.6512,
      longitude: 115.1312,
      ownerId: david.id,
      pricePerMonth: 7000000,
      priceEUR: 440,
      priceUSD: 475,
      currency: "IDR",
      deposit: 7000000,
      totalRooms: 5,
      availableRooms: 2,
      bathrooms: 3,
      photos: JSON.stringify([
        "/villas/canggu-hub/photo1.jpg",
        "/villas/canggu-hub/photo2.jpg",
        "/villas/canggu-hub/photo3.jpg",
        "/villas/canggu-hub/photo4.jpg",
        "/villas/canggu-hub/photo5.jpg",
        "/villas/canggu-hub/photo6.jpg",
      ]),
      description:
        "5-bedroom villa designed for entrepreneurs and remote professionals. Dedicated coworking space with standing desks, meeting room, and high-speed fiber internet. Weekly networking events and startup community. Work hard, play hard in the heart of Canggu.",
      amenities: JSON.stringify([
        "WiFi 200Mbps fiber",
        "Pool",
        "Full kitchen",
        "Coworking space",
        "Meeting room",
        "Standing desks",
        "Parking",
        "Washing machine",
        "AC",
        "Hot water",
        "Printer/Scanner",
        "Whiteboard",
      ]),
      vibe: JSON.stringify(["Startup", "Networking", "Coworking", "Professional"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Fast WiFi", "Coworking", "Startup Friendly"]),
      minimumStay: "1 month",
    },
  });

  const villa8 = await prisma.villa.create({
    data: {
      title: "Berawa Beach Villa",
      zone: "Berawa",
      exactLocation: "Jl. Pantai Berawa No. 67, Tibubeneng",
      latitude: -8.6601,
      longitude: 115.1485,
      ownerId: john.id,
      pricePerMonth: 6000000,
      priceEUR: 380,
      priceUSD: 408,
      currency: "IDR",
      deposit: 6000000,
      totalRooms: 4,
      availableRooms: 2,
      bathrooms: 2,
      photos: JSON.stringify([
        "/villas/berawa-beach/photo1.jpg",
        "/villas/berawa-beach/photo2.jpg",
        "/villas/berawa-beach/photo3.jpg",
        "/villas/berawa-beach/photo4.jpg",
        "/villas/berawa-beach/photo5.jpg",
      ]),
      description:
        "Charming 4-bedroom villa in the trendy Berawa area, close to Canggu. Great balance of social vibes and peaceful living. Short walk to Berawa beach, cafes, and restaurants. Comfortable rooms with good natural light and a lovely garden pool.",
      amenities: JSON.stringify([
        "WiFi 80Mbps",
        "Pool",
        "Kitchen",
        "Workspace",
        "Parking",
        "Washing machine",
        "AC",
        "Hot water",
        "Garden",
        "Bicycle rental",
      ]),
      vibe: JSON.stringify(["Balanced", "Beach", "Social", "Chill"]),
      verified: true,
      badges: JSON.stringify(["Verified Villa", "Great Location"]),
      minimumStay: "1 month",
    },
  });

  console.log("✅ Created 8 villas");

  // ============================================
  // BOOKINGS (current residents)
  // ============================================

  // Alex in Canggu Surf Villa
  await prisma.booking.create({
    data: {
      villaId: villa1.id,
      userId: alex.id,
      roomNumber: 1,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-04-15"),
      totalPrice: 19500000,
      status: "CONFIRMED",
      transactionId: "TXN_ALEX_001",
    },
  });

  // Maria in Canggu Surf Villa
  await prisma.booking.create({
    data: {
      villaId: villa1.id,
      userId: maria.id,
      roomNumber: 2,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-01"),
      totalPrice: 26000000,
      status: "CONFIRMED",
      transactionId: "TXN_MARIA_001",
    },
  });

  // Sophie in Ubud Jungle Villa
  await prisma.booking.create({
    data: {
      villaId: villa2.id,
      userId: sophie.id,
      roomNumber: 1,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2026-06-01"),
      totalPrice: 27000000,
      status: "CONFIRMED",
      transactionId: "TXN_SOPHIE_001",
    },
  });

  // Tom in Ubud Jungle Villa
  await prisma.booking.create({
    data: {
      villaId: villa2.id,
      userId: tom.id,
      roomNumber: 2,
      startDate: new Date("2026-01-10"),
      endDate: new Date("2026-04-10"),
      totalPrice: 13500000,
      status: "CONFIRMED",
      transactionId: "TXN_TOM_001",
    },
  });

  // Jake in Canggu Party House
  await prisma.booking.create({
    data: {
      villaId: villa4.id,
      userId: jake.id,
      roomNumber: 1,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-04-01"),
      totalPrice: 11000000,
      status: "CONFIRMED",
      transactionId: "TXN_JAKE_001",
    },
  });

  // PENDING requests (for owner dashboard testing)

  // Tom wants to join Canggu Surf Villa (Wayan's villa)
  await prisma.booking.create({
    data: {
      villaId: villa1.id,
      userId: tom.id,
      roomNumber: 3,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-06-01"),
      totalPrice: 19500000,
      status: "PENDING",
      transactionId: "TXN_TOM_PENDING_001",
    },
  });

  // Jake wants to join Uluwatu Cliff Villa (Wayan's villa)
  await prisma.booking.create({
    data: {
      villaId: villa6.id,
      userId: jake.id,
      roomNumber: 1,
      startDate: new Date("2026-03-15"),
      endDate: new Date("2026-05-15"),
      totalPrice: 15000000,
      status: "PENDING",
      transactionId: "TXN_JAKE_PENDING_001",
    },
  });

  // Maria wants to join Berawa Beach Villa (John's villa)
  await prisma.booking.create({
    data: {
      villaId: villa8.id,
      userId: maria.id,
      roomNumber: 1,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-07-01"),
      totalPrice: 18000000,
      status: "PENDING",
      transactionId: "TXN_MARIA_PENDING_001",
    },
  });

  console.log("✅ Created 8 bookings (5 confirmed + 3 pending)");

  // ============================================
  // MESSAGES
  // ============================================

  // Conversation: Alex <-> Wayan (visit request)
  const msgDate1 = new Date("2026-01-10T09:00:00");
  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: wayan.id,
      content: "Hi Wayan! I saw your Modern Surf Villa in Canggu and it looks amazing. I'm a digital nomad from the US looking for a place for 3 months. Is room 1 still available?",
      read: true,
      createdAt: msgDate1,
    },
  });

  await prisma.message.create({
    data: {
      senderId: wayan.id,
      receiverId: alex.id,
      content: "Hi Alex! Welcome to Bali! Yes, room 1 is available starting January 15th. It's a spacious room with AC, private bathroom, and direct pool access. The WiFi is 100Mbps - perfect for remote work. Would you like to schedule a visit?",
      read: true,
      createdAt: new Date("2026-01-10T10:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: wayan.id,
      content: "That sounds perfect! Can I come check it out tomorrow around 2pm? Also, are there other digital nomads currently living in the villa?",
      read: true,
      createdAt: new Date("2026-01-10T11:15:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: wayan.id,
      receiverId: alex.id,
      content: "Tomorrow 2pm works great! Yes, we currently have Maria, a software engineer from Spain, living here. She's been here for a month and loves it. I'll send you the location pin. See you tomorrow! 🤙",
      read: true,
      createdAt: new Date("2026-01-10T12:00:00"),
    },
  });

  // Conversation: Sophie <-> David (Ubud villa questions)
  await prisma.message.create({
    data: {
      senderId: sophie.id,
      receiverId: david.id,
      content: "Bonjour David! I'm a yoga teacher from France and your Ubud villa caught my eye. The yoga shala looks wonderful. Is there space for me to teach small private classes there?",
      read: true,
      createdAt: new Date("2025-11-20T08:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: david.id,
      receiverId: sophie.id,
      content: "Hi Sophie! The yoga shala is 6x8 meters with a beautiful view of the rice terraces. Many of our past guests have used it for small classes (up to 5 people). It has mats, blocks, and a sound system. You're very welcome to use it!",
      read: true,
      createdAt: new Date("2025-11-20T09:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: sophie.id,
      receiverId: david.id,
      content: "That sounds like a dream come true! How quiet is the villa? I practice meditation early in the morning and need a peaceful environment.",
      read: true,
      createdAt: new Date("2025-11-20T10:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: david.id,
      receiverId: sophie.id,
      content: "It's incredibly peaceful here. You'll hear birdsong and the sound of water from the nearby river. No traffic noise at all. The other guests we typically attract are wellness-focused people. I think you'd love it here!",
      read: true,
      createdAt: new Date("2025-11-20T11:00:00"),
    },
  });

  // Conversation: Maria <-> Emma (potential coloc discussion)
  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: emma.id,
      content: "Hey Emma! I saw you're managing the Seminyak luxury villa. I'm currently in Canggu but might move areas. What's the coworking situation like there?",
      read: true,
      createdAt: new Date("2026-02-05T14:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: emma.id,
      receiverId: maria.id,
      content: "Hi Maria! We have a dedicated workspace with standing desks and great WiFi (150Mbps). The vibe is more upscale - lots of entrepreneurs and remote workers in the area. Seminyak has amazing cafes to work from too!",
      read: true,
      createdAt: new Date("2026-02-05T15:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: emma.id,
      content: "Sounds great! The price is a bit higher than what I'm paying now. Any flexibility on longer stays?",
      read: false,
      createdAt: new Date("2026-02-05T16:00:00"),
    },
  });

  // Alex <-> Maria (colocs chatting - extended conversation)
  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: maria.id,
      content: "Hey Maria! Welcome to the villa! I'm in room 1. Want to grab dinner at Old Man's tonight? Great spot for sunset beers 🍻",
      read: true,
      createdAt: new Date("2026-02-02T17:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: alex.id,
      content: "Hey Alex! Thanks for the welcome! Old Man's sounds perfect. I've been wanting to check it out. See you at 6?",
      read: true,
      createdAt: new Date("2026-02-02T17:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: maria.id,
      content: "Perfect! Also, there's a coworking session at Dojo tomorrow morning if you want to join. Good WiFi and great coffee ☕",
      read: true,
      createdAt: new Date("2026-02-02T18:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: alex.id,
      content: "Oh yes, I've heard about Dojo! I'm in. What time do you usually get there?",
      read: true,
      createdAt: new Date("2026-02-02T18:15:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: maria.id,
      content: "I usually get there around 8:30 after a quick surf. We can grab a scooter together if you want!",
      read: true,
      createdAt: new Date("2026-02-03T07:45:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: alex.id,
      content: "Haha I'm not brave enough for the Bali traffic yet 😅 But I'll meet you there! I'll be the one with the huge laptop and noise-cancelling headphones 🎧",
      read: false,
      createdAt: new Date("2026-02-03T08:00:00"),
    },
  });

  // Jake <-> John (party house discussion)
  await prisma.message.create({
    data: {
      senderId: jake.id,
      receiverId: john.id,
      content: "Yo John! Your Canggu Party House looks EPIC. Is there really a pool table AND a sound system? 🎵",
      read: true,
      createdAt: new Date("2026-01-25T20:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: john.id,
      receiverId: jake.id,
      content: "Hey Jake! Yep, full setup! Sonos speakers in the living room and by the pool. We had a BBQ party last weekend with 20 people. The vibes are real! 🎉",
      read: true,
      createdAt: new Date("2026-01-25T21:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: jake.id,
      receiverId: john.id,
      content: "Insane! I'm a content creator so I'd love to shoot some pool party content there. Any rules about noise levels at night?",
      read: true,
      createdAt: new Date("2026-01-25T21:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: john.id,
      receiverId: jake.id,
      content: "Music down by 11pm to keep the neighbors happy, but otherwise we're pretty chill. The other residents love a good party. You'll fit right in! When are you thinking of moving in?",
      read: true,
      createdAt: new Date("2026-01-25T22:00:00"),
    },
  });

  // Sophie <-> Tom (Ubud villa colocs)
  await prisma.message.create({
    data: {
      senderId: sophie.id,
      receiverId: tom.id,
      content: "Hi Tom! I saw you just moved into the Ubud villa too. I'm Sophie, the yoga teacher in room 1. Welcome! 🧘‍♀️",
      read: true,
      createdAt: new Date("2026-01-11T08:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: tom.id,
      receiverId: sophie.id,
      content: "Hey Sophie! Nice to meet you! Yes, I arrived yesterday. This place is absolutely stunning. Do you do morning yoga sessions? I'd love to join!",
      read: true,
      createdAt: new Date("2026-01-11T08:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: sophie.id,
      receiverId: tom.id,
      content: "Every morning at 6am in the yoga shala! You're welcome to join. I also make smoothie bowls after if you want 🥣",
      read: true,
      createdAt: new Date("2026-01-11T09:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: tom.id,
      receiverId: sophie.id,
      content: "That's perfect! I'm an early riser too - usually hit the gym at 5am. Yoga + smoothie bowls sounds like the ideal morning routine. Count me in for tomorrow! 💪",
      read: false,
      createdAt: new Date("2026-01-11T09:30:00"),
    },
  });

  // Alex <-> David (Entrepreneur Hub inquiry)
  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: david.id,
      content: "Hey David! I'm currently at the Surf Villa but thinking about moving to your Entrepreneur Hub for the coworking space. Do you really have 200Mbps fiber?",
      read: true,
      createdAt: new Date("2026-02-08T10:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: david.id,
      receiverId: alex.id,
      content: "Hi Alex! Yes, 200Mbps symmetrical fiber, plus a backup 4G connection. We also have a meeting room with a whiteboard for calls and brainstorming. Several founders already living here - we do pizza nights every Thursday! 🍕",
      read: false,
      createdAt: new Date("2026-02-08T11:00:00"),
    },
  });

  // Jake <-> Alex (casual chat between colocs)
  await prisma.message.create({
    data: {
      senderId: jake.id,
      receiverId: alex.id,
      content: "Bro, you surf Batu Bolong right? What's the best time to go? I want to get some sick drone shots 🏄‍♂️",
      read: true,
      createdAt: new Date("2026-02-06T15:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: alex.id,
      receiverId: jake.id,
      content: "Early morning is the best! Around 6-7am, the waves are clean and not too crowded. Plus the light is perfect for photos. Want to meet at 6:30 tomorrow?",
      read: true,
      createdAt: new Date("2026-02-06T15:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: jake.id,
      receiverId: alex.id,
      content: "6:30am?! That's brutal... but for content, I'll do it 😂 See you there! I'll bring the drone",
      read: false,
      createdAt: new Date("2026-02-06T16:00:00"),
    },
  });

  // Maria <-> Sophie (cross-villa friendship)
  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: sophie.id,
      content: "Salut Sophie! Maria here, I'm a dev living in Canggu. I heard there's an amazing organic market near your villa in Ubud. Worth the trip?",
      read: true,
      createdAt: new Date("2026-02-04T12:00:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: sophie.id,
      receiverId: maria.id,
      content: "Coucou Maria! Oh oui, the Ubud Organic Market is incredible! Every Sunday morning. Fresh produce, homemade granola, amazing juices. You should definitely come! I can show you around 🌿",
      read: true,
      createdAt: new Date("2026-02-04T12:30:00"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: maria.id,
      receiverId: sophie.id,
      content: "That sounds amazing! I'll ride up this Sunday then. Also, I'm learning to cook Indonesian food - maybe we could do a cooking session together sometime?",
      read: false,
      createdAt: new Date("2026-02-04T13:00:00"),
    },
  });

  console.log("✅ Created 30+ messages");

  // ============================================
  // MATCHES
  // ============================================

  // Alex <-> Maria (high compatibility - both in Canggu, both tech/balanced)
  await prisma.match.create({
    data: {
      user1Id: alex.id,
      user2Id: maria.id,
      villaId: villa1.id,
      score: 87,
      status: "ACCEPTED",
    },
  });

  // Alex <-> Tom (good match - both active, social, Canggu)
  await prisma.match.create({
    data: {
      user1Id: alex.id,
      user2Id: tom.id,
      villaId: villa1.id,
      score: 78,
      status: "ACCEPTED",
    },
  });

  // Sophie <-> Tom (moderate - both fitness but different vibes)
  await prisma.match.create({
    data: {
      user1Id: sophie.id,
      user2Id: tom.id,
      villaId: villa2.id,
      score: 65,
      status: "ACCEPTED",
    },
  });

  // Alex <-> Jake (low match - different organization/party levels)
  await prisma.match.create({
    data: {
      user1Id: alex.id,
      user2Id: jake.id,
      villaId: villa4.id,
      score: 45,
      status: "PENDING",
    },
  });

  // Sophie <-> Maria (good match - both organized, calm, balanced)
  await prisma.match.create({
    data: {
      user1Id: sophie.id,
      user2Id: maria.id,
      villaId: villa2.id,
      score: 72,
      status: "PENDING",
    },
  });

  // Maria <-> Tom (decent match - both organized, fitness-aware)
  await prisma.match.create({
    data: {
      user1Id: maria.id,
      user2Id: tom.id,
      score: 70,
      status: "PENDING",
    },
  });

  // Jake <-> Tom (low match - party vs fitness focus)
  await prisma.match.create({
    data: {
      user1Id: jake.id,
      user2Id: tom.id,
      score: 38,
      status: "REJECTED",
    },
  });

  // Sophie <-> Jake (very low - opposite vibes)
  await prisma.match.create({
    data: {
      user1Id: sophie.id,
      user2Id: jake.id,
      score: 22,
      status: "REJECTED",
    },
  });

  console.log("✅ Created matches");

  console.log("");
  console.log("🎉 Database seeded successfully!");
  console.log("");
  console.log("📊 Summary:");
  console.log("   - 10 Users (5 colocataires + 5 proprietaires)");
  console.log("   - 5 Vibe Profiles");
  console.log("   - 8 Villas");
  console.log("   - 8 Bookings (5 confirmed + 3 pending)");
  console.log("   - 32 Messages");
  console.log("   - 8 Matches");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
