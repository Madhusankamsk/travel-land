import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TripForm } from "@/components/trip-form";
import { createTrip, updateTrip } from "../../actions";

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
    heroImageUrl: tour.heroImageUrl,
    introText: tour.introText,
    basePrice: String(tour.basePrice),
    singleSupplement: tour.singleSupplement != null ? String(tour.singleSupplement) : null,
    mandatoryInsurance: tour.mandatoryInsurance,
    optionalInsurance: tour.optionalInsurance,
    depositLabel: tour.depositLabel,
    balanceDeadline: tour.balanceDeadline,
    included: tour.included,
    excluded: tour.excluded,
    cancellationPolicy: tour.cancellationPolicy,
    programPdfUrl: tour.programPdfUrl,
    contactStaff: tour.contactStaff,
    days: tour.days.map((d) => ({
      dayHeading: d.dayHeading,
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
