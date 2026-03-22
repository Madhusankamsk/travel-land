"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MembershipForm, type PackageOption } from "@/components/membership-form";
import {
  submitMembershipBookingAction,
  type MembershipDraft,
  type SubmitResult,
} from "@/app/membership/actions";
import { saveStoredMembershipDraft } from "@/lib/membership-draft-storage";
import { MAGIC_LINK_MEMBERSHIP_NEXT } from "@/lib/membership-magic";

const DRAFT_KEY_PREFIX = "travel_land_membership_draft_trip_";

function getDefaultDraft(
  selectedPackage: PackageOption,
  profile?: { firstName: string; lastName: string; email: string }
): MembershipDraft {
  return {
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    dateOfBirth: "",
    address: "",
    taxCode: "",
    email: profile?.email ?? "",
    telephone: "",
    packageName: selectedPackage.title,
    tourId: selectedPackage.id,
    roomType: "",
    baseQuota: selectedPackage.basePrice,
    supplementsVarious: 0,
    mandatoryMedicalBaggageInsuranceAmount: 0,
    travelCancellationInsuranceAmount: 0,
    registrationFee: 0,
    totalQuota: selectedPackage.basePrice,
    declarationAccepted: false,
    dataProcessingAccepted: false,
  };
}

type TripMembershipPanelProps = {
  selectedPackage: PackageOption;
  isAuthenticated: boolean;
  userProfile: { firstName: string; lastName: string; email: string } | null;
};

export function TripMembershipPanel({
  selectedPackage,
  isAuthenticated,
  userProfile,
}: TripMembershipPanelProps) {
  const draftKey = `${DRAFT_KEY_PREFIX}${selectedPackage.id}`;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<MembershipDraft>(() =>
    getDefaultDraft(selectedPackage, userProfile ?? undefined)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof MembershipDraft, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  const mounted = useRef(false);
  const callbackParam = searchParams.get("callback");
  const errorParam = searchParams.get("error");
  const legacyTripCallbackRedirected = useRef(false);

  const saveDraft = useCallback(
    (draft: MembershipDraft) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // ignore
      }
    },
    [draftKey]
  );

  const loadDraft = useCallback((): MembershipDraft | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<MembershipDraft>;
      const base = getDefaultDraft(selectedPackage, userProfile ?? undefined);
      const baseQuota =
        typeof parsed.baseQuota === "number" && parsed.baseQuota >= 0
          ? parsed.baseQuota
          : selectedPackage.basePrice;

      const supplementsVarious = typeof parsed.supplementsVarious === "number" ? parsed.supplementsVarious : 0;
      const mandatoryMedicalBaggageInsuranceAmount =
        typeof parsed.mandatoryMedicalBaggageInsuranceAmount === "number"
          ? parsed.mandatoryMedicalBaggageInsuranceAmount
          : 0;
      const travelCancellationInsuranceAmount =
        typeof parsed.travelCancellationInsuranceAmount === "number"
          ? parsed.travelCancellationInsuranceAmount
          : 0;
      const registrationFee =
        typeof parsed.registrationFee === "number" ? parsed.registrationFee : 0;

      return {
        ...base,
        ...parsed,
        packageName: selectedPackage.title,
        tourId: selectedPackage.id,
        baseQuota,
        supplementsVarious,
        mandatoryMedicalBaggageInsuranceAmount,
        travelCancellationInsuranceAmount,
        registrationFee,
        totalQuota:
          baseQuota + supplementsVarious + mandatoryMedicalBaggageInsuranceAmount + travelCancellationInsuranceAmount + registrationFee,
      };
    } catch {
      return null;
    }
  }, [draftKey, selectedPackage, userProfile]);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const draft = loadDraft();
    setData(draft ?? getDefaultDraft(selectedPackage, userProfile ?? undefined));
  }, [loadDraft, selectedPackage, userProfile]);

  useEffect(() => {
    if (!mounted.current) return;
    const t = setTimeout(() => saveDraft(data), 400);
    return () => clearTimeout(t);
  }, [data, saveDraft]);

  const sendMagicLink = useCallback(
    async (email: string): Promise<boolean> => {
      setMagicLinkError(null);
      const trimmed = email.trim();
      if (!trimmed) {
        setMagicLinkError("Please enter your email.");
        return false;
      }

      try {
        const res = await fetch("/api/auth/magic/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, next: MAGIC_LINK_MEMBERSHIP_NEXT }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          setMagicLinkError(body?.error ?? "Failed to send magic link");
          return false;
        }
        return true;
      } catch (e) {
        setMagicLinkError(e instanceof Error ? e.message : "Failed to send magic link");
        return false;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      if (!isAuthenticated) {
        setIsSubmitting(true);
        try {
          saveDraft(data);
          saveStoredMembershipDraft(data);
          const ok = await sendMagicLink(data.email);
          if (ok) {
            router.push(
              `/membership/check-email?next=${encodeURIComponent(MAGIC_LINK_MEMBERSHIP_NEXT)}`
            );
          }
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      setMagicLinkError(null);

      setIsSubmitting(true);
      const result: SubmitResult = await submitMembershipBookingAction(null, data);
      setIsSubmitting(false);

      if (result.error) {
        if (result.error === "Please sign in to continue.") {
          saveDraft(data);
          saveStoredMembershipDraft(data);
          setMagicLinkError("Please submit again to receive a magic link.");
          return;
        }
        setErrors({ firstName: result.error });
        return;
      }

      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
      if (result.reference) {
        router.push(`/membership/success?ref=${encodeURIComponent(result.reference)}`);
      }
    },
    [data, draftKey, isAuthenticated, router, saveDraft, sendMagicLink]
  );

  /** Legacy links used ?callback=1 on this page; continue on profile with the same draft. */
  useEffect(() => {
    if (!isAuthenticated || callbackParam !== "1" || legacyTripCallbackRedirected.current) return;
    legacyTripCallbackRedirected.current = true;
    const draft = loadDraft();
    if (draft) {
      saveStoredMembershipDraft(draft);
    }
    router.replace(MAGIC_LINK_MEMBERSHIP_NEXT);
  }, [callbackParam, isAuthenticated, loadDraft, router]);

  return (
    <div className="space-y-4">
      {magicLinkError && !isAuthenticated && (
        <p
          className="rounded-lg border border-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 text-sm text-[var(--color-error)]"
          role="alert"
        >
          {magicLinkError}
        </p>
      )}
      {errorParam === "auth_failed" && (
        <p
          className="rounded-lg border border-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 text-sm text-[var(--color-error)]"
          role="alert"
        >
          Sign-in failed. Please request a new magic link.
        </p>
      )}
      <MembershipForm
        data={data}
        onChange={setData}
        packages={[selectedPackage]}
        errors={errors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        compact
      />
    </div>
  );
}

