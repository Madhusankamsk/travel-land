"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipForm } from "@/components/membership-form";
import {
  submitMembershipBookingAction,
  type MembershipDraft,
  type SubmitResult,
} from "@/app/membership/actions";
import type { PackageOption } from "@/components/membership-form";

const DRAFT_KEY = "travel_land_membership_draft";
const MEMBERSHIP_NEXT = "/membership?callback=1";

function getDefaultDraft(profile?: { firstName: string; lastName: string; email: string }): MembershipDraft {
  return {
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    dateOfBirth: "",
    address: "",
    taxCode: "",
    email: profile?.email ?? "",
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

function loadDraft(): MembershipDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MembershipDraft>;
    const def = getDefaultDraft();
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
      supplementsVarious: typeof parsed.supplementsVarious === "number" ? parsed.supplementsVarious : def.supplementsVarious,
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

function saveDraft(data: MembershipDraft) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

type MembershipPageClientProps = {
  packages: PackageOption[];
  isAuthenticated: boolean;
  userProfile: { firstName: string; lastName: string; email: string } | null;
  callbackParam: string | null;
  errorParam: string | null;
  tourIdParam: string | null;
};

export function MembershipPageClient({
  packages,
  isAuthenticated,
  userProfile,
  callbackParam,
  errorParam,
  tourIdParam,
}: MembershipPageClientProps) {
  const router = useRouter();
  const [data, setData] = useState<MembershipDraft>(() =>
    getDefaultDraft(userProfile ?? undefined)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof MembershipDraft, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  const mounted = useRef(false);

  const persistDraft = useCallback((d: MembershipDraft) => {
    setData(d);
    saveDraft(d);
  }, []);

  async function sendMagicLink(email: string) {
    setMagicLinkError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setMagicLinkError("Please enter your email.");
      return;
    }
    try {
      const res = await fetch("/api/auth/magic/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, next: MEMBERSHIP_NEXT }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setMagicLinkError(data?.error ?? "Failed to send magic link");
        return;
      }

      setMagicLinkSent(true);
    } catch (e) {
      setMagicLinkError(e instanceof Error ? e.message : "Failed to send link");
    }
  }

  useEffect(() => {
    if (!mounted.current && packages.length >= 0) {
      mounted.current = true;
      const saved = loadDraft();
      const base = saved
        ? { ...getDefaultDraft(userProfile ?? undefined), ...saved }
        : getDefaultDraft(userProfile ?? undefined);
      if (userProfile && !saved) {
        base.firstName = userProfile.firstName || base.firstName;
        base.lastName = userProfile.lastName || base.lastName;
        base.email = userProfile.email || base.email;
      }
      if (tourIdParam && packages.length > 0) {
        const pkg = packages.find((p) => p.id === tourIdParam);
        if (pkg) {
          base.packageName = pkg.title;
          base.tourId = pkg.id;
          const addSingle = base.roomType === "Single" ? Number(pkg.singleSupplement ?? 0) : 0;
          base.baseQuota = pkg.basePrice;
          base.supplementsVarious = addSingle;
          base.totalQuota =
            pkg.basePrice +
            addSingle +
            (base.mandatoryMedicalBaggageInsuranceAmount || 0) +
            (base.travelCancellationInsuranceAmount || 0) +
            (base.registrationFee || 0);
        }
      }
      setData(base);
    }
  }, [userProfile, tourIdParam, packages]);

  useEffect(() => {
    if (!mounted.current) return;
    const t = setTimeout(() => saveDraft(data), 500);
    return () => clearTimeout(t);
  }, [data]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

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

      // If authenticated, clear any prior auth UI state.
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
        setErrors({ firstName: result.error });
        return;
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      router.push(`/membership/success?ref=${encodeURIComponent(result.reference ?? "")}`);
    },
    [data, isAuthenticated, router]
  );

  const autoSubmitted = useRef(false);
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
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      router.replace(`/membership/success?ref=${encodeURIComponent(result.reference ?? "")}`);
    })();
  }, [isAuthenticated, callbackParam, router]);

  return (
    <div className="min-h-screen bg-[var(--color-travertine)] py-10">
      <div className="mx-auto max-w-[720px] px-4">
        {magicLinkError && !isAuthenticated && (
          <div
            className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {magicLinkError}
          </div>
        )}
        {magicLinkSent && !isAuthenticated && (
          <div className="mb-6 rounded-xl bg-[var(--color-success-bg)] px-4 py-3 text-sm text-[var(--color-success)]" role="status">
            Check your email for a sign-in link. After you click it, we will continue your booking automatically.
          </div>
        )}
        {errorParam && (
          <div
            className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errorParam === "auth_failed" && "Sign-in failed. Please try again."}
            {errorParam === "no_email" && "No email from sign-in. Please use another method."}
            {errorParam === "callback_config" && "Magic-link auth is not configured. Check your SMTP_* env vars and restart the dev server (npm run dev)."}
            {!["auth_failed", "no_email", "callback_config"].includes(errorParam) && "Something went wrong."}
          </div>
        )}
        <header className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-obsidian)] md:text-4xl">
            Travel membership form
          </h1>
          <p className="mt-2 text-[#7A7060]">
            Complete the form below. You can sign in at the end to submit — your answers will be saved.
          </p>
        </header>
        <MembershipForm
          data={data}
          onChange={persistDraft}
          packages={packages}
          errors={errors}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || (magicLinkSent && !isAuthenticated)}
        />
      </div>
    </div>
  );
}
