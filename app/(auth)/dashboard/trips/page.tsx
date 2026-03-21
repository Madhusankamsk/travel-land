import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { summarizeCancellationPenalties } from "@/lib/cancellation-penalties";
import { DeleteTripButton } from "./delete-trip-button";
import { EditTripButton } from "./edit-trip-button";

export const dynamic = "force-dynamic";

const tripsQuery = {
  orderBy: { updatedAt: "desc" as const },
  include: { days: { orderBy: { order: "asc" as const } } },
} as const;

export default async function TripsPage() {
  let tours: Awaited<ReturnType<typeof prisma.tour.findMany<typeof tripsQuery>>> =
    [];
  try {
    tours = await prisma.tour.findMany(tripsQuery);
  } catch {
    // Table may not exist yet or DB unreachable — show empty state
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">Trips</h1>
        <Link
          href="/dashboard/trips/create"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
        >
          Create trip
        </Link>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Title</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Duration</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Price</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300 max-w-[200px]">
                Cancellation
              </th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Days</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No trips yet. Create your first trip.
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {tour.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        tour.status === "UPCOMING" || tour.status === "OPEN"
                          ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                      }
                    >
                      {tour.status === "UPCOMING"
                        ? "Upcoming"
                        : tour.status === "OPEN"
                          ? "Open"
                          : tour.status === "SOLD_OUT"
                            ? "Sold out"
                            : "Completed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {tour.durationLabel}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    €{Number(tour.basePrice).toLocaleString()}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-xs leading-snug text-zinc-600 dark:text-zinc-400">
                    {summarizeCancellationPenalties(tour.cancellationPenalties)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{tour.days.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {(tour.status === "UPCOMING" || tour.status === "OPEN" || tour.status === "SOLD_OUT") && (
                        <Link
                          href={`/upcoming-trips/${tour.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/trips/${tour.id}/stats`}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        Stats
                      </Link>
                      <EditTripButton href={`/dashboard/trips/${tour.id}/edit`} />
                      <DeleteTripButton
                        tourId={tour.id}
                        tourTitle={tour.title}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
