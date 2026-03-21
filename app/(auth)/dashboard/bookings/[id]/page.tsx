import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  DEPOSIT_PAID: "Deposit paid",
  PAID: "Paid",
  COMPLETED: "Completed",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tour: true,
      user: true,
    },
  });

  if (!booking) notFound();

  const otherBookings = await prisma.booking.findMany({
    where: {
      userId: booking.userId,
      id: { not: bookingId },
    },
    include: { tour: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const userName =
    booking.user.firstName || booking.user.lastName
      ? [booking.user.firstName, booking.user.lastName].filter(Boolean).join(" ")
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/dashboard/trips"
          className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Trips
        </Link>
        <span className="text-zinc-400 dark:text-zinc-500">/</span>
        <Link
          href={`/dashboard/trips/${booking.tourId}/stats`}
          className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {booking.tour.title}
        </Link>
        <span className="text-zinc-400 dark:text-zinc-500">/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {booking.reference ?? `Booking ${bookingId.slice(0, 8)}`}
        </span>
      </div>

      {/* Selected trip + booking (main focus) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Booking & trip details
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              This booking
            </h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Reference</dt>
                <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {booking.reference ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
                <dd>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    {statusLabels[booking.status] ?? booking.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Created</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {new Date(booking.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Updated</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {new Date(booking.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Trip
            </h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Title</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{booking.tour.title}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Duration</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">{booking.tour.durationLabel}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Base price</dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  €{Number(booking.tour.basePrice).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Trip status</dt>
                <dd>
                  <span
                    className={
                      booking.tour.status === "UPCOMING" || booking.tour.status === "OPEN"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                    }
                  >
                    {booking.tour.status === "UPCOMING"
                      ? "Upcoming"
                      : booking.tour.status === "OPEN"
                        ? "Open"
                        : booking.tour.status === "SOLD_OUT"
                          ? "Sold out"
                          : "Completed"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* User details (partial) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          User
        </h2>
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {userName && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">{userName}</dd>
            </div>
          )}
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="text-zinc-900 dark:text-zinc-100">{booking.user.email}</dd>
          </div>
          {booking.user.mobile && (
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Mobile</dt>
              <dd className="text-zinc-900 dark:text-zinc-100">{booking.user.mobile}</dd>
            </div>
          )}
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Role</dt>
            <dd className="text-zinc-900 dark:text-zinc-100">{booking.user.role}</dd>
          </div>
        </dl>
      </section>

      {/* User's other bookings (partial) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Other bookings by this user
        </h2>
        {otherBookings.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            No other bookings.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  <th className="pb-2 font-medium">Reference</th>
                  <th className="pb-2 font-medium">Trip</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Created</th>
                  <th className="pb-2 font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {otherBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="py-2 font-mono text-zinc-700 dark:text-zinc-300">
                      {b.reference ?? "—"}
                    </td>
                    <td className="py-2 text-zinc-700 dark:text-zinc-300">{b.tour.title}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                        {statusLabels[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="py-2 text-zinc-500 dark:text-zinc-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
