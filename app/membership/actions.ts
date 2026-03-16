"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export type MembershipDraft = {
  fullName: string;
  dateOfBirth: string;
  address: string;
  taxCode: string;
  email: string;
  phone: string;
  packageName: string;
  tourId?: string;
  roomType: string;
  baseRate: number;
  insuranceAmount: number;
  registrationFees: number;
  total: number;
  gdprAccepted: boolean;
  cancellationAccepted: boolean;
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
      fullName: (payload.get("fullName") as string)?.trim() ?? "",
      dateOfBirth: (payload.get("dateOfBirth") as string) ?? "",
      address: (payload.get("address") as string)?.trim() ?? "",
      taxCode: (payload.get("taxCode") as string)?.trim() ?? "",
      email: (payload.get("email") as string)?.trim() ?? "",
      phone: (payload.get("phone") as string)?.trim() ?? "",
      packageName: (payload.get("packageName") as string)?.trim() ?? "",
      tourId: (payload.get("tourId") as string) || undefined,
      roomType: (payload.get("roomType") as string)?.trim() ?? "",
      baseRate: parseNum(payload.get("baseRate")),
      insuranceAmount: parseNum(payload.get("insuranceAmount")),
      registrationFees: parseNum(payload.get("registrationFees")),
      total: parseNum(payload.get("total")),
      gdprAccepted: payload.get("gdprAccepted") === "on" || payload.get("gdprAccepted") === "true",
      cancellationAccepted:
        payload.get("cancellationAccepted") === "on" || payload.get("cancellationAccepted") === "true",
    };
  } else {
    data = { ...payload };
  }

  const fullName = (data.fullName ?? "").trim();
  const dateOfBirth = parseDate(data.dateOfBirth);
  const address = (data.address ?? "").trim();
  const taxCode = (data.taxCode ?? "").trim();
  const email = (data.email ?? "").trim().toLowerCase();
  const phone = (data.phone ?? "").trim();
  const packageName = (data.packageName ?? "").trim();
  const roomType = (data.roomType ?? "").trim();
  const gdprAccepted = Boolean(data.gdprAccepted);
  const cancellationAccepted = Boolean(data.cancellationAccepted);

  if (!fullName) return { error: "Full name is required." };
  if (!dateOfBirth) return { error: "Date of birth is required." };
  if (!address) return { error: "Address is required." };
  if (!taxCode) return { error: "Tax code is required." };
  if (!email) return { error: "Email is required." };
  if (!phone) return { error: "Phone is required." };
  if (!packageName) return { error: "Package selection is required." };
  if (!roomType || !["Single", "Double", "Triple"].includes(roomType)) {
    return { error: "Please select room type: Single, Double, or Triple." };
  }
  if (!gdprAccepted) return { error: "You must accept the GDPR policy." };
  if (!cancellationAccepted) return { error: "You must accept the cancellation policy." };

  const baseRate = parseNum(data.baseRate);
  const insuranceAmount = parseNum(data.insuranceAmount);
  const registrationFees = parseNum(data.registrationFees);
  const total = parseNum(data.total);

  const reference = "TL-" + Date.now().toString(36).toUpperCase().slice(-6);

  await prisma.membershipBooking.create({
    data: {
      userId,
      fullName,
      dateOfBirth,
      address,
      taxCode,
      email,
      phone,
      packageName,
      tourId: (data.tourId as string) || null,
      roomType,
      baseRate,
      insuranceAmount,
      registrationFees,
      total,
      gdprAccepted,
      cancellationAccepted,
      reference,
    },
  });

  return { reference };
}
