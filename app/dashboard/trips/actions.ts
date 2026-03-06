"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveTourFile } from "@/lib/upload";
import { Prisma, type TourStatus } from "@prisma/client";

const STAFF_OPTIONS = ["Eleonora", "Sisira", "Romeo"];

function parseDecimal(value: string | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseDaysJson(value: string | null): { dayHeading: string; description: string }[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (d): d is { dayHeading?: string; description?: string } =>
          d != null && typeof d === "object"
      )
      .map((d) => ({
        dayHeading: String(d.dayHeading ?? "").trim(),
        description: String(d.description ?? "").trim(),
      }))
      .filter((d) => d.dayHeading || d.description);
  } catch {
    return [];
  }
}

function getStaffFromFormData(formData: FormData): string | null {
  const selected: string[] = [];
  for (const name of STAFF_OPTIONS) {
    if (formData.get(`contact_${name}`) === "on") selected.push(name);
  }
  return selected.length > 0 ? selected.join(",") : null;
}

/** No-op for create page so we can pass a server action reference. */
export async function noopUpdateTrip(
  _tourId: string,
  _formData: FormData
): Promise<{ error?: string }> {
  return { error: "Use the edit page to update a trip." };
}

export async function createTrip(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const durationLabel = (formData.get("durationLabel") as string)?.trim();
  const introText = (formData.get("introText") as string)?.trim() || "";
  const included = (formData.get("included") as string)?.trim() || "";
  const excluded = (formData.get("excluded") as string)?.trim() || "";

  if (!title || !durationLabel) {
    return { error: "Title and duration are required." };
  }

  const basePrice = parseDecimal(formData.get("basePrice") as string);
  if (basePrice == null || basePrice < 0) {
    return { error: "Base price is required and must be a number." };
  }

  let heroImageUrl: string | null = null;
  const heroFile = formData.get("heroImage") as File | null;
  if (heroFile?.size && heroFile.size > 0) {
    heroImageUrl = await saveTourFile(heroFile, "hero");
  }

  let programPdfUrl: string | null = null;
  const pdfFile = formData.get("programPdf") as File | null;
  if (pdfFile?.size && pdfFile.size > 0) {
    programPdfUrl = await saveTourFile(pdfFile, "program");
  }

  const status = (formData.get("status") as string) === "ARCHIVED" ? "ARCHIVED" : "UPCOMING";
  const daysData = parseDaysJson(formData.get("days") as string | null);

  const tour = await prisma.tour.create({
    data: {
      title,
      status: status as TourStatus,
      durationLabel,
      heroImageUrl,
      introText,
      basePrice: new Prisma.Decimal(basePrice),
      singleSupplement: parseDecimal(formData.get("singleSupplement") as string) != null
        ? new Prisma.Decimal(parseDecimal(formData.get("singleSupplement") as string)!)
        : null,
      mandatoryInsurance: (formData.get("mandatoryInsurance") as string)?.trim() || null,
      optionalInsurance: (formData.get("optionalInsurance") as string)?.trim() || null,
      depositLabel: (formData.get("depositLabel") as string)?.trim() || null,
      balanceDeadline: (formData.get("balanceDeadline") as string)?.trim() || null,
      included,
      excluded,
      cancellationPolicy: (formData.get("cancellationPolicy") as string)?.trim() || null,
      programPdfUrl,
      contactStaff: getStaffFromFormData(formData),
      days: {
        create: daysData.map((d, i) => ({
          order: i + 1,
          dayHeading: d.dayHeading,
          description: d.description,
        })),
      },
    },
  });

  revalidatePath("/dashboard/trips");
  redirect(`/dashboard/trips/${tour.id}/edit`);
}

export async function updateTrip(tourId: string, formData: FormData) {
  const existing = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!existing) return { error: "Trip not found." };

  const title = (formData.get("title") as string)?.trim();
  const durationLabel = (formData.get("durationLabel") as string)?.trim();
  const introText = (formData.get("introText") as string)?.trim() || "";
  const included = (formData.get("included") as string)?.trim() || "";
  const excluded = (formData.get("excluded") as string)?.trim() || "";

  if (!title || !durationLabel) {
    return { error: "Title and duration are required." };
  }

  const basePrice = parseDecimal(formData.get("basePrice") as string);
  if (basePrice == null || basePrice < 0) {
    return { error: "Base price is required and must be a number." };
  }

  let heroImageUrl = existing.heroImageUrl;
  const heroFile = formData.get("heroImage") as File | null;
  if (heroFile?.size && heroFile.size > 0) {
    heroImageUrl = await saveTourFile(heroFile, "hero");
  }

  let programPdfUrl = existing.programPdfUrl;
  const pdfFile = formData.get("programPdf") as File | null;
  if (pdfFile?.size && pdfFile.size > 0) {
    programPdfUrl = await saveTourFile(pdfFile, "program");
  }

  const status = (formData.get("status") as string) === "ARCHIVED" ? "ARCHIVED" : "UPCOMING";
  const daysData = parseDaysJson(formData.get("days") as string | null);

  await prisma.tour.update({
    where: { id: tourId },
    data: {
      title,
      status: status as TourStatus,
      durationLabel,
      heroImageUrl,
      introText,
      basePrice: new Prisma.Decimal(basePrice),
      singleSupplement: parseDecimal(formData.get("singleSupplement") as string) != null
        ? new Prisma.Decimal(parseDecimal(formData.get("singleSupplement") as string)!)
        : null,
      mandatoryInsurance: (formData.get("mandatoryInsurance") as string)?.trim() || null,
      optionalInsurance: (formData.get("optionalInsurance") as string)?.trim() || null,
      depositLabel: (formData.get("depositLabel") as string)?.trim() || null,
      balanceDeadline: (formData.get("balanceDeadline") as string)?.trim() || null,
      included,
      excluded,
      cancellationPolicy: (formData.get("cancellationPolicy") as string)?.trim() || null,
      programPdfUrl,
      contactStaff: getStaffFromFormData(formData),
    },
  });

  await prisma.tourDay.deleteMany({ where: { tourId } });
  if (daysData.length > 0) {
    await prisma.tourDay.createMany({
      data: daysData.map((d, i) => ({
        tourId,
        order: i + 1,
        dayHeading: d.dayHeading,
        description: d.description,
      })),
    });
  }

  revalidatePath("/dashboard/trips");
  revalidatePath(`/dashboard/trips/${tourId}/edit`);
  return { success: true };
}

export async function deleteTrip(formData: FormData) {
  const id = (formData.get("id") as string) ?? "";
  if (!id) return;

  await prisma.tour.delete({ where: { id } });

  revalidatePath("/dashboard/trips");
  revalidatePath("/upcoming-trips");
}
