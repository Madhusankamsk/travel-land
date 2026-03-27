import { prisma } from "@/lib/prisma";
import { HomePageClient } from "@/components/home-page-client";
import { getTourEyebrow } from "@/lib/tour-eyebrow";

export const dynamic = "force-dynamic";

export default async function Home() {
  let trips: Awaited<ReturnType<typeof prisma.tour.findMany>> = [];
  try {
    trips = await prisma.tour.findMany({
      where: { status: { in: ["UPCOMING", "OPEN"] } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown database error";
    console.warn(`[home] Failed to load tours from database: ${reason}`);
  }

  const upcomingTrips = trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    eyebrow: getTourEyebrow(trip),
    introText: trip.introText,
    heroImageUrl: trip.heroImageUrl,
    durationLabel: trip.durationLabel,
    basePrice: Number(trip.basePrice),
    currency: trip.currency,
    programPdfUrl: trip.programPdfUrl,
  }));

  return <HomePageClient upcomingTrips={upcomingTrips} />;
}
