"use client";

import type { MembershipDraft } from "@/app/membership/actions";
import { BirthDatePicker } from "@/components/birth-date-picker";

export type PackageOption = {
  id: string;
  title: string;
  basePrice: number;
  singleSupplement?: number | null;
  programPdfUrl?: string | null;
};

const ROOM_TYPES = ["Double", "Double Shared", "Single", "Triple", "Triple Shared"] as const;

const inputClass =
  "w-full min-h-[44px] rounded-lg border-[1.5px] border-[var(--color-bone)] bg-[var(--color-travertine)] px-4 py-3 text-[15px] leading-normal text-[var(--color-obsidian)] placeholder-[#B5A890] transition-colors hover:border-[#C0B098] focus:border-[var(--color-obsidian)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-obsidian)]/8";
/** Tighter fields when embedded in sidebar (still ≥44px touch height) */
const inputClassCompact =
  "w-full min-h-11 rounded-lg border-[1.5px] border-[var(--color-bone)] bg-white px-3 py-2.5 text-[14px] leading-normal text-[var(--color-obsidian)] placeholder-[#B5A890] transition-colors hover:border-[#C0B098] focus:border-[var(--color-obsidian)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-obsidian)]/8";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-terracotta)]";
/** Section stack inside trip sidebar — no nested card (parent already provides surface) */
const compactSectionClass =
  "space-y-3 border-t border-[var(--color-bone)] pt-4 first:border-t-0 first:pt-0";
const compactHeadingClass =
  "mb-3 font-[var(--font-display)] text-[17px] font-medium leading-snug text-[var(--color-obsidian)]";

type MembershipFormProps = {
  data: MembershipDraft;
  onChange: (data: MembershipDraft) => void;
  packages: PackageOption[];
  errors?: Partial<Record<keyof MembershipDraft, string>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  compact?: boolean;
};

export function MembershipForm({
  data,
  onChange,
  packages,
  errors = {},
  onSubmit,
  isSubmitting,
  compact = false,
}: MembershipFormProps) {
  const set = (key: keyof MembershipDraft, value: string | number | boolean) => {
    onChange({ ...data, [key]: value });
  };
  /** Merge fields and recompute total from the merged snapshot (avoids stale `data` in totals). */
  const patch = (updates: Partial<MembershipDraft>) => {
    const next = { ...data, ...updates };
    const sum =
      next.baseQuota +
      next.supplementsVarious +
      next.mandatoryMedicalBaggageInsuranceAmount +
      next.travelCancellationInsuranceAmount +
      next.registrationFee;
    onChange({ ...next, totalQuota: sum });
  };

  const total =
    data.baseQuota +
    data.supplementsVarious +
    data.mandatoryMedicalBaggageInsuranceAmount +
    data.travelCancellationInsuranceAmount +
    data.registrationFee;
  const totalMatches = Math.abs(total - data.totalQuota) < 0.02;
  const activePackage = packages.find((p) => p.title === data.packageName);
  const programPdfUrl = activePackage?.programPdfUrl ?? null;
  const fieldInput = compact ? inputClassCompact : inputClass;
  const tableMoneyInput = compact
    ? "w-[4.5rem] max-w-full rounded border border-[var(--color-bone)] bg-white px-1.5 py-1 text-right text-xs text-[var(--color-obsidian)] focus:border-[var(--color-obsidian)] focus:outline-none"
    : "w-24 rounded border border-[var(--color-bone)] bg-[var(--color-travertine)] px-2 py-1.5 text-right text-[var(--color-obsidian)] focus:border-[var(--color-obsidian)] focus:outline-none";
  const tableBaseQuotaInput = compact
    ? "w-[4.5rem] max-w-full rounded border border-[var(--color-bone)] bg-parchment/50 px-1.5 py-1 text-right text-xs text-[var(--color-obsidian)]"
    : "w-28 rounded border border-[var(--color-bone)] bg-[var(--color-travertine)] px-2 py-1.5 text-right text-[var(--color-obsidian)] focus:border-[var(--color-obsidian)] focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div
        className={
          compact
            ? "flex flex-col gap-0"
            : "flex flex-col gap-6 sm:gap-8"
        }
      >
        {/* 1. Personal details */}
        <section
          className={
            compact
              ? compactSectionClass
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-4 sm:p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2
            className={
              compact
                ? compactHeadingClass
                : "mb-4 font-[var(--font-display)] text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium leading-snug text-[var(--color-obsidian)] sm:mb-5"
            }
          >
            Personal Information
          </h2>
          <div className={compact ? "flex flex-col gap-3" : "flex flex-col gap-4 sm:gap-5"}>
            {/* First name, then last name — stacked (last name under first name) */}
            <div className={compact ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
              <div className="w-full">
                <label htmlFor="membership-firstName" className={labelClass}>
                  First Name
                </label>
                <input
                  id="membership-firstName"
                  type="text"
                  value={data.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                  autoComplete="given-name"
                  className={fieldInput}
                  placeholder="Maria"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="membership-lastName" className={labelClass}>
                  Last Name
                </label>
                <input
                  id="membership-lastName"
                  type="text"
                  value={data.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  required
                  autoComplete="family-name"
                  className={fieldInput}
                  placeholder="Rossi"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full max-w-full sm:max-w-xs">
              <label htmlFor="membership-dateOfBirth" className={labelClass}>
                Date of Birth (dob)
              </label>
              <BirthDatePicker
                id="membership-dateOfBirth"
                value={data.dateOfBirth}
                onChange={(iso) => set("dateOfBirth", iso)}
                required
                triggerClassName={`${fieldInput}${errors.dateOfBirth ? " border-[var(--color-error)] ring-[3px] ring-[var(--color-error)]/15" : ""}`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="membership-address" className={labelClass}>
                Full Address
              </label>
              <input
                id="membership-address"
                type="text"
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
                required
                autoComplete="street-address"
                className={fieldInput}
                placeholder="Street, city, postal code, country"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.address}
                </p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="membership-taxCode" className={labelClass}>
                Tax Code
              </label>
              <input
                id="membership-taxCode"
                type="text"
                value={data.taxCode}
                onChange={(e) => set("taxCode", e.target.value)}
                required
                autoComplete="off"
                className={fieldInput}
                placeholder="e.g. RSSMRA80A41H501X"
              />
              {errors.taxCode && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.taxCode}
                </p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="membership-email" className={labelClass}>
                Email
              </label>
              <input
                id="membership-email"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                required
                autoComplete="email"
                className={fieldInput}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="w-full max-w-full sm:max-w-md">
              <label htmlFor="membership-telephone" className={labelClass}>
                Telephone
              </label>
              <input
                id="membership-telephone"
                type="tel"
                value={data.telephone}
                onChange={(e) => set("telephone", e.target.value)}
                required
                autoComplete="tel"
                className={fieldInput}
                placeholder="+39 123 456 7890"
              />
              {errors.telephone && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.telephone}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Travel details */}
        <section
          className={
            compact
              ? compactSectionClass
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-4 sm:p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2 className={compact ? compactHeadingClass : "mb-5 font-[var(--font-display)] text-[22px] font-medium text-[var(--color-obsidian)]"}>
            Travel Details
          </h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-full min-w-0">
              <label htmlFor="membership-packageName" className={labelClass}>
                Travel Package Name For (Travel Program Attached)
              </label>
              {compact ? (
                <input
                  id="membership-packageName"
                  type="text"
                  readOnly
                  value={data.packageName}
                  required
                  className={`${fieldInput} cursor-default bg-parchment/50`}
                />
              ) : (
                <select
                  id="membership-packageName"
                  value={data.packageName}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p.title === e.target.value);
                    if (pkg) {
                      const addSingle =
                        data.roomType === "Single" ? Number(pkg.singleSupplement ?? 0) : 0;
                      patch({
                        packageName: pkg.title,
                        tourId: pkg.id,
                        baseQuota: pkg.basePrice,
                        supplementsVarious: addSingle,
                      });
                    } else {
                      set("packageName", e.target.value);
                    }
                  }}
                  required
                  className={fieldInput}
                >
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} — €{p.basePrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              )}
              {errors.packageName && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.packageName}
                </p>
              )}
            </div>
            <div className="w-full min-w-0">
              <label htmlFor="membership-roomType" className={labelClass}>
                Room Type (Select One)
              </label>
              <select
                id="membership-roomType"
                value={data.roomType}
                onChange={(e) => {
                  const room = e.target.value;
                  const pkg = packages.find((p) => p.title === data.packageName);
                  const addSingle = pkg && room === "Single" ? Number(pkg.singleSupplement ?? 0) : 0;
                  patch({
                    roomType: room,
                    supplementsVarious: addSingle,
                  });
                }}
                required
                className={fieldInput}
              >
                <option value="">Select room type</option>
                {ROOM_TYPES.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              {errors.roomType && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.roomType}
                </p>
              )}
              <p className="mt-2 text-xs leading-relaxed text-[#7A7060]">
                Note: The program may undergo changes for logistical/operational reasons without canceling excursions or visits.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Price breakdown */}
        <section
          className={
            compact
              ? compactSectionClass
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-4 sm:p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2
            className={
              compact
                ? compactHeadingClass
                : "mb-4 font-[var(--font-display)] text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium leading-snug text-[var(--color-obsidian)] sm:mb-5"
            }
          >
            Cost Breakdown
          </h2>
          <div
            className={
              compact
                ? "overflow-x-auto text-[11px] leading-snug sm:text-xs"
                : "-mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0"
            }
          >
            <table className="w-full min-w-0 table-fixed text-left text-xs sm:text-sm">
              <tbody>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="w-[55%] py-2 pr-2 align-top text-[#7A7060] break-words sm:py-3 sm:pr-4">
                    Base Quota
                  </td>
                  <td className="py-2 text-right align-top font-medium text-[var(--color-obsidian)] sm:py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      readOnly
                      value={data.baseQuota ?? ""}
                      className={tableBaseQuotaInput}
                    />
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-2 pr-2 align-top text-[#7A7060] break-words sm:py-3 sm:pr-4">
                    SUPPLEMENTS &amp; VARIOUS (Single, Triple reduction, Discounts)
                  </td>
                  <td className="py-2 text-right align-top sm:py-3">
                    <input
                      type="number"
                      min="-999999"
                      step="any"
                      placeholder="0"
                      value={moneyInputValue(data.supplementsVarious)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const v = raw === "" ? 0 : Number(raw);
                        if (Number.isNaN(v)) return;
                        patch({ supplementsVarious: v });
                      }}
                      className={tableMoneyInput}
                    />
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-2 pr-2 align-top text-[#7A7060] break-words sm:py-3 sm:pr-4">
                    MANDATORY MEDICAL / BAGGAGE INSURANCE
                  </td>
                  <td className="py-2 text-right align-top sm:py-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={moneyInputValue(data.mandatoryMedicalBaggageInsuranceAmount)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const v = raw === "" ? 0 : Number(raw);
                        if (Number.isNaN(v)) return;
                        patch({ mandatoryMedicalBaggageInsuranceAmount: v });
                      }}
                      className={tableMoneyInput}
                    />
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-2 pr-2 align-top text-[#7A7060] break-words sm:py-3 sm:pr-4">
                    TRAVEL CANCELLATION INSURANCE
                  </td>
                  <td className="py-2 text-right align-top sm:py-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={moneyInputValue(data.travelCancellationInsuranceAmount)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const v = raw === "" ? 0 : Number(raw);
                        if (Number.isNaN(v)) return;
                        patch({ travelCancellationInsuranceAmount: v });
                      }}
                      className={tableMoneyInput}
                    />
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-2 pr-2 align-top text-[#7A7060] sm:py-3 sm:pr-4">REGISTRATION FEE</td>
                  <td className="py-2 text-right align-top sm:py-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={moneyInputValue(data.registrationFee)}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const v = raw === "" ? 0 : Number(raw);
                        if (Number.isNaN(v)) return;
                        patch({ registrationFee: v });
                      }}
                      className={tableMoneyInput}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 align-top font-medium text-[var(--color-obsidian)] break-words sm:py-3 sm:pr-4">
                    TOTAL QUOTA per person including taxes and supplements (€):
                  </td>
                  <td
                    className={`py-2 text-right align-top font-[var(--font-display)] font-medium text-[var(--color-obsidian)] sm:py-3 ${compact ? "text-sm" : "text-base sm:text-lg"}`}
                  >
                    €{(totalMatches ? total : data.totalQuota).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {!totalMatches && (
            <p className="mt-2 text-xs text-[#7A7060]">
              Total updated from breakdown: €{total.toFixed(2)}
            </p>
          )}
        </section>

        {/* 4. Legal */}
        <section
          className={
            compact
              ? compactSectionClass
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-4 sm:p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2
            className={
              compact
                ? compactHeadingClass
                : "mb-4 font-[var(--font-display)] text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium leading-snug text-[var(--color-obsidian)] sm:mb-5"
            }
          >
            Declaration and Data Consent
          </h2>
          <div className={compact ? "space-y-3" : "space-y-4"}>
            <label className="flex cursor-pointer items-start gap-3 sm:gap-4">
              <input
                type="checkbox"
                checked={data.declarationAccepted}
                onChange={(e) => set("declarationAccepted", e.target.checked)}
                required
                className="mt-1 size-[1.125rem] shrink-0 rounded border-[var(--color-bone)] text-[var(--color-obsidian)] focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2"
              />
              <span
                className={`min-w-0 flex-1 leading-relaxed text-[var(--color-obsidian)] ${compact ? "text-xs" : "text-sm"}`}
              >
                I declare that I have read and accepted the{" "}
                {programPdfUrl ? (
                  <a
                    href={programPdfUrl}
                    className="font-medium text-[var(--color-azure)] underline hover:text-[var(--color-adriatic)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    travel program
                  </a>
                ) : (
                  <span>travel program</span>
                )}{" "}
                of T.O. Travel Land srl and any cancellation penalties based on the{" "}
                <a
                  href="/who-we-are"
                  className="font-medium text-[var(--color-azure)] underline hover:text-[var(--color-adriatic)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &quot;General conditions of the travel package sales contract&quot;
                </a>
                .
              </span>
            </label>
            {errors.declarationAccepted && (
              <p className="text-xs text-[var(--color-error)]" role="alert">
                {errors.declarationAccepted}
              </p>
            )}
            <label className="flex cursor-pointer items-start gap-3 sm:gap-4">
              <input
                type="checkbox"
                checked={data.dataProcessingAccepted}
                onChange={(e) => set("dataProcessingAccepted", e.target.checked)}
                required
                className="mt-1 size-[1.125rem] shrink-0 rounded border-[var(--color-bone)] text-[var(--color-obsidian)] focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2"
              />
              <span
                className={`min-w-0 flex-1 leading-relaxed text-[var(--color-obsidian)] ${compact ? "text-xs" : "text-sm"}`}
              >
                I authorize the processing of my personal data (in accordance with Regulation (EU) 679/2016).
              </span>
            </label>
            {errors.dataProcessingAccepted && (
              <p className="text-xs text-[var(--color-error)]" role="alert">
                {errors.dataProcessingAccepted}
              </p>
            )}
          </div>
        </section>

        {/* 5. Submit */}
        <div
          className={
            compact
              ? "flex flex-col gap-3 border-t border-[var(--color-bone)] pt-4 sm:flex-row sm:flex-wrap"
              : "flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          }
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-obsidian)] px-6 py-3 text-sm font-medium tracking-wide text-[#F0EAE0] shadow-[var(--shadow-md)] transition-[opacity,transform] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-oro)] focus-visible:outline-offset-[3px] disabled:opacity-70 active:scale-[0.98] sm:w-auto"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

/** Empty string when amount is 0 so the field can be cleared and re-typed (controlled `value={0}` blocks editing). */
function moneyInputValue(n: number): string | number {
  if (n === 0) return "";
  return n;
}
