"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export type MembershipDraft = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  taxCode: string;
  email: string;
  telephone: string;
  packageName: string;
  tourId?: string;
  roomType: string;
  baseQuota: number;
  supplementsVarious: number;
  mandatoryMedicalBaggageInsuranceAmount: number;
  travelCancellationInsuranceAmount: number;
  registrationFee: number;
  totalQuota: number;
  declarationAccepted: boolean;
  dataProcessingAccepted: boolean;
};

export type SubmitResult = { error?: string; reference?: string };

function parseNum(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/,/g, "."));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function parseDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Submit membership form. Requires authenticated user (cookie).
 * Call from client with FormData or with draft JSON (e.g. after auth redirect auto-submit).
 */
export async function submitMembershipBookingAction(
  _prev: SubmitResult | null,
  payload: FormData | MembershipDraft
): Promise<SubmitResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "Please sign in to continue." };
  }

  let data: Partial<MembershipDraft> & Record<string, unknown>;
  if (payload instanceof FormData) {
    data = {
      firstName: (payload.get("firstName") as string)?.trim() ?? "",
      lastName: (payload.get("lastName") as string)?.trim() ?? "",
      dateOfBirth: (payload.get("dateOfBirth") as string) ?? "",
      address: (payload.get("address") as string)?.trim() ?? "",
      taxCode: (payload.get("taxCode") as string)?.trim() ?? "",
      email: (payload.get("email") as string)?.trim() ?? "",
      telephone: (payload.get("telephone") as string)?.trim() ?? "",
      packageName: (payload.get("packageName") as string)?.trim() ?? "",
      tourId: (payload.get("tourId") as string) || undefined,
      roomType: (payload.get("roomType") as string)?.trim() ?? "",
      baseQuota: parseNum(payload.get("baseQuota")),
      supplementsVarious: parseNum(payload.get("supplementsVarious")),
      mandatoryMedicalBaggageInsuranceAmount: parseNum(payload.get("mandatoryMedicalBaggageInsuranceAmount")),
      travelCancellationInsuranceAmount: parseNum(payload.get("travelCancellationInsuranceAmount")),
      registrationFee: parseNum(payload.get("registrationFee")),
      totalQuota: parseNum(payload.get("totalQuota")),
      declarationAccepted:
        payload.get("declarationAccepted") === "on" || payload.get("declarationAccepted") === "true",
      dataProcessingAccepted:
        payload.get("dataProcessingAccepted") === "on" || payload.get("dataProcessingAccepted") === "true",
    };
  } else {
    data = { ...payload };
  }

  const firstName = (data.firstName ?? "").trim();
  const lastName = (data.lastName ?? "").trim();
  const dateOfBirth = parseDate(data.dateOfBirth);
  const address = (data.address ?? "").trim();
  const taxCode = (data.taxCode ?? "").trim();
  const email = (data.email ?? "").trim().toLowerCase();
  const telephone = (data.telephone ?? "").trim();
  const packageName = (data.packageName ?? "").trim();
  const roomType = (data.roomType ?? "").trim();
  const declarationAccepted = Boolean(data.declarationAccepted);
  const dataProcessingAccepted = Boolean(data.dataProcessingAccepted);

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!firstName) return { error: "First name is required." };
  if (!lastName) return { error: "Last name is required." };
  if (!dateOfBirth) return { error: "Date of birth is required." };
  if (!address) return { error: "Address is required." };
  if (!taxCode) return { error: "Tax code is required." };
  if (!email) return { error: "Email is required." };
  if (!telephone) return { error: "Telephone is required." };
  if (!packageName) return { error: "Package selection is required." };
  if (
    !roomType ||
    !["Double", "Double Shared", "Single", "Triple", "Triple Shared"].includes(roomType)
  ) {
    return { error: "Please select room type." };
  }
  if (!declarationAccepted) return { error: "You must accept the declaration." };
  if (!dataProcessingAccepted) return { error: "You must accept the data processing consent." };

  const baseQuota = parseNum(data.baseQuota);
  const supplementsVarious = parseNum(data.supplementsVarious);
  const mandatoryMedicalBaggageInsuranceAmount = parseNum(data.mandatoryMedicalBaggageInsuranceAmount);
  const travelCancellationInsuranceAmount = parseNum(data.travelCancellationInsuranceAmount);
  const registrationFee = parseNum(data.registrationFee);

  const computedTotalQuota =
    baseQuota +
    supplementsVarious +
    mandatoryMedicalBaggageInsuranceAmount +
    travelCancellationInsuranceAmount +
    registrationFee;

  const tourId = (data.tourId as string) || null;
  if (tourId) {
    const existing = await prisma.membershipBooking.findFirst({
      where: { userId, tourId },
      select: { id: true },
    });
    if (existing) return { error: "You already submitted a request for this trip." };
  }

  const reference = "TL-" + Date.now().toString(36).toUpperCase().slice(-6);

  await prisma.membershipBooking.create({
    data: {
      userId,
      fullName,
      firstName,
      lastName,
      dateOfBirth,
      address,
      taxCode,
      email,
      telephone,
      packageName,
      tourId,
      roomType,
      baseQuota,
      supplementsVarious,
      mandatoryMedicalBaggageInsuranceAmount,
      travelCancellationInsuranceAmount,
      registrationFee,
      totalQuota: computedTotalQuota,
      declarationAccepted,
      dataProcessingAccepted,
      reference,
    },
  });

  return { reference };
}
