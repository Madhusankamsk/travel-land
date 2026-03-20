"use client";

import type { MembershipDraft } from "@/app/membership/actions";

export type PackageOption = {
  id: string;
  title: string;
  basePrice: number;
  singleSupplement?: number | null;
};

const ROOM_TYPES = ["Single", "Double", "Triple"] as const;

const inputClass =
  "w-full rounded-lg border border-[var(--color-bone)] bg-[var(--color-travertine)] px-4 py-3 text-[15px] text-[var(--color-obsidian)] placeholder-[#B5A890] focus:border-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)]/10";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-terracotta)]";

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

  const total =
    data.baseRate + data.insuranceAmount + data.registrationFees;
  const totalMatches = Math.abs(total - data.total) < 0.02;

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div
        className={
          compact
            ? "flex flex-col gap-8 rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)]"
            : "flex flex-col gap-8"
        }
      >
        {/* 1. Personal details */}
        <section
          className={
            compact
              ? "space-y-5"
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2 className="mb-5 font-[var(--font-display)] text-[22px] font-medium text-[var(--color-obsidian)]">
            Personal details
          </h2>
          <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
            <div className="sm:col-span-2">
              <label htmlFor="membership-fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="membership-fullName"
                type="text"
                value={data.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Maria Rossi"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="membership-dateOfBirth" className={labelClass}>
                Date of birth
              </label>
              <input
                id="membership-dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                required
                className={inputClass}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
            <div />
            <div className="sm:col-span-2">
              <label htmlFor="membership-address" className={labelClass}>
                Address
              </label>
              <textarea
                id="membership-address"
                value={data.address}
                onChange={(e) => set("address", e.target.value)}
                required
                rows={2}
                className={inputClass}
                placeholder="Street, city, postal code, country"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.address}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="membership-taxCode" className={labelClass}>
                Tax code
              </label>
              <input
                id="membership-taxCode"
                type="text"
                value={data.taxCode}
                onChange={(e) => set("taxCode", e.target.value)}
                required
                autoComplete="off"
                className={inputClass}
                placeholder="e.g. RSSMRA80A41H501X"
              />
              {errors.taxCode && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.taxCode}
                </p>
              )}
            </div>
            <div>
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
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="membership-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="membership-phone"
                type="tel"
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
                autoComplete="tel"
                className={inputClass}
                placeholder="+39 123 456 7890"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Trip details */}
        <section
          className={
            compact
              ? "space-y-5"
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2 className="mb-5 font-[var(--font-display)] text-[22px] font-medium text-[var(--color-obsidian)]">
            Trip details
          </h2>
          <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
            <div className="sm:col-span-2">
              <label htmlFor="membership-packageName" className={labelClass}>
                Package
              </label>
              <select
                id="membership-packageName"
                value={data.packageName}
                onChange={(e) => {
                  const pkg = packages.find((p) => p.title === e.target.value);
                  if (pkg) {
                    const addSingle =
                      data.roomType === "Single"
                        ? Number(pkg.singleSupplement ?? 0)
                        : 0;
                    const newBase = pkg.basePrice + addSingle;
                    set("packageName", pkg.title);
                    set("tourId", pkg.id);
                    set("baseRate", newBase);
                    set("total", newBase + data.insuranceAmount + data.registrationFees);
                  } else {
                    set("packageName", e.target.value);
                  }
                }}
                required
                className={inputClass}
              >
                <option value="">Select a package</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title} — €{p.basePrice.toLocaleString()}
                  </option>
                ))}
              </select>
              {errors.packageName && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.packageName}
                </p>
              )}
            </div>
            <div>
              <span className={labelClass}>Room type</span>
              <div className="mt-2 flex flex-wrap gap-4">
                {ROOM_TYPES.map((room) => (
                  <label key={room} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="roomType"
                      value={room}
                      checked={data.roomType === room}
                      onChange={() => {
                        set("roomType", room);
                        const pkg = packages.find((p) => p.title === data.packageName);
                        if (pkg && room === "Single" && pkg.singleSupplement != null) {
                          const add = Number(pkg.singleSupplement);
                          set("baseRate", pkg.basePrice + add);
                          set("total", pkg.basePrice + add + data.insuranceAmount + data.registrationFees);
                        } else if (pkg) {
                          set("baseRate", pkg.basePrice);
                          set("total", pkg.basePrice + data.insuranceAmount + data.registrationFees);
                        }
                      }}
                      className="rounded-full border-[var(--color-bone)] text-[var(--color-obsidian)] focus:ring-[var(--color-oro)]"
                    />
                    <span className="text-sm text-[var(--color-obsidian)]">{room}</span>
                  </label>
                ))}
              </div>
              {errors.roomType && (
                <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
                  {errors.roomType}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 3. Price breakdown */}
        <section
          className={
            compact
              ? "space-y-5"
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2 className="mb-5 font-[var(--font-display)] text-[22px] font-medium text-[var(--color-obsidian)]">
            Price breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <tbody>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-3 text-[#7A7060]">Base rate</td>
                  <td className="py-3 text-right font-medium text-[var(--color-obsidian)]">
                    €{data.baseRate.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-3 text-[#7A7060]">Insurance</td>
                  <td className="py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.insuranceAmount || ""}
                      onChange={(e) => {
                        const v = parseNum(e.target.value);
                        set("insuranceAmount", v);
                        set("total", data.baseRate + v + data.registrationFees);
                      }}
                      className="w-24 rounded border border-[var(--color-bone)] bg-[var(--color-travertine)] px-2 py-1.5 text-right text-[var(--color-obsidian)] focus:border-[var(--color-obsidian)] focus:outline-none"
                    />
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-bone)]">
                  <td className="py-3 text-[#7A7060]">Registration fees</td>
                  <td className="py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.registrationFees || ""}
                      onChange={(e) => {
                        const v = parseNum(e.target.value);
                        set("registrationFees", v);
                        set("total", data.baseRate + data.insuranceAmount + v);
                      }}
                      className="w-24 rounded border border-[var(--color-bone)] bg-[var(--color-travertine)] px-2 py-1.5 text-right text-[var(--color-obsidian)] focus:border-[var(--color-obsidian)] focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[var(--color-obsidian)]">Total</td>
                  <td className="py-3 text-right font-[var(--font-display)] text-lg font-medium text-[var(--color-obsidian)]">
                    €{(totalMatches ? total : data.total).toFixed(2)}
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
              ? "space-y-5"
              : "rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)]"
          }
        >
          <h2 className="mb-5 font-[var(--font-display)] text-[22px] font-medium text-[var(--color-obsidian)]">
            Legal
          </h2>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.gdprAccepted}
                onChange={(e) => set("gdprAccepted", e.target.checked)}
                required
                className="mt-1 rounded border-[var(--color-bone)] text-[var(--color-obsidian)] focus:ring-[var(--color-oro)]"
              />
              <span className="text-sm text-[var(--color-obsidian)]">
                I have read and accept the{" "}
                <a
                  href="/who-we-are"
                  className="font-medium text-[var(--color-azure)] underline hover:text-[var(--color-adriatic)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy (GDPR)
                </a>
                .
              </span>
            </label>
            {errors.gdprAccepted && (
              <p className="text-xs text-[var(--color-error)]" role="alert">
                {errors.gdprAccepted}
              </p>
            )}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.cancellationAccepted}
                onChange={(e) => set("cancellationAccepted", e.target.checked)}
                required
                className="mt-1 rounded border-[var(--color-bone)] text-[var(--color-obsidian)] focus:ring-[var(--color-oro)]"
              />
              <span className="text-sm text-[var(--color-obsidian)]">
                I have read and accept the cancellation policy applicable to this package.
              </span>
            </label>
            {errors.cancellationAccepted && (
              <p className="text-xs text-[var(--color-error)]" role="alert">
                {errors.cancellationAccepted}
              </p>
            )}
          </div>
        </section>

        {/* 5. Submit */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-obsidian)] px-6 py-3 text-sm font-medium tracking-wide text-[#F0EAE0] shadow-[var(--shadow-md)] transition-[opacity,transform] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 disabled:opacity-70 active:scale-[0.98]"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

function parseNum(v: string): number {
  const n = parseFloat(v.replace(/,/g, "."));
  return Number.isNaN(n) ? 0 : n;
}
