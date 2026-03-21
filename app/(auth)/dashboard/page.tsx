import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, Calendar, Archive, FileText, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-3xl">{value}</p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }
  return content;
}

export default async function DashboardPage() {
  let totalTrips = 0;
  let upcomingTrips = 0;
  let archivedTrips = 0;
  let totalBookings = 0;
  let recentTours: Array<{
    id: string;
    title: string;
    status: string;
    durationLabel: string;
    basePrice: { toNumber: () => number };
    _count: { days: number };
  }> = [];

  try {
    const [totalTripsRes, upcomingRes, archivedRes, totalBookingsRes, recentRes] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.count({ where: { status: { in: ["UPCOMING", "OPEN", "SOLD_OUT"] } } }),
      prisma.tour.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count(),
      prisma.tour.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          durationLabel: true,
          basePrice: true,
          _count: { select: { days: true } },
        },
      }),
    ]);
    totalTrips = totalTripsRes;
    upcomingTrips = upcomingRes;
    archivedTrips = archivedRes;
    totalBookings = totalBookingsRes;
    recentTours = recentRes as typeof recentTours;
  } catch {
    // Tables may not exist or DB unreachable
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">Overview</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Trip and booking statistics</p>
        </div>
        <Link
          href="/dashboard/trips/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          Create trip
        </Link>
      </div>

      {/* Stats grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total trips"
          value={totalTrips}
          icon={MapPin}
          href="/dashboard/trips"
        />
        <StatCard
          label="Upcoming trips"
          value={upcomingTrips}
          icon={Calendar}
          href="/dashboard/trips"
        />
        <StatCard
          label="Completed trips"
          value={archivedTrips}
          icon={Archive}
          href="/dashboard/trips"
        />
        <StatCard
          label="Total bookings"
          value={totalBookings}
          icon={FileText}
        />
      </section>

      {/* Recent trips */}
      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-5">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent trips</h2>
          <Link
            href="/dashboard/trips"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentTours.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-5">
              No trips yet.{" "}
              <Link href="/dashboard/trips/create" className="font-medium text-zinc-700 hover:underline dark:text-zinc-300">
                Create your first trip
              </Link>
            </div>
          ) : (
            recentTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/dashboard/trips/${tour.id}/stats`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 sm:px-5 sm:py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{tour.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{tour.durationLabel}</p>
                </div>
                <div className="flex items-center gap-3">
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
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    €{Number(tour.basePrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">{tour._count.days} days</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
