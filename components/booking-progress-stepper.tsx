"use client";

import { useEffect, useId, useState } from "react";
import type { BookingStatus } from "@prisma/client";
import { useI18n } from "@/components/i18n-provider";

const STEPS: BookingStatus[] = [
  "REQUESTED",
  "CONFIRMED",
  "DEPOSIT_PAID",
  "PAID",
  "COMPLETED",
];

const stepKeys = [
  "profile.step.requested",
  "profile.step.confirmed",
  "profile.step.depositPaid",
  "profile.step.paid",
  "profile.step.completed",
] as const;

const stepDetailKeys = [
  "profile.stepDetail.requested",
  "profile.stepDetail.confirmed",
  "profile.stepDetail.depositPaid",
  "profile.stepDetail.paid",
  "profile.stepDetail.completed",
] as const;

export function stepIndex(status: BookingStatus): number {
  const i = STEPS.indexOf(status);
  return i >= 0 ? i : 0;
}

export function BookingProgressStepper({ status }: { status: BookingStatus }) {
  const current = stepIndex(status);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((_, i) => {
        const done = i < current || (i === current && status === "COMPLETED");
        const active = i === current && status !== "COMPLETED";
        return (
          <div key={i} className="flex flex-1 items-center">
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-semibold ${
                done
                  ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                  : active
                    ? "border-obsidian bg-obsidian text-[#F0EAE0]"
                    : "border-bone bg-white text-[#7A7060]"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${done ? "bg-[#2D6A4F]" : "bg-bone"}`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BookingProgressLabels({ status }: { status: BookingStatus }) {
  const { t } = useI18n();
  const current = stepIndex(status);

  return (
    <div className="mt-2 flex justify-between gap-1 text-[11px] text-[#7A7060]">
      {stepKeys.map((key, i) => (
        <span
          key={key}
          className={`max-w-[4rem] truncate text-center ${i <= current ? "font-medium text-obsidian" : ""}`}
        >
          {t(key)}
        </span>
      ))}
    </div>
  );
}

type BookingProgressInteractiveProps = {
  status: BookingStatus;
  /** Unique id for accessibility (e.g. booking id). */
  instanceId: string;
};

/**
 * Clickable stages with explanatory copy for the selected step (profile).
 */
export function BookingProgressInteractive({ status, instanceId }: BookingProgressInteractiveProps) {
  const { t } = useI18n();
  const reactId = useId();
  const baseId = `booking-progress-${instanceId}-${reactId.replace(/:/g, "")}`;
  const current = stepIndex(status);
  const [detailStep, setDetailStep] = useState(current);

  useEffect(() => {
    setDetailStep(current);
  }, [current, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-0">
        {STEPS.map((_, i) => {
          const done = i < current || (i === current && status === "COMPLETED");
          const active = i === current && status !== "COMPLETED";
          const selected = detailStep === i;
          return (
            <div key={i} className="flex flex-1 items-center">
              <button
                type="button"
                id={`${baseId}-tab-${i}`}
                aria-label={t(stepKeys[i])}
                aria-controls={`${baseId}-panel`}
                aria-expanded={selected}
                onClick={() => setDetailStep(i)}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-semibold transition-[box-shadow,transform] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 ${
                  selected ? "ring-2 ring-[var(--color-oro)] ring-offset-2" : ""
                } ${
                  done
                    ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                    : active
                      ? "border-obsidian bg-obsidian text-[#F0EAE0]"
                      : "border-bone bg-white text-[#7A7060] hover:border-[#7A7060]/50"
                }`}
              >
                <span aria-hidden>{done ? "✓" : i + 1}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${done ? "bg-[#2D6A4F]" : "bg-bone"}`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-1">
        {stepKeys.map((key, i) => {
          const selected = detailStep === i;
          const reached = i <= current;
          return (
            <button
              key={key}
              type="button"
              aria-controls={`${baseId}-panel`}
              aria-expanded={selected}
              onClick={() => setDetailStep(i)}
              className={`max-w-[4.5rem] rounded-sm px-0.5 py-1 text-[11px] leading-tight transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-1 ${
                selected
                  ? "font-semibold text-[var(--color-obsidian)] underline decoration-[var(--color-oro)] decoration-2 underline-offset-2"
                  : reached
                    ? "font-medium text-obsidian hover:text-[var(--color-obsidian)]"
                    : "text-[#7A7060] hover:text-[#5C5346]"
              }`}
            >
              {t(key)}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="region"
        aria-labelledby={`${baseId}-tab-${detailStep}`}
        className="rounded-xl border border-[var(--color-bone)] bg-[var(--color-parchment)]/50 px-4 py-3 sm:px-5 sm:py-4"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-terracotta)]">
          {t(stepKeys[detailStep])}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#5C5346]">
          {t(stepDetailKeys[detailStep])}
        </p>
        {detailStep > current && (
          <p className="mt-3 border-t border-[var(--color-bone)] pt-3 text-[12px] italic text-[#7A7060]">
            {t("profile.stepDetail.upcoming")}
          </p>
        )}
      </div>
    </div>
  );
}
