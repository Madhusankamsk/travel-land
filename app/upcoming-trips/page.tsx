import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { InnerPageHero } from "@/components/inner-page-hero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prossimi viaggi — TRAVEL-LAND.IT",
  description: "Scopri i prossimi tour in arrivo su TRAVEL-LAND.IT.",
};

export default async function UpcomingTripsPage() {
  const trips = await prisma.tour.findMany({
    where: { status: { in: ["UPCOMING", "OPEN"] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-travertine">
      <InnerPageHero
        title="Prossimi viaggi"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Prossimi viaggi" },
        ]}
      />

      <section className="bg-travertine py-16 lg:py-24" aria-labelledby="upcoming-trips-heading">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <header className="mb-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
              Prossimi viaggi
            </p>
            <h2
              id="upcoming-trips-heading"
              className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
            >
              I prossimi tour di TRAVEL-LAND.IT
            </h2>
          </header>

          {trips.length === 0 ? (
            <div className="rounded-[20px] border border-bone bg-white p-12 text-center shadow-[var(--shadow-sm)]">
              <p className="text-[15px] font-medium text-[#7A7060]">
                Al momento non ci sono viaggi in programma.
              </p>
              <p className="mt-2 text-[13px] text-[#B5A890]">
                Torna più tardi oppure esplora i nostri viaggi passati.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip: any) => (
                <li key={trip.id}>
                  <article className="group overflow-hidden rounded-[20px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                    <div className="relative h-[220px] overflow-hidden">
                      {trip.heroImageUrl ? (
                        <Image
                          src={trip.heroImageUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-parchment" aria-hidden />
                      )}

                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 via-transparent to-transparent"
                        aria-hidden
                      />

                      {trip.durationLabel && (
                        <span className="absolute left-4 top-4 rounded-full border border-oro/30 bg-oro/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-bronze backdrop-blur-sm">
                          {trip.durationLabel}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                        {trip.title}
                      </h3>

                      {trip.introText && (
                        <p className="mb-5 line-clamp-3 text-[13px] leading-relaxed text-[#7A7060]">
                          {trip.introText}
                        </p>
                      )}

                      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-bone pt-4">
                        <div>
                          <p className="text-[11px] text-[#7A7060]">Da</p>
                          <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-obsidian">
                            €{Number(trip.basePrice).toLocaleString()}
                            <span className="ml-1 text-[13px] font-normal opacity-60">
                              a persona
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/upcoming-trips/${trip.id}`}
                            className="inline-flex items-center justify-center rounded-full border border-bone bg-white px-4 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
                          >
                            Vedi dettagli
                          </Link>
                        </div>
                      </div>

                      {trip.programPdfUrl && (
                        <div className="mt-4">
                          <a
                            href={trip.programPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-full border border-bone bg-parchment/60 px-5 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-parchment"
                          >
                            Programma (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
