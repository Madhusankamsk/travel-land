import { prisma } from "@/lib/prisma";
import { InnerPageHero } from "@/components/inner-page-hero";
import { UpcomingTourCard } from "@/components/upcoming-tour-card";
import { getTourEyebrow } from "@/lib/tour-eyebrow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upcoming trips — TRAVEL-LAND.IT",
  description: "Discover upcoming tours on TRAVEL-LAND.IT.",
};

export default async function UpcomingTripsPage() {
  const trips = await prisma.tour.findMany({
    where: { status: { in: ["UPCOMING", "OPEN"] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-travertine">
      <InnerPageHero
        title="Upcoming trips"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Upcoming trips" },
        ]}
      />

      <section className="bg-travertine py-16 lg:py-24" aria-labelledby="upcoming-trips-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <header className="mb-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
              Upcoming trips
            </p>
            <h2
              id="upcoming-trips-heading"
              className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
            >
              Upcoming tours from TRAVEL-LAND.IT
            </h2>
          </header>

          {trips.length === 0 ? (
            <div className="rounded-[20px] border border-bone bg-white p-12 text-center shadow-[var(--shadow-sm)]">
              <p className="text-[15px] font-medium text-[#7A7060]">
                There are no trips scheduled at the moment.
              </p>
              <p className="mt-2 text-[13px] text-[#B5A890]">
                Check back soon or explore our past trips.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <li key={trip.id}>
                  <UpcomingTourCard
                    tour={{
                      id: trip.id,
                      title: trip.title,
                      eyebrow: getTourEyebrow(trip),
                      introText: trip.introText,
                      heroImageUrl: trip.heroImageUrl,
                      durationLabel: trip.durationLabel,
                      basePrice: Number(trip.basePrice),
                      currency: trip.currency,
                      programPdfUrl: trip.programPdfUrl,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
