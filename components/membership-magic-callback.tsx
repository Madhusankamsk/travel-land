"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitMembershipBookingAction } from "@/app/membership/actions";
import {
  loadStoredMembershipDraft,
  MEMBERSHIP_DRAFT_STORAGE_KEY,
} from "@/lib/membership-draft-storage";
import {
  PROFILE_MEMBERSHIP_CALLBACK_PARAM,
  PROFILE_MEMBERSHIP_CALLBACK_VALUE,
} from "@/lib/membership-magic";

export function MembershipMagicCallbackBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);
  const [banner, setBanner] = useState<{
    kind: "loading" | "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get(PROFILE_MEMBERSHIP_CALLBACK_PARAM) !== PROFILE_MEMBERSHIP_CALLBACK_VALUE) {
      return;
    }
    if (ran.current) return;

    const draft = loadStoredMembershipDraft();
    if (!draft) {
      ran.current = true;
      router.replace("/profile");
      return;
    }

    ran.current = true;
    setBanner({ kind: "loading", text: "Invio della richiesta in corso…" });

    (async () => {
      const result = await submitMembershipBookingAction(null, draft);
      if (result.error) {
        if (result.error === "Please sign in to continue.") {
          setBanner({
            kind: "error",
            text: "Accesso richiesto. Torna al modulo iscrizione e richiedi un nuovo link.",
          });
        } else {
          setBanner({ kind: "error", text: result.error });
        }
        router.replace("/profile");
        return;
      }
      try {
        localStorage.removeItem(MEMBERSHIP_DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      const ref = result.reference?.trim();
      setBanner({
        kind: "success",
        text: ref
          ? `Richiesta inviata. Riferimento: ${ref}`
          : "Richiesta inviata correttamente.",
      });
      router.replace("/profile");
    })();
  }, [searchParams, router]);

  if (!banner) return null;

  const base =
    "mb-8 rounded-xl border px-4 py-3 text-sm leading-relaxed";
  const styles =
    banner.kind === "loading"
      ? `${base} border-[#2E5B8B]/25 bg-[#D8E8F5] text-[#1A4A70]`
      : banner.kind === "success"
        ? `${base} border-emerald-200 bg-emerald-50 text-emerald-900`
        : `${base} border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)]`;

  return (
    <div className={styles} role="status">
      {banner.text}
    </div>
  );
}
