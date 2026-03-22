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
  UPCOMING: "In programma",
  OPEN: "Iscrizioni aperte",
  SOLD_OUT: "Esaurito",
  COMPLETED: "Concluso",
};

export default async function TripDetailsPage({ params }: PageProps) {
  const resolved = await params;
  const id = typeof resolved.id === "string" ? resolved.id.trim() : "";
  if (!id) {
    notFound();
  }

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
          { label: "Prossimi viaggi", href: "/upcoming-trips" },
          { label: trip.title },
        ]}
      />

      <section className="bg-travertine py-12 lg:py-16" aria-labelledby="trip-details-heading">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-5 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3 lg:mb-10">
            <Link
              href="/upcoming-trips"
              className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-bone bg-white px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-obsidian transition-colors duration-[var(--dur-fast)] hover:bg-travertine focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px] active:scale-[0.97]"
            >
              ← Prossimi viaggi
            </Link>
            <span
              className="rounded-full border border-bone bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A7060]"
              title="Stato viaggio"
            >
              {STATUS_LABELS[trip.status] ?? trip.status}
            </span>
            {trip.tripCode && (
              <span className="text-[12px] font-medium tracking-wide text-[#7A7060]">
                Codice: <span className="text-obsidian">{trip.tripCode}</span>
              </span>
            )}
          </div>

          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:items-start lg:gap-12">
            {/* Main column */}
            <div className="space-y-10 lg:space-y-12">
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
                  className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-[1.15] tracking-tight text-obsidian"
                >
                  {trip.title}
                </h2>
                {trip.tripSubtitle && (
                  <p className="text-[17px] font-medium leading-relaxed text-obsidian/90">
                    {trip.tripSubtitle}
                  </p>
                )}

                {hasDestinations && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {trip.tripCategory && (
                      <span className="rounded-full border border-oro/30 bg-oro/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze">
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
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Immagini
                  </p>
                  <h2
                    id="trip-gallery-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                  >
                    Galleria
                  </h2>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryUrls.map((src, i) => (
                      <li
                        key={`${src}-${i}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-bone bg-white shadow-[var(--shadow-sm)]"
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
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Media
                  </p>
                  <h2
                    id="trip-video-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                  >
                    Video
                  </h2>
                  {videoEmbed && isYouTubeUrl(trip.tripVideoUrl) ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-bone bg-obsidian shadow-[var(--shadow-md)]">
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
                      className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-bone bg-white px-6 py-2.5 text-[13px] font-medium tracking-[0.04em] text-obsidian transition-colors duration-[var(--dur-fast)] hover:bg-travertine focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px]"
                    >
                      Guarda il video
                    </a>
                  )}
                </section>
              )}

              {hasLogistics && (
                <section
                  className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                  aria-labelledby="trip-logistics-heading"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Organizzazione
                  </p>
                  <h2
                    id="trip-logistics-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                  >
                    Logistica e alloggio
                  </h2>
                  <dl className="grid gap-3 text-[14px] leading-relaxed text-[#7A7060] sm:grid-cols-2">
                    {trip.startLocation && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Partenza
                        </dt>
                        <dd>{trip.startLocation}</dd>
                      </div>
                    )}
                    {trip.endLocation && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Fine tour
                        </dt>
                        <dd>{trip.endLocation}</dd>
                      </div>
                    )}
                    {trip.meetingPoint && (
                      <div className="sm:col-span-2">
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Punto d&apos;incontro
                        </dt>
                        <dd>{trip.meetingPoint}</dd>
                      </div>
                    )}
                    {trip.transportUsed && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Trasporti
                        </dt>
                        <dd>{trip.transportUsed}</dd>
                      </div>
                    )}
                    {trip.accommodationType && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Tipo di alloggio
                        </dt>
                        <dd>{trip.accommodationType}</dd>
                      </div>
                    )}
                    {trip.hotelCategory && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Categoria hotel
                        </dt>
                        <dd>{trip.hotelCategory}</dd>
                      </div>
                    )}
                    {trip.roomType && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Camera (riferimento)
                        </dt>
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
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Gruppo
                  </p>
                  <h2
                    id="trip-group-heading"
                    className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                  >
                    Partecipanti e livello
                  </h2>
                  <dl className="grid gap-3 text-[14px] leading-relaxed text-[#7A7060] sm:grid-cols-2">
                    {trip.minParticipants != null && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Partecipanti min.
                        </dt>
                        <dd>{trip.minParticipants}</dd>
                      </div>
                    )}
                    {trip.maxGroupSize != null && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Partecipanti max.
                        </dt>
                        <dd>{trip.maxGroupSize}</dd>
                      </div>
                    )}
                    {trip.ageRestrictions && (
                      <div className="sm:col-span-2">
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Età / limitazioni
                        </dt>
                        <dd>{trip.ageRestrictions}</dd>
                      </div>
                    )}
                    {trip.difficultyLevel && (
                      <div>
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Difficoltà
                        </dt>
                        <dd>{trip.difficultyLevel}</dd>
                      </div>
                    )}
                    {trip.requiresWalkingKmPerDay && (
                      <div className="sm:col-span-2">
                        <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-obsidian">
                          Camminata giornaliera (circa)
                        </dt>
                        <dd>{trip.requiresWalkingKmPerDay}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              <section aria-labelledby="trip-itinerary-heading">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                  Programma
                </p>
                <h2
                  id="trip-itinerary-heading"
                  className="mb-6 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                >
                  Itinerario giorno per giorno
                </h2>

                {trip.days.length === 0 ? (
                  <div className="rounded-[20px] border border-bone bg-parchment/80 p-6 shadow-[var(--shadow-sm)]">
                    <p className="text-[14px] font-medium leading-relaxed text-[#7A7060]">
                      L&apos;itinerario completo sarà pubblicato a breve.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {trip.days.map((day, idx) => {
                      const dayImgs = parseImageUrlList(day.dayImageUrls);
                      return (
                        <div key={day.id} className="flex gap-5 md:gap-6">
                          <div className="flex w-11 flex-shrink-0 flex-col items-center">
                            <div className="z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-obsidian text-[13px] font-semibold tracking-wide text-[#F0EAE0]">
                              {idx + 1}
                            </div>
                            {idx < trip.days.length - 1 ? (
                              <div className="w-px flex-1 min-h-[32px] bg-bone" aria-hidden />
                            ) : null}
                          </div>
                          <article className="min-w-0 flex-1 pb-10 last:pb-0">
                            <div className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]">
                              <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
                                <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian">
                                  {day.dayHeading}
                                </h3>
                                {day.dateLabel ? (
                                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                                    {day.dateLabel}
                                  </span>
                                ) : null}
                              </div>
                              {dayImgs.length > 0 ? (
                                <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                  {dayImgs.map((src, j) => (
                                    <li
                                      key={`${day.id}-img-${j}`}
                                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-bone bg-parchment"
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
                              ) : null}
                              {day.description ? (
                                <div
                                  className="prose prose-sm mt-4 max-w-none text-[15px] leading-[1.65] text-[#7A7060] prose-headings:font-[family-name:var(--font-cormorant)] prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-terracotta"
                                  dangerouslySetInnerHTML={{ __html: day.description }}
                                />
                              ) : null}
                            </div>
                          </article>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="grid gap-6 md:grid-cols-2" aria-labelledby="trip-inclusions-heading">
                <div className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Quota
                  </p>
                  <h2
                    id="trip-inclusions-heading"
                    className="mb-3 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian"
                  >
                    Incluso nella quota
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.included}
                  </p>
                </div>
                <div className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Extra
                  </p>
                  <h2 className="mb-3 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian">
                    Non incluso
                  </h2>
                  <p className="whitespace-pre-line text-[14px] leading-[1.65] text-[#7A7060]">
                    {trip.excluded}
                  </p>
                </div>
              </section>

              <section
                className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)]"
                aria-label="Penali di cancellazione"
              >
                <CancellationPenaltiesBlock data={cancellationPolicy} />
              </section>
            </div>

            {/* Right column — booking bar style (design system) */}
            <aside className="space-y-4 self-start md:sticky md:top-[calc(var(--header-height)+1rem)] md:space-y-5">
              <div className="rounded-[20px] border border-bone bg-white p-4 shadow-[var(--shadow-md)] sm:p-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A7060]">
                    Da
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-cormorant)] text-[clamp(28px,5vw,36px)] font-medium leading-tight text-obsidian">
                    {formatPrice(Number(trip.basePrice))}
                    <span className="ml-1 text-[13px] font-normal opacity-60">a pers.</span>
                  </p>
                  {trip.singleSupplement != null && (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#7A7060]">
                      Suppl. singola: {formatPrice(Number(trip.singleSupplement))}
                    </p>
                  )}
                </div>

                {(trip.bookingDeadline || trip.availableSeats != null) && (
                  <div className="mt-5 space-y-2 border-t border-bone pt-5">
                    {trip.bookingDeadline && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Scadenza iscrizioni:</span>{" "}
                        {trip.bookingDeadline}
                      </p>
                    )}
                    {trip.availableSeats != null && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Posti disponibili:</span>{" "}
                        {trip.availableSeats}
                      </p>
                    )}
                  </div>
                )}

                {(trip.depositLabel || trip.balanceDeadline) && (
                  <div className="mt-5 space-y-1 border-t border-bone pt-5">
                    {trip.depositLabel && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Acconto:</span>{" "}
                        {trip.depositLabel}
                      </p>
                    )}
                    {trip.balanceDeadline && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Saldo:</span> {trip.balanceDeadline}
                      </p>
                    )}
                  </div>
                )}

                {trip.childPolicy && (
                  <div className="mt-5 border-t border-bone pt-5">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                      Bambini e tariffe
                    </p>
                    <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#7A7060]">
                      {trip.childPolicy}
                    </p>
                  </div>
                )}

                {(trip.mandatoryInsurance || trip.optionalInsurance) && (
                  <div className="mt-5 space-y-1 border-t border-bone pt-5">
                    {trip.mandatoryInsurance && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Assicurazione obbligatoria:</span>{" "}
                        {trip.mandatoryInsurance}
                      </p>
                    )}
                    {trip.optionalInsurance && (
                      <p className="text-[14px] leading-relaxed text-[#7A7060]">
                        <span className="font-medium text-obsidian">Assicurazione facoltativa:</span>{" "}
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
                    className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border-[1.5px] border-bone bg-parchment px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-siena transition-colors duration-[var(--dur-fast)] hover:bg-bone/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px] active:scale-[0.97]"
                  >
                    Scarica programma (PDF)
                  </a>
                )}
              </div>

              <div className="rounded-[20px] border border-bone bg-parchment/80 p-4 shadow-[var(--shadow-sm)] sm:p-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                  Iscrizione
                </p>
                <h2 className="mb-3 font-[family-name:var(--font-cormorant)] text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium leading-snug tracking-tight text-obsidian">
                  Richiesta di partecipazione
                </h2>

                {userId && existingBooking ? (
                  <div className="space-y-3 rounded-[20px] border border-bone bg-white p-4 shadow-[var(--shadow-sm)]">
                    <p className="text-[14px] font-medium leading-relaxed text-[#7A7060]">
                      Hai già inviato una richiesta per questo viaggio.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border-[1.5px] border-bone bg-white px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-obsidian transition-colors duration-[var(--dur-fast)] hover:bg-travertine focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px]"
                    >
                      Vedi nel profilo
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
                  <div className="space-y-2 rounded-[20px] border border-bone bg-white p-4 shadow-[var(--shadow-sm)]">
                    <p className="text-[14px] font-medium leading-relaxed text-[#7A7060]">
                      Le iscrizioni per questo viaggio non sono al momento disponibili.
                    </p>
                    <p className="text-[13px] text-[#B5A890]">
                      {trip.status === "SOLD_OUT"
                        ? "Questo viaggio è esaurito."
                        : "Le iscrizioni apriranno a breve."}
                    </p>
                  </div>
                )}
              </div>

              {hasContact && (
                <div className="rounded-[20px] border border-bone bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                    Contatto
                  </p>
                  <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug tracking-tight text-obsidian">
                    Riferimento per questo tour
                  </h3>
                  <div className="space-y-1 text-[14px] leading-relaxed text-[#7A7060]">
                    {trip.contactStaffName && <p>{trip.contactStaffName}</p>}
                    {trip.contactPhone && (
                      <p>
                        <a
                          href={`tel:${trip.contactPhone.replace(/\s/g, "")}`}
                          className="text-azure underline-offset-2 transition-colors hover:text-adriatic hover:underline"
                        >
                          {trip.contactPhone}
                        </a>
                      </p>
                    )}
                    {trip.contactEmail && (
                      <p>
                        <a
                          href={`mailto:${trip.contactEmail}`}
                          className="text-azure underline-offset-2 transition-colors hover:text-adriatic hover:underline"
                        >
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
