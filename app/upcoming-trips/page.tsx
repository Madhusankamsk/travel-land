import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Upcoming trips",
  description: "Upcoming trips – discover our next tours.",
};

export default async function UpcomingTripsPage() {
  const trips = await (prisma as any).tour.findMany({
    where: { status: "UPCOMING" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Upcoming trips
        </h1>
        <p className="mb-10 text-zinc-600">
          Upcoming tours – join us on the next adventure.
        </p>

        {trips.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-zinc-500">No upcoming trips at the moment.</p>
            <p className="mt-2 text-sm text-zinc-400">
              Check back later or browse our travel history.
            </p>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip: any) => (
              <li
                key={trip.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-full flex-col">
                  <Link
                    href={`/upcoming-trips/${trip.id}`}
                    className="block flex-1"
                  >
                    <article className="h-full">
                      {trip.heroImageUrl ? (
                        <div className="relative aspect-[16/10] w-full bg-zinc-200">
                          <Image
                            src={trip.heroImageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] w-full bg-zinc-200" />
                      )}
                      <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          {trip.durationLabel}
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-zinc-900">
                          {trip.title}
                        </h2>
                        {trip.introText && (
                          <p className="mt-3 line-clamp-3 text-sm text-zinc-600">
                            {trip.introText}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-lg font-semibold text-zinc-900">
                            €{Number(trip.basePrice).toLocaleString()}
                            <span className="text-sm font-normal text-zinc-500">
                              {" "}
                              per person
                            </span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                  {trip.programPdfUrl && (
                    <a
                      href={trip.programPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-4 mt-0 inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Program (PDF)
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
