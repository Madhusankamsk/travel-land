import type { MembershipDraft } from "@/app/membership/actions";

export const MEMBERSHIP_DRAFT_STORAGE_KEY = "travel_land_membership_draft";

function emptyDefaults(): MembershipDraft {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    taxCode: "",
    email: "",
    telephone: "",
    packageName: "",
    tourId: undefined,
    roomType: "",
    baseQuota: 0,
    supplementsVarious: 0,
    mandatoryMedicalBaggageInsuranceAmount: 0,
    travelCancellationInsuranceAmount: 0,
    registrationFee: 0,
    totalQuota: 0,
    declarationAccepted: false,
    dataProcessingAccepted: false,
  };
}

/** Load and normalize draft from localStorage (same shape as membership form). */
export function loadStoredMembershipDraft(): MembershipDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MEMBERSHIP_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MembershipDraft>;
    const def = emptyDefaults();
    return {
      firstName: parsed.firstName ?? def.firstName,
      lastName: parsed.lastName ?? def.lastName,
      dateOfBirth: parsed.dateOfBirth ?? def.dateOfBirth,
      address: parsed.address ?? def.address,
      taxCode: parsed.taxCode ?? def.taxCode,
      email: parsed.email ?? def.email,
      telephone: parsed.telephone ?? def.telephone,
      packageName: parsed.packageName ?? def.packageName,
      tourId: parsed.tourId ?? def.tourId,
      roomType: parsed.roomType ?? def.roomType,
      baseQuota: typeof parsed.baseQuota === "number" ? parsed.baseQuota : def.baseQuota,
      supplementsVarious:
        typeof parsed.supplementsVarious === "number" ? parsed.supplementsVarious : def.supplementsVarious,
      mandatoryMedicalBaggageInsuranceAmount:
        typeof parsed.mandatoryMedicalBaggageInsuranceAmount === "number"
          ? parsed.mandatoryMedicalBaggageInsuranceAmount
          : def.mandatoryMedicalBaggageInsuranceAmount,
      travelCancellationInsuranceAmount:
        typeof parsed.travelCancellationInsuranceAmount === "number"
          ? parsed.travelCancellationInsuranceAmount
          : def.travelCancellationInsuranceAmount,
      registrationFee:
        typeof parsed.registrationFee === "number" ? parsed.registrationFee : def.registrationFee,
      totalQuota: typeof parsed.totalQuota === "number" ? parsed.totalQuota : def.totalQuota,
      declarationAccepted: Boolean(parsed.declarationAccepted),
      dataProcessingAccepted: Boolean(parsed.dataProcessingAccepted),
    };
  } catch {
    return null;
  }
}

export function saveStoredMembershipDraft(data: MembershipDraft) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MEMBERSHIP_DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
