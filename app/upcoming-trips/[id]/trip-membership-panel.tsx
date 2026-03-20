"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MembershipForm, type PackageOption } from "@/components/membership-form";
import {
  submitMembershipBookingAction,
  type MembershipDraft,
  type SubmitResult,
} from "@/app/membership/actions";

const DRAFT_KEY_PREFIX = "travel_land_membership_draft_trip_";

function getDefaultDraft(
  selectedPackage: PackageOption,
  profile?: { fullName: string; email: string }
): MembershipDraft {
  return {
    fullName: profile?.fullName ?? "",
    dateOfBirth: "",
    address: "",
    taxCode: "",
    email: profile?.email ?? "",
    phone: "",
    packageName: selectedPackage.title,
    tourId: selectedPackage.id,
    roomType: "",
    baseRate: selectedPackage.basePrice,
    insuranceAmount: 0,
    registrationFees: 0,
    total: selectedPackage.basePrice,
    gdprAccepted: false,
    cancellationAccepted: false,
  };
}

type TripMembershipPanelProps = {
  selectedPackage: PackageOption;
  isAuthenticated: boolean;
  userProfile: { fullName: string; email: string } | null;
};

export function TripMembershipPanel({
  selectedPackage,
  isAuthenticated,
  userProfile,
}: TripMembershipPanelProps) {
  const draftKey = `${DRAFT_KEY_PREFIX}${selectedPackage.id}`;
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [data, setData] = useState<MembershipDraft>(() =>
    getDefaultDraft(selectedPackage, userProfile ?? undefined)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof MembershipDraft, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const mounted = useRef(false);
  const autoSubmitted = useRef(false);

  const callbackParam = searchParams.get("callback");
  const errorParam = searchParams.get("error");

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
      return {
        ...base,
        ...parsed,
        packageName: selectedPackage.title,
        tourId: selectedPackage.id,
        baseRate:
          typeof parsed.baseRate === "number" && parsed.baseRate > 0
            ? parsed.baseRate
            : selectedPackage.basePrice,
        total:
          typeof parsed.total === "number" && parsed.total > 0
            ? parsed.total
            : selectedPackage.basePrice +
              (typeof parsed.insuranceAmount === "number" ? parsed.insuranceAmount : 0) +
              (typeof parsed.registrationFees === "number" ? parsed.registrationFees : 0),
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

  async function sendMagicLink(email: string) {
    setMagicLinkError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setMagicLinkError("Please enter your email.");
      return;
    }

    try {
      const next = `${pathname}?callback=1`;
      const res = await fetch("/api/auth/magic/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, next }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setMagicLinkError(body?.error ?? "Failed to send magic link");
        return;
      }
      setMagicLinkSent(true);
    } catch (e) {
      setMagicLinkError(e instanceof Error ? e.message : "Failed to send magic link");
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setSuccessRef(null);

      if (!isAuthenticated) {
        setIsSubmitting(true);
        try {
          saveDraft(data);
          setMagicLinkSent(false);
          await sendMagicLink(data.email);
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      setMagicLinkError(null);
      setMagicLinkSent(false);

      setIsSubmitting(true);
      const result: SubmitResult = await submitMembershipBookingAction(null, data);
      setIsSubmitting(false);

      if (result.error) {
        if (result.error === "Please sign in to continue.") {
          saveDraft(data);
          setMagicLinkSent(false);
          setMagicLinkError("Please submit again to receive a magic link.");
          return;
        }
        setErrors({ fullName: result.error });
        return;
      }

      setSuccessRef(result.reference ?? "Submitted");
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
    },
    [data, draftKey, isAuthenticated, saveDraft, pathname]
  );

  useEffect(() => {
    if (!isAuthenticated || !callbackParam || autoSubmitted.current) return;
    const draft = loadDraft();
    if (!draft) return;
    autoSubmitted.current = true;

    (async () => {
      setIsSubmitting(true);
      const result = await submitMembershipBookingAction(null, draft);
      setIsSubmitting(false);

      if (result.error === "Please sign in to continue.") {
        setMagicLinkSent(false);
        setMagicLinkError("Sign-in required. Please submit again to receive a magic link.");
        return;
      }
      if (result.error) return;

      setSuccessRef(result.reference ?? "Submitted");
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
    })();
  }, [callbackParam, draftKey, isAuthenticated, loadDraft]);

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
      {magicLinkSent && !isAuthenticated && (
        <p
          className="rounded-lg bg-[var(--color-success-bg)] px-3 py-2 text-sm text-[var(--color-success)]"
          role="status"
        >
          Check your email for a sign-in link. After clicking it, your booking will continue here.
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
      {successRef && (
        <p
          className="rounded-lg bg-[var(--color-success-bg)] px-3 py-2 text-sm text-[var(--color-success)]"
          role="status"
        >
          Membership form submitted successfully. Reference: {successRef}
        </p>
      )}

      <MembershipForm
        data={data}
        onChange={setData}
        packages={[selectedPackage]}
        errors={errors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || (magicLinkSent && !isAuthenticated)}
        compact
      />
    </div>
  );
}

