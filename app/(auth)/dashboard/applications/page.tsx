import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MembershipApplicationsList } from "@/components/dashboard-membership-applications-list";

export const dynamic = "force-dynamic";

export default async function DashboardApplicationsPage() {
  const rows = await prisma.membershipBooking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const tourIds = [...new Set(rows.map((r) => r.tourId).filter((id): id is string => Boolean(id)))];
  const tours =
    tourIds.length > 0
      ? await prisma.tour.findMany({
          where: { id: { in: tourIds } },
          select: { id: true, title: true },
        })
      : [];
  const tourTitleById = new Map(tours.map((t) => [t.id, t.title]));

  const applications = rows.map((m) => ({
    id: m.id,
    reference: m.reference,
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    roomType: m.roomType,
    totalQuota: Number(m.totalQuota),
    createdAt: m.createdAt.toISOString(),
    packageName: m.packageName,
    tourId: m.tourId,
    tourTitle: m.tourId ? tourTitleById.get(m.tourId) ?? null : null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Trip applications
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Membership form submissions for upcoming trips ({applications.length} total shown).
          </p>
        </div>
        <Link
          href="/dashboard/trips"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Trips
        </Link>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <MembershipApplicationsList
          variant="global"
          applications={applications}
          emptyMessage="No applications yet. They will appear here when users submit the trip participation form."
        />
      </section>
    </div>
  );
}
