import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingList } from "./booking-list";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  DEPOSIT_PAID: "Deposit paid",
  PAID: "Paid",
  COMPLETED: "Completed",
};

export default async function TripStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      days: { orderBy: { order: "asc" } },
      bookings: { include: { user: true } },
    },
  });

  if (!tour) notFound();

  const bookingsByStatus = tour.bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const completedOrPaid = tour.bookings.filter(
    (b) => b.status === "PAID" || b.status === "COMPLETED"
  ).length;
  const potentialRevenue = completedOrPaid * Number(tour.basePrice);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/trips"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Trips
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Stats: {tour.title}
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Trip overview
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {tour.status === "UPCOMING" ? "Upcoming" : "Past"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Duration</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{tour.durationLabel}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Base price</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                €{Number(tour.basePrice).toLocaleString()}
              </dd>
            </div>
            {tour.singleSupplement != null && (
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Single supplement</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  €{Number(tour.singleSupplement).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Bookings
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Total bookings</dt>
              <dd className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {tour.bookings.length}
              </dd>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <dt className="mb-2 text-zinc-500 dark:text-zinc-400">By status</dt>
              <dd className="space-y-1">
                {(Object.entries(bookingsByStatus) as [string, number][]).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="flex justify-between text-zinc-700 dark:text-zinc-300"
                    >
                      <span>{statusLabels[status] ?? status}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                )}
                {tour.bookings.length === 0 && (
                  <p className="text-zinc-500 dark:text-zinc-400">No bookings yet</p>
                )}
              </dd>
            </div>
            {tour.bookings.length > 0 && (
              <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <dt className="text-zinc-500 dark:text-zinc-400">Revenue (paid/completed)</dt>
                <dd className="font-semibold text-zinc-900 dark:text-zinc-100">
                  €{potentialRevenue.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Itinerary (days)
          </h2>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {tour.days.length} <span className="text-base font-normal text-zinc-600 dark:text-zinc-400">days</span>
          </p>
          <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-sm text-zinc-600 dark:text-zinc-400">
            {tour.days.map((day) => (
              <li key={day.id} className="truncate">
                {day.dayHeading}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {tour.bookings.length > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Booking list
          </h2>
          <BookingList
            bookings={tour.bookings.map((b) => ({
              id: b.id,
              reference: b.reference,
              status: b.status,
              createdAt: b.createdAt.toISOString(),
              updatedAt: b.updatedAt.toISOString(),
              user: {
                id: b.user.id,
                email: b.user.email,
                firstName: b.user.firstName,
                lastName: b.user.lastName,
                mobile: b.user.mobile,
                role: b.user.role,
              },
            }))}
          />
        </section>
      )}
    </div>
  );
}
