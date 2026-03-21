import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { TripMembershipPanel } from "./trip-membership-panel";
import { InnerPageHero } from "@/components/inner-page-hero";

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
  let userProfile: { firstName: string; lastName: string; email: string } | null = null;
  if (userId) {
    const [booking, user] = await Promise.all([
      prisma.membershipBooking.findFirst({
        where: { userId, tourId: id },
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
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email,
      };
    }
  }

  const staff = (trip.contactStaff as string | null)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-travertine">
      <InnerPageHero
        title={trip.title}
        image={trip.heroImageUrl ?? undefined}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Upcoming trips", href: "/upcoming-trips" },
          { label: trip.title },
        ]}
      />

      <section className="bg-travertine py-16 lg:py-24" aria-labelledby="trip-details-heading">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="mb-10 flex items-center gap-3">
            <Link
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full border border-bone bg-white px-4 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
            >
              ← Upcoming trips
            </Link>
          </div>

          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:items-start">
            {/* Left column */}
            <div className="space-y-8">
              <header className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                  {trip.durationLabel}
                </p>
                <h2
                  id="trip-details-heading"
                  className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
                >
                  {trip.title}
                </h2>
                {trip.introText && (
                  <p className="max-w-3xl text-[15px] leading-[1.65] text-[#7A7060]">
                    {trip.introText}
                  </p>
                )}
              </header>

              <section aria-labelledby="trip-itinerary-heading">
                <h2
                  id="trip-itinerary-heading"
                  className="mb-6 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                >
                  Daily program
                </h2>

                {trip.days.length === 0 ? (
                  <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                    <p className="text-[14px] font-medium text-[#7A7060]">
                      The program will be published soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {trip.days.map((day: any, idx: number) => (
                      <article
                        key={day.id}
                        className="relative overflow-hidden rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-obsidian text-[#F0EAE0] text-[13px] font-semibold">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                              {day.dayHeading}
                            </h3>
                            {day.description && (
                              <div
                                className="prose prose-sm mt-2 max-w-none text-[#7A7060] prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5"
                                dangerouslySetInnerHTML={{ __html: day.description }}
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="grid gap-6 md:grid-cols-2" aria-labelledby="trip-inclusions-heading">
                <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                  <h2
                    id="trip-inclusions-heading"
                    className="mb-2 font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-snug text-obsidian"
                  >
                    Included in the price
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.included}
                  </p>
                </div>
                <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                  <h2 className="mb-2 font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-snug text-obsidian">
                    Not included in the price
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.excluded}
                  </p>
                </div>
              </section>

              {trip.cancellationPolicy && (
                <section className="rounded-[20px] border border-bone bg-parchment/60 p-6" aria-labelledby="trip-cancellation-heading">
                  <h2
                    id="trip-cancellation-heading"
                    className="mb-2 font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-snug text-obsidian"
                  >
                    Cancellation policy
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.cancellationPolicy}
                  </p>
                </section>
              )}
            </div>

            {/* Right column */}
            <aside className="space-y-5 self-start md:sticky md:top-24">
              <div className="rounded-[20px] border border-bone bg-parchment/60 p-6 shadow-[var(--shadow-sm)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7060]">
                    Price from
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-cormorant)] text-[32px] font-medium leading-tight text-obsidian">
                    €{Number(trip.basePrice).toLocaleString()}
                    <span className="ml-1 text-[13px] font-normal opacity-60">
                      per person
                    </span>
                  </p>
                  {trip.singleSupplement && (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#7A7060]">
                      Single supplement: €{Number(trip.singleSupplement).toLocaleString()}
                    </p>
                  )}
                </div>

                {(trip.depositLabel || trip.balanceDeadline) && (
                  <div className="mt-5 space-y-1 border-t border-bone/70 pt-5">
                    {trip.depositLabel && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Deposit:</span>{" "}
                        {trip.depositLabel}
                      </p>
                    )}
                    {trip.balanceDeadline && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Balance:</span>{" "}
                        {trip.balanceDeadline}
                      </p>
                    )}
                  </div>
                )}

                {(trip.mandatoryInsurance || trip.optionalInsurance) && (
                  <div className="mt-5 space-y-1 border-t border-bone/70 pt-5">
                    {trip.mandatoryInsurance && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Mandatory insurance:</span>{" "}
                        {trip.mandatoryInsurance}
                      </p>
                    )}
                    {trip.optionalInsurance && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Optional insurance:</span>{" "}
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
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-bone bg-white px-5 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
                  >
                    Download program (PDF)
                  </a>
                )}
              </div>

              <div className="rounded-[20px] border border-bone bg-parchment/60 p-6 shadow-[var(--shadow-sm)]">
                <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-snug text-obsidian">
                  Participation request
                </h2>

                {userId && existingBooking ? (
                  <div className="space-y-2 rounded-[20px] border border-bone bg-white p-4">
                    <p className="text-[14px] font-medium text-[#7A7060]">
                      You already submitted a request for this trip.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-flex w-full items-center justify-center rounded-full border border-bone bg-white px-5 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
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
                      programPdfUrl: trip.programPdfUrl ?? null,
                    }}
                    isAuthenticated={Boolean(userId)}
                    userProfile={userProfile}
                  />
                )}
              </div>

              {staff.length > 0 && (
                <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                    Contacts for this tour
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#7A7060]">
                    {staff.join(", ")}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

