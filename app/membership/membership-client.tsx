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
import {
  loadStoredMembershipDraft,
  MEMBERSHIP_DRAFT_STORAGE_KEY,
  saveStoredMembershipDraft,
} from "@/lib/membership-draft-storage";
import { MAGIC_LINK_MEMBERSHIP_NEXT } from "@/lib/membership-magic";
import { useAuthModal } from "@/components/auth-modal-provider";
import { emailHasAccount } from "@/lib/email-account-check";

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

type MembershipPageClientProps = {
  packages: PackageOption[];
  isAuthenticated: boolean;
  userProfile: { firstName: string; lastName: string; email: string } | null;
  errorParam: string | null;
  tourIdParam: string | null;
};

export function MembershipPageClient({
  packages,
  isAuthenticated,
  userProfile,
  errorParam,
  tourIdParam,
}: MembershipPageClientProps) {
  const router = useRouter();
  const { openLogin, openSignup } = useAuthModal();
  const [data, setData] = useState<MembershipDraft>(() =>
    getDefaultDraft(userProfile ?? undefined)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof MembershipDraft, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const mounted = useRef(false);

  const persistDraft = useCallback((d: MembershipDraft) => {
    setData(d);
    saveStoredMembershipDraft(d);
  }, []);

  useEffect(() => {
    if (!mounted.current && packages.length >= 0) {
      mounted.current = true;
      const saved = loadStoredMembershipDraft();
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
    const t = setTimeout(() => saveStoredMembershipDraft(data), 500);
    return () => clearTimeout(t);
  }, [data]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      if (!isAuthenticated) {
        setIsSubmitting(true);
        try {
          saveStoredMembershipDraft(data);
          const trimmed = data.email.trim();
          if (!trimmed) {
            setSignInError("Please enter a valid email on the form before submitting.");
            return;
          }
          const exists = await emailHasAccount(trimmed);
          if (exists) {
            openLogin({ from: MAGIC_LINK_MEMBERSHIP_NEXT, email: trimmed });
          } else {
            openSignup({ from: MAGIC_LINK_MEMBERSHIP_NEXT, email: trimmed });
          }
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      setSignInError(null);

      setIsSubmitting(true);
      const result: SubmitResult = await submitMembershipBookingAction(null, data);
      setIsSubmitting(false);

      if (result.error) {
        if (result.error === "Please sign in to continue.") {
          saveStoredMembershipDraft(data);
          setSignInError("Please sign in with Google or email and password, then submit again.");
          return;
        }
        setErrors({ firstName: result.error });
        return;
      }
      try {
        localStorage.removeItem(MEMBERSHIP_DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push(`/membership/success?ref=${encodeURIComponent(result.reference ?? "")}`);
    },
    [data, isAuthenticated, openLogin, openSignup, router]
  );

  return (
    <div className="min-h-screen bg-[var(--color-travertine)] py-10">
      <div className="mx-auto max-w-[720px] px-4">
        {signInError && !isAuthenticated && (
          <div
            className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {signInError}
          </div>
        )}
        {errorParam && (
          <div
            className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
            role="alert"
          >
            {errorParam === "auth_failed" && "Sign-in failed. Please try again."}
            {errorParam === "no_email" && "No email from sign-in. Please use another method."}
            {errorParam === "callback_config" && "Sign-in is not fully configured. Contact support or try again later."}
            {!["auth_failed", "no_email", "callback_config"].includes(errorParam) && "Something went wrong."}
          </div>
        )}
        <header className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-obsidian)] md:text-4xl">
            Travel membership form
          </h1>
          <p className="mt-2 text-[#7A7060]">
            Complete the form below. To submit, sign in with Google or email and password — your answers stay saved in this browser.
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
    </div>
  );
}
