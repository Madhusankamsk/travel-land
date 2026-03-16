"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipForm } from "@/components/membership-form";
import { AuthModal } from "@/components/auth-modal";
import {
  submitMembershipBookingAction,
  type MembershipDraft,
  type SubmitResult,
} from "@/app/membership/actions";
import type { PackageOption } from "@/components/membership-form";

const DRAFT_KEY = "travel_land_membership_draft";

function getDefaultDraft(profile?: { fullName: string; email: string }): MembershipDraft {
  return {
    fullName: profile?.fullName ?? "",
    dateOfBirth: "",
    address: "",
    taxCode: "",
    email: profile?.email ?? "",
    phone: "",
    packageName: "",
    tourId: undefined,
    roomType: "",
    baseRate: 0,
    insuranceAmount: 0,
    registrationFees: 0,
    total: 0,
    gdprAccepted: false,
    cancellationAccepted: false,
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
      fullName: parsed.fullName ?? def.fullName,
      dateOfBirth: parsed.dateOfBirth ?? def.dateOfBirth,
      address: parsed.address ?? def.address,
      taxCode: parsed.taxCode ?? def.taxCode,
      email: parsed.email ?? def.email,
      phone: parsed.phone ?? def.phone,
      packageName: parsed.packageName ?? def.packageName,
      tourId: parsed.tourId ?? def.tourId,
      roomType: parsed.roomType ?? def.roomType,
      baseRate: typeof parsed.baseRate === "number" ? parsed.baseRate : def.baseRate,
      insuranceAmount: typeof parsed.insuranceAmount === "number" ? parsed.insuranceAmount : def.insuranceAmount,
      registrationFees: typeof parsed.registrationFees === "number" ? parsed.registrationFees : def.registrationFees,
      total: typeof parsed.total === "number" ? parsed.total : def.total,
      gdprAccepted: Boolean(parsed.gdprAccepted),
      cancellationAccepted: Boolean(parsed.cancellationAccepted),
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
  userProfile: { fullName: string; email: string } | null;
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const mounted = useRef(false);

  const persistDraft = useCallback((d: MembershipDraft) => {
    setData(d);
    saveDraft(d);
  }, []);

  useEffect(() => {
    if (!mounted.current && packages.length >= 0) {
      mounted.current = true;
      const saved = loadDraft();
      const base = saved
        ? { ...getDefaultDraft(userProfile ?? undefined), ...saved }
        : getDefaultDraft(userProfile ?? undefined);
      if (userProfile && !saved) {
        base.fullName = userProfile.fullName || base.fullName;
        base.email = userProfile.email || base.email;
      }
      if (tourIdParam && packages.length > 0) {
        const pkg = packages.find((p) => p.id === tourIdParam);
        if (pkg) {
          base.packageName = pkg.title;
          base.tourId = pkg.id;
          base.baseRate = pkg.basePrice;
          base.total = pkg.basePrice + (base.insuranceAmount || 0) + (base.registrationFees || 0);
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
        saveDraft(data);
        setAuthModalOpen(true);
        return;
      }

      setIsSubmitting(true);
      const result: SubmitResult = await submitMembershipBookingAction(null, data);
      setIsSubmitting(false);

      if (result.error) {
        if (result.error === "Please sign in to continue.") {
          saveDraft(data);
          setAuthModalOpen(true);
          return;
        }
        setErrors({ fullName: result.error });
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
        setAuthModalOpen(true);
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
        {errorParam && (
          <div
            className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errorParam === "auth_failed" && "Sign-in failed. Please try again."}
            {errorParam === "no_email" && "No email from sign-in. Please use another method."}
            {errorParam === "callback_config" && "Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env, then restart the dev server (npm run dev)."}
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
          isSubmitting={isSubmitting}
        />
      </div>
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultEmail={data.email}
      />
    </div>
  );
}
