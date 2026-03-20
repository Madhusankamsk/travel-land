import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { TripMembershipPanel } from "./trip-membership-panel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function TripDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const trip = await prisma.tour.findUnique({
    where: { id },
    include: {
      days: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!trip || trip.status !== "UPCOMING") {
    notFound();
  }

  let existingBooking: { id: string } | null = null;
  let userProfile: { fullName: string; email: string } | null = null;
  if (userId) {
    const [booking, user] = await Promise.all([
      prisma.booking.findUnique({
        where: { userId_tourId: { userId, tourId: id } },
        select: { id: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true },
      }),
    ]);
    existingBooking = booking;
    if (user?.email) {
      userProfile = {
        fullName: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || "",
        email: user.email,
      };
    }
  }

  const staff = (trip.contactStaff as string | null)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <Link
          href="/upcoming-trips"
          className="mb-4 inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to upcoming trips
        </Link>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {trip.heroImageUrl && (
            <div className="relative aspect-[16/7] w-full bg-zinc-200">
              <Image
                src={trip.heroImageUrl}
                alt={trip.title}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            </div>
          )}

          <div className="space-y-10 p-6 sm:p-8">
            <header className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {trip.durationLabel}
              </p>
              <h1 className="text-3xl font-bold text-zinc-900">{trip.title}</h1>
              {trip.introText && (
                <p className="max-w-3xl text-zinc-700">{trip.introText}</p>
              )}
            </header>

            <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Daily itinerary
                </h2>
                <div className="space-y-4">
                  {trip.days.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Itinerary will be published soon.
                    </p>
                  ) : (
                    trip.days.map((day: any) => (
                      <article
                        key={day.id}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                      >
                        <h3 className="text-sm font-semibold text-zinc-900">
                          {day.dayHeading}
                        </h3>
                        {day.description && (
                          <div
                            className="prose prose-sm mt-2 max-w-none text-zinc-700 prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5"
                            dangerouslySetInnerHTML={{ __html: day.description }}
                          />
                        )}
                      </article>
                    ))
                  )}
                </div>
              </div>

              <aside className="space-y-5 self-start xl:sticky xl:top-24">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Price from
                    </p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">
                      €{Number(trip.basePrice).toLocaleString()}
                      <span className="ml-1 text-sm font-normal text-zinc-600">
                        per person
                      </span>
                    </p>
                    {trip.singleSupplement && (
                      <p className="mt-1 text-sm text-zinc-600">
                        Single supplement: €{Number(trip.singleSupplement).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {(trip.depositLabel || trip.balanceDeadline) && (
                    <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4 text-sm text-zinc-700">
                      {trip.depositLabel && (
                        <p>
                          <span className="font-medium">Deposit:</span>{" "}
                          {trip.depositLabel}
                        </p>
                      )}
                      {trip.balanceDeadline && (
                        <p>
                          <span className="font-medium">Balance due:</span>{" "}
                          {trip.balanceDeadline}
                        </p>
                      )}
                    </div>
                  )}

                  {(trip.mandatoryInsurance || trip.optionalInsurance) && (
                    <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4 text-sm text-zinc-700">
                      {trip.mandatoryInsurance && (
                        <p>
                          <span className="font-medium">Mandatory insurance:</span>{" "}
                          {trip.mandatoryInsurance}
                        </p>
                      )}
                      {trip.optionalInsurance && (
                        <p>
                          <span className="font-medium">Optional insurance:</span>{" "}
                          {trip.optionalInsurance}
                        </p>
                      )}
                    </div>
                  )}

                  {trip.programPdfUrl && (
                    <a
                      href={trip.programPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      Download full program (PDF)
                    </a>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                  <h2 className="mb-3 text-base font-semibold text-zinc-900">
                    Travel membership form
                  </h2>
                  {userId && existingBooking ? (
                    <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3">
                      <p className="text-sm font-medium text-zinc-700">
                        You&apos;ve already requested this trip
                      </p>
                      <Link
                        href="/profile"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                      >
                        View in profile
                      </Link>
                    </div>
                  ) : (
                    <TripMembershipPanel
                      selectedPackage={{
                        id: trip.id,
                        title: trip.title,
                        basePrice: Number(trip.basePrice),
                        singleSupplement:
                          trip.singleSupplement != null ? Number(trip.singleSupplement) : null,
                      }}
                      isAuthenticated={Boolean(userId)}
                      userProfile={userProfile}
                    />
                  )}
                </div>

                {staff.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 sm:p-5">
                    <p className="mb-1 font-medium">Contacts for this tour</p>
                    <p>{staff.join(", ")}</p>
                  </div>
                )}
              </aside>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                  Included in the price
                </h2>
                <p className="whitespace-pre-line text-sm text-zinc-700">
                  {trip.included}
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                  Not included in the price
                </h2>
                <p className="whitespace-pre-line text-sm text-zinc-700">
                  {trip.excluded}
                </p>
              </div>
            </section>

            {trip.cancellationPolicy && (
              <section>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                  Cancellation policy
                </h2>
                <p className="whitespace-pre-line text-sm text-zinc-700">
                  {trip.cancellationPolicy}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

