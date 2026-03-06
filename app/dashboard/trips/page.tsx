import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteTripButton } from "./delete-trip-button";

export default async function TripsPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { updatedAt: "desc" },
    include: { days: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Trips</h1>
        <Link
          href="/dashboard/trips/create"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Create trip
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 font-medium text-zinc-700">Title</th>
              <th className="px-4 py-3 font-medium text-zinc-700">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-700">Duration</th>
              <th className="px-4 py-3 font-medium text-zinc-700">Price</th>
              <th className="px-4 py-3 font-medium text-zinc-700">Days</th>
              <th className="px-4 py-3 font-medium text-zinc-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No trips yet. Create your first trip.
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr
                  key={tour.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {tour.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        tour.status === "UPCOMING"
                          ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                          : "rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700"
                      }
                    >
                      {tour.status === "UPCOMING" ? "Upcoming" : "Past"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {tour.durationLabel}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    €{Number(tour.basePrice).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{tour.days.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {tour.status === "UPCOMING" && (
                        <Link
                          href={`/upcoming-trips/${tour.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/trips/${tour.id}/edit`}
                        className="text-xs font-medium text-zinc-700 hover:text-zinc-900"
                      >
                        Edit
                      </Link>
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
