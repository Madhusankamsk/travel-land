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
          className="font-medium text-zinc-600 hover:text-zinc-900"
        >
          Trips
        </Link>
        <span className="text-zinc-400">/</span>
        <Link
          href={`/dashboard/trips/${booking.tourId}/stats`}
          className="font-medium text-zinc-600 hover:text-zinc-900"
        >
          {booking.tour.title}
        </Link>
        <span className="text-zinc-400">/</span>
        <span className="font-medium text-zinc-900">
          {booking.reference ?? `Booking ${bookingId.slice(0, 8)}`}
        </span>
      </div>

      {/* Selected trip + booking (main focus) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Booking & trip details
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              This booking
            </h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-zinc-500">Reference</dt>
                <dd className="font-mono font-medium text-zinc-900">
                  {booking.reference ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Status</dt>
                <dd>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {statusLabels[booking.status] ?? booking.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Created</dt>
                <dd className="text-zinc-900">
                  {new Date(booking.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Updated</dt>
                <dd className="text-zinc-900">
                  {new Date(booking.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Trip
            </h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-zinc-500">Title</dt>
                <dd className="font-medium text-zinc-900">{booking.tour.title}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Duration</dt>
                <dd className="text-zinc-900">{booking.tour.durationLabel}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Base price</dt>
                <dd className="text-zinc-900">
                  €{Number(booking.tour.basePrice).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Trip status</dt>
                <dd>
                  <span
                    className={
                      booking.tour.status === "UPCOMING"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                        : "rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700"
                    }
                  >
                    {booking.tour.status === "UPCOMING" ? "Upcoming" : "Archived"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* User details (partial) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          User
        </h2>
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {userName && (
            <div>
              <dt className="text-zinc-500">Name</dt>
              <dd className="font-medium text-zinc-900">{userName}</dd>
            </div>
          )}
          <div>
            <dt className="text-zinc-500">Email</dt>
            <dd className="text-zinc-900">{booking.user.email}</dd>
          </div>
          {booking.user.mobile && (
            <div>
              <dt className="text-zinc-500">Mobile</dt>
              <dd className="text-zinc-900">{booking.user.mobile}</dd>
            </div>
          )}
          <div>
            <dt className="text-zinc-500">Role</dt>
            <dd className="text-zinc-900">{booking.user.role}</dd>
          </div>
        </dl>
      </section>

      {/* User's other bookings (partial) */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Other bookings by this user
        </h2>
        {otherBookings.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No other bookings.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
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
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="py-2 font-mono text-zinc-700">
                      {b.reference ?? "—"}
                    </td>
                    <td className="py-2 text-zinc-700">{b.tour.title}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        {statusLabels[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="py-2 text-zinc-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
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
