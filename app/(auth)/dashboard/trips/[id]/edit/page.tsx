import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TripForm } from "@/components/trip-form";
import { createTrip, updateTrip } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { days: { orderBy: { order: "asc" } } },
  });

  if (!tour) notFound();

  const initial = {
    title: tour.title,
    status: tour.status,
    durationLabel: tour.durationLabel,
    durationDaysNights: tour.durationDaysNights,
    tripSubtitle: tour.tripSubtitle,
    tripCode: tour.tripCode,
    destinationCountry: tour.destinationCountry,
    destinationCities: tour.destinationCities,
    tripCategory: tour.tripCategory,
    heroImageUrl: tour.heroImageUrl,
    galleryImageUrls: (tour.galleryImageUrls as unknown as string[] | null) ?? null,
    tripVideoUrl: tour.tripVideoUrl,
    introText: tour.introText,

    startLocation: tour.startLocation,
    endLocation: tour.endLocation,
    meetingPoint: tour.meetingPoint,
    transportUsed: tour.transportUsed,
    accommodationType: tour.accommodationType,
    hotelCategory: tour.hotelCategory,
    roomType: tour.roomType,

    minParticipants: tour.minParticipants,
    maxGroupSize: tour.maxGroupSize,
    ageRestrictions: tour.ageRestrictions,
    difficultyLevel: tour.difficultyLevel,
    requiresWalkingKmPerDay: tour.requiresWalkingKmPerDay,

    basePrice: String(tour.basePrice),
    currency: tour.currency,
    singleSupplement: tour.singleSupplement != null ? String(tour.singleSupplement) : null,
    mandatoryInsurance: tour.mandatoryInsurance,
    optionalInsurance: tour.optionalInsurance,
    depositLabel: tour.depositLabel,
    balanceDeadline: tour.balanceDeadline,
    bookingDeadline: tour.bookingDeadline,
    availableSeats: tour.availableSeats,
    childPolicy: tour.childPolicy,
    included: tour.included,
    excluded: tour.excluded,

    programPdfUrl: tour.programPdfUrl,
    contactStaffName: tour.contactStaffName,
    contactPhone: tour.contactPhone,
    contactEmail: tour.contactEmail,
    cancellationPenalties: tour.cancellationPenalties,
    days: tour.days.map((d) => ({
      dayHeading: d.dayHeading,
      dateLabel: d.dateLabel ?? "",
      description: d.description,
    })),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/trips"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Trips
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Edit: {tour.title}</h1>
      </div>
      <TripForm
        mode="edit"
        tourId={id}
        initial={initial}
        createAction={createTrip}
        updateAction={updateTrip}
      />
    </div>
  );
}
