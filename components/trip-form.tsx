"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { toast } from "@/lib/toast";

export type TripDay = { dayHeading: string; description: string };

type TripFormProps = {
  mode: "create" | "edit";
  tourId?: string;
  initial?: {
    title: string;
    status: string;
    durationLabel: string;
    heroImageUrl: string | null;
    introText: string;
    basePrice: string;
    singleSupplement: string | null;
    mandatoryInsurance: string | null;
    optionalInsurance: string | null;
    depositLabel: string | null;
    balanceDeadline: string | null;
    included: string;
    excluded: string;
    cancellationPolicy: string | null;
    programPdfUrl: string | null;
    contactStaff: string | null;
    days: TripDay[];
  };
  createAction: (formData: FormData) => Promise<{ error?: string } | void>;
  updateAction: (tourId: string, formData: FormData) => Promise<{ error?: string } | void>;
};

const STAFF_OPTIONS = ["Eleonora", "Sisira", "Romeo"];

export function TripForm({
  mode,
  tourId,
  initial,
  createAction,
  updateAction,
}: TripFormProps) {
  const [days, setDays] = useState<TripDay[]>(
    initial?.days?.length ? [...initial.days] : [{ dayHeading: "", description: "" }]
  );
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (mode === "create") return createAction(formData);
      if (tourId) return updateAction(tourId, formData);
      return { error: "Missing tour id." };
    },
    null as { error?: string; success?: boolean } | null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else if ("success" in state && state.success) toast.success("Trip saved.");
  }, [state]);

  function addDay() {
    setDays((d) => [...d, { dayHeading: "", description: "" }]);
  }

  function removeDay(i: number) {
    setDays((d) => d.filter((_, idx) => idx !== i));
  }

  function updateDay(i: number, field: keyof TripDay, value: string) {
    setDays((d) => {
      const next = [...d];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-10"
    >
      <input type="hidden" name="days" value={JSON.stringify(days)} />

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      {/* 1. Basic Information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Basic information</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Tour title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initial?.title}
              placeholder="e.g. GIORDANIA 2026"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Status</label>
            <select
              name="status"
              defaultValue={initial?.status ?? "UPCOMING"}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="UPCOMING">Prossimi Viaggi (Upcoming)</option>
              <option value="ARCHIVED">Storico Viaggi (Past / Archive)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Duration / date label</label>
            <input
              name="durationLabel"
              type="text"
              required
              defaultValue={initial?.durationLabel}
              placeholder='e.g. "dal 23 al 30 aprile 2026"'
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Hero image</label>
            <input
              name="heroImage"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            {initial?.heroImageUrl && (
              <p className="mt-1 text-xs text-zinc-500">Current: {initial.heroImageUrl}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Introductory text</label>
            <textarea
              name="introText"
              rows={4}
              defaultValue={initial?.introText}
              placeholder="Summary paragraph describing the destination..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 2. Daily itinerary */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Daily itinerary</h2>
        <p className="mb-4 text-sm text-zinc-600">
          Add one block per day. Use the description field for activities; you can use HTML (e.g. &lt;strong&gt;, &lt;ul&gt;, &lt;a href="..."&gt;) for bold and links.
        </p>
        {days.map((day, i) => (
          <div
            key={i}
            className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-600">Day {i + 1}</span>
              <button
                type="button"
                onClick={() => removeDay(i)}
                disabled={days.length <= 1}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3">
              <input
                type="text"
                value={day.dayHeading}
                onChange={(e) => updateDay(i, "dayHeading", e.target.value)}
                placeholder="e.g. 23 APRILE: Amman - Jerash"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <textarea
                value={day.description}
                onChange={(e) => updateDay(i, "description", e.target.value)}
                rows={5}
                placeholder="Activities, bold keywords, links (HTML allowed)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addDay}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Add day
        </button>
      </section>

      {/* 3. Pricing */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Pricing & financials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Base price (€ per person)</label>
            <input
              name="basePrice"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={initial?.basePrice}
              placeholder="2480"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Single supplement (Sup. singola)</label>
            <input
              name="singleSupplement"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initial?.singleSupplement ?? ""}
              placeholder="e.g. 350"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Mandatory insurance</label>
            <input
              name="mandatoryInsurance"
              type="text"
              defaultValue={initial?.mandatoryInsurance ?? ""}
              placeholder="e.g. Polizza medica obbligatoria"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Optional insurance</label>
            <input
              name="optionalInsurance"
              type="text"
              defaultValue={initial?.optionalInsurance ?? ""}
              placeholder="e.g. Polizza annullamento facoltativa"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Deposit (Acconto)</label>
              <input
                name="depositLabel"
                type="text"
                defaultValue={initial?.depositLabel ?? ""}
                placeholder="e.g. 30% at booking"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Balance deadline (Saldo entro)</label>
              <input
                name="balanceDeadline"
                type="text"
                defaultValue={initial?.balanceDeadline ?? ""}
                placeholder="e.g. 60 days before departure"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Inclusions / exclusions */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Logistics</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">La quota comprende (what’s included)</label>
            <textarea
              name="included"
              rows={6}
              defaultValue={initial?.included}
              placeholder="One item per line or use bullet points"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">La quota non comprende (what’s not included)</label>
            <textarea
              name="excluded"
              rows={6}
              defaultValue={initial?.excluded}
              placeholder="One item per line"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 5. Policies & docs */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Policies & documentation</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Cancellation policy (Penalità)</label>
            <textarea
              name="cancellationPolicy"
              rows={4}
              defaultValue={initial?.cancellationPolicy ?? ""}
              placeholder="e.g. 90 days before = 35% penalty..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">PDF program (SCARICA E STAMPA IL PROGRAMMA)</label>
            <input
              name="programPdf"
              type="file"
              accept=".pdf,application/pdf"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            {initial?.programPdfUrl && (
              <p className="mt-1 text-xs text-zinc-500">Current: {initial.programPdfUrl}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Contact staff (WhatsApp / contact for this tour)</label>
            <div className="flex flex-wrap gap-4">
              {STAFF_OPTIONS.map((name) => (
                <label key={name} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name={`contact_${name}`}
                    defaultChecked={initial?.contactStaff?.includes(name)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="text-sm text-zinc-700">{name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-70"
        >
          {isPending ? "Saving…" : mode === "create" ? "Create trip" : "Save changes"}
        </button>
        <a
          href="/dashboard/trips"
          className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
