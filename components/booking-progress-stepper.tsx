"use client";

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

function stepIndex(status: BookingStatus): number {
  const i = STEPS.indexOf(status);
  return i >= 0 ? i : 0;
}

export function BookingProgressStepper({ status }: { status: BookingStatus }) {
  const { t } = useI18n();
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
              title={t(stepKeys[i])}
            >
              {done ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  done ? "bg-[#2D6A4F]" : "bg-bone"
                }`}
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
          className={`max-w-[4rem] truncate text-center ${
            i <= current ? "font-medium text-obsidian" : ""
          }`}
        >
          {t(key)}
        </span>
      ))}
    </div>
  );
}
