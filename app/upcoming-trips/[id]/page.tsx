import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { TripMembershipPanel } from "./trip-membership-panel";
import { InnerPageHero } from "@/components/inner-page-hero";
import { CancellationPenaltiesBlock } from "@/components/cancellation-penalties-block";
import { mergeCancellationPenalties } from "@/lib/cancellation-penalties";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

function parseImageUrlList(json: unknown): string[] {
  if (json == null) return [];
  if (Array.isArray(json)) {
    return json.filter((x): x is string => typeof x === "string" && x.length > 0);
  }
  return [];
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const m = u.pathname.match(/\/embed\/([^/]+)/);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: "Upcoming",
  OPEN: "Bookings open",
  SOLD_OUT: "Sold out",
  COMPLETED: "Completed",
};

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

  if (
    !trip ||
    (trip.status !== "UPCOMING" && trip.status !== "OPEN" && trip.status !== "SOLD_OUT")
  ) {
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

  const hasContact =
    Boolean(trip.contactStaffName) || Boolean(trip.contactPhone) || Boolean(trip.contactEmail);

  const galleryUrls = parseImageUrlList(trip.galleryImageUrls);
  const videoEmbed = trip.tripVideoUrl ? youtubeEmbedUrl(trip.tripVideoUrl) : null;

  const hasLogistics =
    Boolean(trip.startLocation) ||
    Boolean(trip.endLocation) ||
    Boolean(trip.meetingPoint) ||
    Boolean(trip.transportUsed) ||
    Boolean(trip.accommodationType) ||
    Boolean(trip.hotelCategory) ||
    Boolean(trip.roomType);

  const hasGroupInfo =
    trip.minParticipants != null ||
    trip.maxGroupSize != null ||
    Boolean(trip.ageRestrictions) ||
    Boolean(trip.difficultyLevel) ||
    Boolean(trip.requiresWalkingKmPerDay);

  const hasDestinations =
    Boolean(trip.destinationCountry) ||
    Boolean(trip.destinationCities) ||
    Boolean(trip.tripCategory);

  const formatPrice = (n: number) =>
    n.toLocaleString("en-GB", {
      style: "currency",
      currency: trip.currency || "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const cancellationPolicy = mergeCancellationPenalties(trip.cancellationPenalties);

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
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <Link
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full border border-bone bg-white px-4 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
            >
              ← Upcoming trips
            </Link>
            <span
              className="rounded-full border border-bone bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#7A7060]"
              title="Trip status"
            >
              {STATUS_LABELS[trip.status] ?? trip.status}
            </span>
            {trip.tripCode && (
              <span className="text-[12px] font-medium tracking-wide text-[#7A7060]">
                Code: <span className="text-obsidian">{trip.tripCode}</span>
              </span>
            )}
          </div>

          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:items-start">
            {/* Main column */}
            <div className="space-y-8">
              <header className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                  {trip.durationLabel}
                  {trip.durationDaysNights ? (
                    <span className="font-normal text-[#7A7060]">
                      {" "}
                      · {trip.durationDaysNights}
                    </span>
                  ) : null}
                </p>
                <h2
                  id="trip-details-heading"
                  className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
                >
                  {trip.title}
                </h2>
                {trip.tripSubtitle && (
                  <p className="text-[17px] font-medium leading-snug text-obsidian/90">
                    {trip.tripSubtitle}
                  </p>
                )}

                {hasDestinations && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {trip.tripCategory && (
                      <span className="rounded-full border border-oro/30 bg-oro/10 px-3 py-1 text-[12px] font-medium text-bronze">
                        {trip.tripCategory}
                      </span>
                    )}
                    {trip.destinationCountry && (
                      <span className="rounded-full border border-bone bg-white px-3 py-1 text-[12px] text-[#7A7060]">
                        {trip.destinationCountry}
                      </span>
                    )}
                    {trip.destinationCities && (
                      <span className="rounded-full border border-bone bg-white px-3 py-1 text-[12px] text-[#7A7060]">
                        {trip.destinationCities}
                      </span>
                    )}
                  </div>
                )}

                {trip.introText && (
                  <p className="max-w-3xl text-[15px] leading-[1.65] text-[#7A7060]">
                    {trip.introText}
                  </p>
                )}
              </header>

              {galleryUrls.length > 0 && (
                <section aria-labelledby="trip-gallery-heading">
                  <h2
                    id="trip-gallery-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                  >
                    Gallery
                  </h2>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryUrls.map((src, i) => (
                      <li
                        key={`${src}-${i}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-bone bg-parchment"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                          unoptimized
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {trip.tripVideoUrl && (
                <section aria-labelledby="trip-video-heading">
                  <h2
                    id="trip-video-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                  >
                    Video
                  </h2>
                  {videoEmbed && isYouTubeUrl(trip.tripVideoUrl) ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-bone bg-obsidian shadow-[var(--shadow-sm)]">
                      <iframe
                        title="Trip video"
                        src={videoEmbed}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={trip.tripVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-bone bg-white px-5 py-2.5 text-[13px] font-medium text-obsidian transition-all duration-150 hover:bg-travertine"
                    >
                      Watch video
                    </a>
                  )}
                </section>
              )}

              {hasLogistics && (
                <section
                  className="rounded-[20px] border border-bone bg-parchment/60 p-6"
                  aria-labelledby="trip-logistics-heading"
                >
                  <h2
                    id="trip-logistics-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                  >
                    Logistics & accommodation
                  </h2>
                  <dl className="grid gap-3 text-[14px] leading-relaxed text-[#7A7060] sm:grid-cols-2">
                    {trip.startLocation && (
                      <div>
                        <dt className="font-medium text-obsidian">Start</dt>
                        <dd>{trip.startLocation}</dd>
                      </div>
                    )}
                    {trip.endLocation && (
                      <div>
                        <dt className="font-medium text-obsidian">End of tour</dt>
                        <dd>{trip.endLocation}</dd>
                      </div>
                    )}
                    {trip.meetingPoint && (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-obsidian">Meeting point</dt>
                        <dd>{trip.meetingPoint}</dd>
                      </div>
                    )}
                    {trip.transportUsed && (
                      <div>
                        <dt className="font-medium text-obsidian">Transport</dt>
                        <dd>{trip.transportUsed}</dd>
                      </div>
                    )}
                    {trip.accommodationType && (
                      <div>
                        <dt className="font-medium text-obsidian">Accommodation type</dt>
                        <dd>{trip.accommodationType}</dd>
                      </div>
                    )}
                    {trip.hotelCategory && (
                      <div>
                        <dt className="font-medium text-obsidian">Hotel category</dt>
                        <dd>{trip.hotelCategory}</dd>
                      </div>
                    )}
                    {trip.roomType && (
                      <div>
                        <dt className="font-medium text-obsidian">Room (reference)</dt>
                        <dd>{trip.roomType}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {hasGroupInfo && (
                <section
                  className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                  aria-labelledby="trip-group-heading"
                >
                  <h2
                    id="trip-group-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                  >
                    Group & level
                  </h2>
                  <dl className="grid gap-3 text-[14px] leading-relaxed text-[#7A7060] sm:grid-cols-2">
                    {trip.minParticipants != null && (
                      <div>
                        <dt className="font-medium text-obsidian">Min. participants</dt>
                        <dd>{trip.minParticipants}</dd>
                      </div>
                    )}
                    {trip.maxGroupSize != null && (
                      <div>
                        <dt className="font-medium text-obsidian">Max. group size</dt>
                        <dd>{trip.maxGroupSize}</dd>
                      </div>
                    )}
                    {trip.ageRestrictions && (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-obsidian">Age / restrictions</dt>
                        <dd>{trip.ageRestrictions}</dd>
                      </div>
                    )}
                    {trip.difficultyLevel && (
                      <div>
                        <dt className="font-medium text-obsidian">Difficulty</dt>
                        <dd>{trip.difficultyLevel}</dd>
                      </div>
                    )}
                    {trip.requiresWalkingKmPerDay && (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-obsidian">Daily walking (approx.)</dt>
                        <dd>{trip.requiresWalkingKmPerDay}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              <section aria-labelledby="trip-itinerary-heading">
                <h2
                  id="trip-itinerary-heading"
                  className="mb-6 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian"
                >
                  Daily itinerary
                </h2>

                {trip.days.length === 0 ? (
                  <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                    <p className="text-[14px] font-medium text-[#7A7060]">
                      The full itinerary will be published soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {trip.days.map((day, idx) => {
                      const dayImgs = parseImageUrlList(day.dayImageUrls);
                      return (
                        <article
                          key={day.id}
                          className="relative overflow-hidden rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-obsidian text-[13px] font-semibold text-[#F0EAE0]">
                              {idx + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                                  {day.dayHeading}
                                </h3>
                                {day.dateLabel && (
                                  <span className="text-[13px] font-medium text-terracotta">
                                    {day.dateLabel}
                                  </span>
                                )}
                              </div>
                              {dayImgs.length > 0 && (
                                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                  {dayImgs.map((src, j) => (
                                    <li
                                      key={`${day.id}-img-${j}`}
                                      className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-bone bg-parchment"
                                    >
                                      <Image
                                        src={src}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, 25vw"
                                        unoptimized
                                      />
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {day.description && (
                                <div
                                  className="prose prose-sm mt-2 max-w-none text-[#7A7060] prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5"
                                  dangerouslySetInnerHTML={{ __html: day.description }}
                                />
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
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
                    Not included
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.excluded}
                  </p>
                </div>
              </section>

              <section
                className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                aria-label="Cancellation penalties"
              >
                <CancellationPenaltiesBlock data={cancellationPolicy} />
              </section>
            </div>

            {/* Right column */}
            <aside className="space-y-5 self-start md:sticky md:top-24">
              <div className="rounded-[20px] border border-bone bg-parchment/60 p-6 shadow-[var(--shadow-sm)]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7060]">
                    Price from
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-cormorant)] text-[32px] font-medium leading-tight text-obsidian">
                    {formatPrice(Number(trip.basePrice))}
                    <span className="ml-1 text-[13px] font-normal opacity-60">per person</span>
                  </p>
                  {trip.singleSupplement != null && (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#7A7060]">
                      Single supplement: {formatPrice(Number(trip.singleSupplement))}
                    </p>
                  )}
                </div>

                {(trip.bookingDeadline || trip.availableSeats != null) && (
                  <div className="mt-5 space-y-2 border-t border-bone/70 pt-5">
                    {trip.bookingDeadline && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Booking deadline:</span>{" "}
                        {trip.bookingDeadline}
                      </p>
                    )}
                    {trip.availableSeats != null && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Available seats:</span>{" "}
                        {trip.availableSeats}
                      </p>
                    )}
                  </div>
                )}

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
                        <span className="font-medium text-obsidian">Balance:</span> {trip.balanceDeadline}
                      </p>
                    )}
                  </div>
                )}

                {trip.childPolicy && (
                  <div className="mt-5 border-t border-bone/70 pt-5">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                      Children & pricing
                    </p>
                    <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#7A7060]">
                      {trip.childPolicy}
                    </p>
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
                    Download itinerary (PDF)
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
                      You have already submitted a request for this trip.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-flex w-full items-center justify-center rounded-full border border-bone bg-white px-5 py-2.5 text-[13px] font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-travertine"
                    >
                      View in profile
                    </Link>
                  </div>
                ) : trip.status === "OPEN" ? (
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
                ) : (
                  <div className="space-y-2 rounded-[20px] border border-bone bg-white p-4">
                    <p className="text-[14px] font-medium text-[#7A7060]">
                      Booking for this trip is not available right now.
                    </p>
                    <p className="text-[13px] text-[#B5A890]">
                      {trip.status === "SOLD_OUT"
                        ? "This trip is sold out."
                        : "Booking will open soon."}
                    </p>
                  </div>
                )}
              </div>

              {hasContact && (
                <div className="rounded-[20px] border border-bone bg-parchment/60 p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                    Contact for this tour
                  </p>
                  <div className="space-y-1 text-[14px] leading-relaxed text-[#7A7060]">
                    {trip.contactStaffName && <p>{trip.contactStaffName}</p>}
                    {trip.contactPhone && (
                      <p>
                        <a href={`tel:${trip.contactPhone.replace(/\s/g, "")}`} className="underline-offset-2 hover:underline">
                          {trip.contactPhone}
                        </a>
                      </p>
                    )}
                    {trip.contactEmail && (
                      <p>
                        <a href={`mailto:${trip.contactEmail}`} className="underline-offset-2 hover:underline">
                          {trip.contactEmail}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
