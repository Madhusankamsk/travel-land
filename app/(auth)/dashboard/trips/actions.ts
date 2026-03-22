"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveTourFile } from "@/lib/upload";
import { Prisma, type TourStatus } from "@prisma/client";
import {
  cancellationPenaltiesToPrismaJson,
  getDefaultCancellationPenalties,
  parseCancellationPenaltiesFromForm,
} from "@/lib/cancellation-penalties";
import { normalizeUrlList, parseUrlArrayFromFormField } from "@/lib/trip-media";

function parseDecimal(value: string | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseNullableInt(value: FormDataEntryValue | null): number | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function parseDaysJson(
  value: string | null
): { dayHeading: string; dateLabel: string | null; description: string }[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((d): d is { dayHeading?: string; dateLabel?: string | null; description?: string } => {
        return d != null && typeof d === "object";
      })
      .map((d) => ({
        dayHeading: String(d.dayHeading ?? "").trim(),
        dateLabel: d.dateLabel == null ? null : String(d.dateLabel).trim() || null,
        description: String(d.description ?? "").trim(),
      }));
  } catch {
    return [];
  }
}

async function saveTourFiles(files: File[], prefix: string): Promise<string[]> {
  const out: string[] = [];
  for (const file of files) {
    if (!file?.size) continue;
    try {
      const url = await saveTourFile(file, prefix);
      if (url) out.push(url);
    } catch {
      // ignore individual upload failures
    }
  }
  return out;
}

const VALID_TOUR_STATUSES: TourStatus[] = ["UPCOMING", "OPEN", "SOLD_OUT", "COMPLETED"];

/** No-op for create page so we can pass a server action reference. */
export async function noopUpdateTrip(
  _tourId: string,
  _formData: FormData
): Promise<{ error?: string }> {
  return { error: "Use the edit page to update a trip." };
}

export async function createTrip(formData: FormData) {
  const title = (formData.get("title") as string | null)?.trim();
  const statusRaw = (formData.get("status") as string | null)?.trim();
  const status = VALID_TOUR_STATUSES.includes(statusRaw as TourStatus)
    ? (statusRaw as TourStatus)
    : "UPCOMING";

  const durationLabel = (formData.get("durationLabel") as string | null)?.trim();
  const durationDaysNights = (formData.get("durationDaysNights") as string | null)?.trim() || null;

  const tripSubtitle = (formData.get("tripSubtitle") as string | null)?.trim() || null;
  const tripCode = (formData.get("tripCode") as string | null)?.trim() || null;
  const destinationCountry = (formData.get("destinationCountry") as string | null)?.trim() || null;
  const destinationCities = (formData.get("destinationCities") as string | null)?.trim() || null;
  const tripCategory = (formData.get("tripCategory") as string | null)?.trim() || null;

  const introText = (formData.get("introText") as string | null)?.trim() || "";
  const included = (formData.get("included") as string | null)?.trim() || "";
  const excluded = (formData.get("excluded") as string | null)?.trim() || "";

  if (!title || !durationLabel) {
    return { error: "Title and travel dates are required." };
  }

  const basePrice = parseDecimal(formData.get("basePrice") as string);
  if (basePrice == null || basePrice < 0) {
    return { error: "Base price is required and must be a number." };
  }

  const currency = (formData.get("currency") as string | null)?.trim() || "EUR";

  const singleSupplementRaw = parseDecimal(formData.get("singleSupplement") as string);
  const singleSupplement =
    singleSupplementRaw == null ? null : new Prisma.Decimal(singleSupplementRaw);

  const mandatoryInsurance = (formData.get("mandatoryInsurance") as string | null)?.trim() || null;
  const optionalInsurance = (formData.get("optionalInsurance") as string | null)?.trim() || null;
  const depositLabel = (formData.get("depositLabel") as string | null)?.trim() || null;
  const balanceDeadline = (formData.get("balanceDeadline") as string | null)?.trim() || null;
  const bookingDeadline = (formData.get("bookingDeadline") as string | null)?.trim() || null;
  const availableSeats = parseNullableInt(formData.get("availableSeats"));

  const childPolicy = (formData.get("childPolicy") as string | null)?.trim() || null;

  const startLocation = (formData.get("startLocation") as string | null)?.trim() || null;
  const endLocation = (formData.get("endLocation") as string | null)?.trim() || null;
  const meetingPoint = (formData.get("meetingPoint") as string | null)?.trim() || null;
  const transportUsed = (formData.get("transportUsed") as string | null)?.trim() || null;
  const accommodationType = (formData.get("accommodationType") as string | null)?.trim() || null;
  const hotelCategory = (formData.get("hotelCategory") as string | null)?.trim() || null;
  const roomType = (formData.get("roomType") as string | null)?.trim() || null;

  const minParticipants = parseNullableInt(formData.get("minParticipants"));
  const maxGroupSize = parseNullableInt(formData.get("maxGroupSize"));
  const ageRestrictions = (formData.get("ageRestrictions") as string | null)?.trim() || null;
  const difficultyLevel = (formData.get("difficultyLevel") as string | null)?.trim() || null;
  const requiresWalkingKmPerDay =
    (formData.get("requiresWalkingKmPerDay") as string | null)?.trim() || null;

  const contactStaffName =
    (formData.get("contactStaffName") as string | null)?.trim() || null;
  const contactPhone = (formData.get("contactPhone") as string | null)?.trim() || null;
  const contactEmail = (formData.get("contactEmail") as string | null)?.trim() || null;

  let heroImageUrl: string | null = null;
  const heroFile = formData.get("heroImage") as File | null;
  if (heroFile?.size) {
    heroImageUrl = await saveTourFiles([heroFile], "hero").then((arr) => arr[0] ?? null);
  }

  const galleryFiles = formData.getAll("galleryImages").filter((v): v is File => v instanceof File);
  const galleryUploadUrls = await saveTourFiles(galleryFiles, "gallery");
  const galleryImageUrlsComputed = galleryUploadUrls.length ? galleryUploadUrls : null;

  // Program PDF
  let programPdfUrl: string | null = null;
  const pdfFile = formData.get("programPdf") as File | null;
  if (pdfFile?.size) {
    programPdfUrl = await saveTourFiles([pdfFile], "program").then((arr) => arr[0] ?? null);
  }

  const tripVideoUrl = (formData.get("tripVideoUrl") as string | null)?.trim() || null;

  const daysData = parseDaysJson(formData.get("days") as string | null);
  const dayImageUrlsByOrder: (string[] | null)[] = [];
  for (let i = 0; i < daysData.length; i++) {
    const files = formData.getAll(`dayImages_${i}`).filter((v): v is File => v instanceof File);
    const urls = await saveTourFiles(files, `day-${i + 1}`);
    dayImageUrlsByOrder.push(urls.length ? urls : null);
  }

  if (!introText || !included || !excluded) {
    return { error: "Intro text and included/excluded sections are required." };
  }

  const cancellationPenalties =
    parseCancellationPenaltiesFromForm(
      formData.get("cancellationPenaltiesJson") as string | null
    ) ?? getDefaultCancellationPenalties();

  const tour = await prisma.tour.create({
    data: {
      title,
      status,
      durationLabel,
      durationDaysNights,
      tripSubtitle,
      tripCode,
      destinationCountry,
      destinationCities,
      tripCategory,
      introText,
      heroImageUrl,
      galleryImageUrls: galleryImageUrlsComputed,
      tripVideoUrl,
      programPdfUrl,

      startLocation,
      endLocation,
      meetingPoint,
      transportUsed,
      accommodationType,
      hotelCategory,
      roomType,

      minParticipants,
      maxGroupSize,
      ageRestrictions,
      difficultyLevel,
      requiresWalkingKmPerDay,

      basePrice: new Prisma.Decimal(basePrice),
      currency,
      singleSupplement,

      depositLabel,
      balanceDeadline,
      bookingDeadline,
      availableSeats,

      childPolicy,

      mandatoryInsurance,
      optionalInsurance,

      included,
      excluded,

      cancellationPenalties: cancellationPenaltiesToPrismaJson(cancellationPenalties),

      contactStaffName,
      contactPhone,
      contactEmail,

      days: {
        create: daysData.map((d, i) => ({
          order: i + 1,
          dayHeading: d.dayHeading,
          dateLabel: d.dateLabel,
          description: d.description,
          dayImageUrls: dayImageUrlsByOrder[i] ?? null,
        })),
      },
    },
  });

  revalidatePath("/dashboard/trips");
  revalidatePath("/upcoming-trips");
  redirect(`/dashboard/trips/${tour.id}/edit`);
}

export async function updateTrip(tourId: string, formData: FormData) {
  const existing = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { days: true },
  });
  if (!existing) return { error: "Trip not found." };

  const title = (formData.get("title") as string | null)?.trim();
  const statusRaw = (formData.get("status") as string | null)?.trim();
  const status = VALID_TOUR_STATUSES.includes(statusRaw as TourStatus)
    ? (statusRaw as TourStatus)
    : "UPCOMING";
  const durationLabel = (formData.get("durationLabel") as string | null)?.trim();
  const durationDaysNights = (formData.get("durationDaysNights") as string | null)?.trim() || null;

  const tripSubtitle = (formData.get("tripSubtitle") as string | null)?.trim() || null;
  const tripCode = (formData.get("tripCode") as string | null)?.trim() || null;
  const destinationCountry = (formData.get("destinationCountry") as string | null)?.trim() || null;
  const destinationCities = (formData.get("destinationCities") as string | null)?.trim() || null;
  const tripCategory = (formData.get("tripCategory") as string | null)?.trim() || null;

  const introText = (formData.get("introText") as string | null)?.trim() || "";
  const included = (formData.get("included") as string | null)?.trim() || "";
  const excluded = (formData.get("excluded") as string | null)?.trim() || "";

  if (!title || !durationLabel) {
    return { error: "Title and travel dates are required." };
  }

  const basePrice = parseDecimal(formData.get("basePrice") as string);
  if (basePrice == null || basePrice < 0) {
    return { error: "Base price is required and must be a number." };
  }

  const currency = (formData.get("currency") as string | null)?.trim() || "EUR";

  const singleSupplementRaw = parseDecimal(formData.get("singleSupplement") as string);
  const singleSupplement =
    singleSupplementRaw == null ? null : new Prisma.Decimal(singleSupplementRaw);

  const mandatoryInsurance = (formData.get("mandatoryInsurance") as string | null)?.trim() || null;
  const optionalInsurance = (formData.get("optionalInsurance") as string | null)?.trim() || null;
  const depositLabel = (formData.get("depositLabel") as string | null)?.trim() || null;
  const balanceDeadline = (formData.get("balanceDeadline") as string | null)?.trim() || null;
  const bookingDeadline = (formData.get("bookingDeadline") as string | null)?.trim() || null;
  const availableSeats = parseNullableInt(formData.get("availableSeats"));

  const childPolicy = (formData.get("childPolicy") as string | null)?.trim() || null;

  const startLocation = (formData.get("startLocation") as string | null)?.trim() || null;
  const endLocation = (formData.get("endLocation") as string | null)?.trim() || null;
  const meetingPoint = (formData.get("meetingPoint") as string | null)?.trim() || null;
  const transportUsed = (formData.get("transportUsed") as string | null)?.trim() || null;
  const accommodationType = (formData.get("accommodationType") as string | null)?.trim() || null;
  const hotelCategory = (formData.get("hotelCategory") as string | null)?.trim() || null;
  const roomType = (formData.get("roomType") as string | null)?.trim() || null;

  const minParticipants = parseNullableInt(formData.get("minParticipants"));
  const maxGroupSize = parseNullableInt(formData.get("maxGroupSize"));
  const ageRestrictions = (formData.get("ageRestrictions") as string | null)?.trim() || null;
  const difficultyLevel = (formData.get("difficultyLevel") as string | null)?.trim() || null;
  const requiresWalkingKmPerDay =
    (formData.get("requiresWalkingKmPerDay") as string | null)?.trim() || null;

  const contactStaffName =
    (formData.get("contactStaffName") as string | null)?.trim() || null;
  const contactPhone = (formData.get("contactPhone") as string | null)?.trim() || null;
  const contactEmail = (formData.get("contactEmail") as string | null)?.trim() || null;

  let heroImageUrl = existing.heroImageUrl;
  const heroFile = formData.get("heroImage") as File | null;
  if (heroFile?.size) {
    heroImageUrl = await saveTourFiles([heroFile], "hero").then((arr) => arr[0] ?? heroImageUrl);
  }

  let programPdfUrl = existing.programPdfUrl;
  const pdfFile = formData.get("programPdf") as File | null;
  if (pdfFile?.size) {
    programPdfUrl = await saveTourFiles([pdfFile], "program").then((arr) => arr[0] ?? programPdfUrl);
  }

  const galleryFromForm = parseUrlArrayFromFormField(formData, "existingGalleryImageUrls");
  const galleryFromDb = normalizeUrlList(existing.galleryImageUrls);
  const baseGallery = galleryFromForm !== null ? galleryFromForm : galleryFromDb;
  let galleryImageUrls: string[] | null = baseGallery.length ? [...baseGallery] : null;
  const galleryFiles = formData.getAll("galleryImages").filter((v): v is File => v instanceof File);
  if (galleryFiles.length > 0) {
    const urls = await saveTourFiles(galleryFiles, "gallery");
    const merged = [...baseGallery, ...urls];
    galleryImageUrls = merged.length ? merged : null;
  }

  const tripVideoUrl = (formData.get("tripVideoUrl") as string | null)?.trim() || null;

  const daysData = parseDaysJson(formData.get("days") as string | null);

  const existingDaysByOrder = new Map<number, string[]>();
  for (const d of existing.days) {
    existingDaysByOrder.set(d.order, normalizeUrlList(d.dayImageUrls));
  }

  const dayImageUrlsByOrder: (string[] | null)[] = [];
  for (let i = 0; i < daysData.length; i++) {
    const files = formData.getAll(`dayImages_${i}`).filter((v): v is File => v instanceof File);
    const dayFromForm = parseUrlArrayFromFormField(formData, `existingDayImageUrls_${i}`);
    const dayFromDb = existingDaysByOrder.get(i + 1) ?? [];
    const baseDayUrls = dayFromForm !== null ? dayFromForm : dayFromDb;
    if (files.length > 0) {
      const urls = await saveTourFiles(files, `day-${i + 1}`);
      const merged = [...baseDayUrls, ...urls];
      dayImageUrlsByOrder.push(merged.length ? merged : null);
    } else {
      dayImageUrlsByOrder.push(baseDayUrls.length ? baseDayUrls : null);
    }
  }

  if (!introText || !included || !excluded) {
    return { error: "Intro text and included/excluded sections are required." };
  }

  const cancellationPenalties =
    parseCancellationPenaltiesFromForm(
      formData.get("cancellationPenaltiesJson") as string | null
    ) ?? getDefaultCancellationPenalties();

  await prisma.tour.update({
    where: { id: tourId },
    data: {
      title,
      status,
      durationLabel,
      durationDaysNights,
      tripSubtitle,
      tripCode,
      destinationCountry,
      destinationCities,
      tripCategory,
      introText,
      heroImageUrl,
      galleryImageUrls,
      tripVideoUrl,
      programPdfUrl,

      startLocation,
      endLocation,
      meetingPoint,
      transportUsed,
      accommodationType,
      hotelCategory,
      roomType,

      minParticipants,
      maxGroupSize,
      ageRestrictions,
      difficultyLevel,
      requiresWalkingKmPerDay,

      basePrice: new Prisma.Decimal(basePrice),
      currency,
      singleSupplement,

      depositLabel,
      balanceDeadline,
      bookingDeadline,
      availableSeats,

      childPolicy,

      mandatoryInsurance,
      optionalInsurance,

      included,
      excluded,

      cancellationPenalties: cancellationPenaltiesToPrismaJson(cancellationPenalties),

      contactStaffName,
      contactPhone,
      contactEmail,
    },
  });

  await prisma.tourDay.deleteMany({ where: { tourId } });
  await prisma.tourDay.createMany({
    data: daysData.map((d, i) => ({
      tourId,
      order: i + 1,
      dayHeading: d.dayHeading,
      dateLabel: d.dateLabel,
      description: d.description,
      dayImageUrls: dayImageUrlsByOrder[i] ?? null,
    })),
  });

  revalidatePath("/dashboard/trips");
  revalidatePath(`/dashboard/trips/${tourId}/edit`);
  revalidatePath("/upcoming-trips");
  revalidatePath(`/upcoming-trips/${tourId}`);
  return { success: true };
}

export async function deleteTrip(formData: FormData) {
  const id = (formData.get("id") as string) ?? "";
  if (!id) return;

  await prisma.tour.delete({ where: { id } });

  revalidatePath("/dashboard/trips");
  revalidatePath("/upcoming-trips");
}
