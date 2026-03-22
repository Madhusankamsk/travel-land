import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { InnerPageHero } from "@/components/inner-page-hero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upcoming trips — TRAVEL-LAND.IT",
  description: "Discover upcoming tours on TRAVEL-LAND.IT.",
};

function formatTripPrice(amount: number, currency: string) {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

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
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
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
              {trips.map((trip) => {
                const eyebrow =
                  trip.tripSubtitle?.trim() ||
                  [trip.destinationCountry, trip.destinationCities]
                    .filter(Boolean)
                    .join(" · ") ||
                  trip.tripCategory?.trim() ||
                  "Prossimi viaggi";

                return (
                  <li key={trip.id}>
                    <article className="group relative overflow-hidden rounded-[20px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-[var(--dur-normal)] ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] motion-reduce:transform-none motion-reduce:transition-none">
                      {/* Full-card hit target (design system: destination card) */}
                      <Link
                        href={`/upcoming-trips/${trip.id}`}
                        className="absolute inset-0 z-[1] rounded-[20px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px]"
                        aria-label={`Vedi dettagli: ${trip.title}`}
                      />

                      <div className="pointer-events-none relative z-0">
                        <div className="relative h-[220px] overflow-hidden">
                          {trip.heroImageUrl ? (
                            <Image
                              src={trip.heroImageUrl}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-105 motion-reduce:transition-none"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full bg-parchment" aria-hidden />
                          )}

                          <div
                            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,23,20,0.2)_0%,rgba(107,58,42,0.35)_50%,rgba(26,23,20,0.6)_100%)]"
                            aria-hidden
                          />

                          {trip.durationLabel && (
                            <span className="absolute top-4 left-4 rounded-full bg-obsidian/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne backdrop-blur-sm">
                              {trip.durationLabel}
                            </span>
                          )}
                        </div>

                        <div className="p-6">
                          <p className="mb-2 line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                            {eyebrow}
                          </p>
                          <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian">
                            {trip.title}
                          </h3>

                          {trip.introText && (
                            <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-[#7A7060]">
                              {trip.introText}
                            </p>
                          )}

                          <div className="border-t border-bone pt-4">
                            <p className="text-[11px] text-[#7A7060]">Da</p>
                            <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-obsidian">
                              {formatTripPrice(Number(trip.basePrice), trip.currency)}
                              <span className="ml-1 text-[13px] font-normal opacity-60">
                                a pers.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {trip.programPdfUrl && (
                        <div className="relative z-10 mt-4 px-6 pb-6">
                          <a
                            href={trip.programPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex w-full min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-bone bg-parchment px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-obsidian transition-colors duration-[var(--dur-fast)] hover:bg-bone/80 focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 active:scale-[0.97]"
                          >
                            Programma (PDF)
                          </a>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
