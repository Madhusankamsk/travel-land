"use client";

import Image from "next/image";
import { useActionState, useState, useRef, useEffect } from "react";
import { toast } from "@/lib/toast";
import type { CancellationPenalties } from "@/lib/cancellation-penalties";
import { mergeCancellationPenalties } from "@/lib/cancellation-penalties";
import { CancellationPenaltiesEditor } from "@/components/cancellation-penalties-editor";

export type TripDay = {
  dayHeading: string;
  dateLabel: string;
  description: string;
  /** Saved image URLs for this day (edit mode); round-tripped via hidden fields */
  imageUrls?: string[];
};

type TripFormProps = {
  mode: "create" | "edit";
  tourId?: string;
  initial?: {
    title: string;
    status: string;
    durationLabel: string; // travel dates label
    durationDaysNights: string | null;
    tripSubtitle: string | null;
    tripCode: string | null;
    destinationCountry: string | null;
    destinationCities: string | null;
    tripCategory: string | null;
    heroImageUrl: string | null;
    galleryImageUrls: string[] | null;
    tripVideoUrl: string | null;
    introText: string;
    startLocation: string | null;
    endLocation: string | null;
    meetingPoint: string | null;
    transportUsed: string | null;
    accommodationType: string | null;
    hotelCategory: string | null;
    roomType: string | null;
    minParticipants: number | null;
    maxGroupSize: number | null;
    ageRestrictions: string | null;
    difficultyLevel: string | null;
    requiresWalkingKmPerDay: string | null;
    basePrice: string;
    currency: string;
    singleSupplement: string | null;
    mandatoryInsurance: string | null;
    optionalInsurance: string | null;
    depositLabel: string | null;
    balanceDeadline: string | null;
    bookingDeadline: string | null;
    availableSeats: number | null;
    childPolicy: string | null;
    included: string;
    excluded: string;
    programPdfUrl: string | null;
    contactStaffName: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    /** Per-trip cancellation policy JSON (merged with default when null) */
    cancellationPenalties: unknown | null;
    days: TripDay[];
  };
  createAction: (formData: FormData) => Promise<{ error?: string } | void>;
  updateAction: (tourId: string, formData: FormData) => Promise<{ error?: string } | void>;
};

export function TripForm({
  mode,
  tourId,
  initial,
  createAction,
  updateAction,
}: TripFormProps) {
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() =>
    mode === "edit" && initial?.galleryImageUrls?.length
      ? [...initial.galleryImageUrls]
      : []
  );

  const [days, setDays] = useState<TripDay[]>(() => {
    if (initial?.days?.length) {
      return initial.days.map((d) => ({
        dayHeading: d.dayHeading,
        dateLabel: d.dateLabel,
        description: d.description,
        imageUrls: d.imageUrls?.length ? [...d.imageUrls] : [],
      }));
    }
    return [{ dayHeading: "", dateLabel: "", description: "", imageUrls: [] }];
  });
  const [cancellationPenalties, setCancellationPenalties] = useState<CancellationPenalties>(() =>
    mergeCancellationPenalties(initial?.cancellationPenalties ?? null)
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
    setDays((d) => [...d, { dayHeading: "", dateLabel: "", description: "", imageUrls: [] }]);
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

  function removeGalleryImage(url: string) {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeDayImage(dayIndex: number, url: string) {
    setDays((d) => {
      const next = [...d];
      const imgs = (next[dayIndex].imageUrls ?? []).filter((u) => u !== url);
      next[dayIndex] = { ...next[dayIndex], imageUrls: imgs };
      return next;
    });
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-10"
    >
      <input type="hidden" name="days" value={JSON.stringify(days)} />
      <input type="hidden" name="cancellationPenaltiesJson" value={JSON.stringify(cancellationPenalties)} />
      {mode === "edit" && tourId ? (
        <>
          <input type="hidden" name="existingGalleryImageUrls" value={JSON.stringify(galleryUrls)} />
          {days.map((day, i) => (
            <input
              key={`existing-day-imgs-${i}`}
              type="hidden"
              name={`existingDayImageUrls_${i}`}
              value={JSON.stringify(day.imageUrls ?? [])}
            />
          ))}
        </>
      ) : null}

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      {/* 1. Basic Trip Information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Basic Trip Information</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initial?.title}
              placeholder="e.g. Jordan 2026"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip subtitle / tagline (optional)</label>
            <input
              name="tripSubtitle"
              type="text"
              defaultValue={initial?.tripSubtitle ?? ""}
              placeholder="Short marketing line"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip status</label>
            <select
              name="status"
              defaultValue={initial?.status ?? "UPCOMING"}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="OPEN">Open</option>
              <option value="SOLD_OUT">Sold out</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip code (internal reference)</label>
            <input
              name="tripCode"
              type="text"
              defaultValue={initial?.tripCode ?? ""}
              placeholder="e.g. TL-8847"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Destination country</label>
            <input
              name="destinationCountry"
              type="text"
              defaultValue={initial?.destinationCountry ?? ""}
              placeholder="e.g. Jordan"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Destination cities / locations</label>
            <input
              name="destinationCities"
              type="text"
              defaultValue={initial?.destinationCities ?? ""}
              placeholder="e.g. Amman, Jerash, Petra"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Duration (days/nights)</label>
            <input
              name="durationDaysNights"
              type="text"
              defaultValue={initial?.durationDaysNights ?? ""}
              placeholder="e.g. 7 days / 6 nights"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Travel dates</label>
            <input
              name="durationLabel"
              type="text"
              required
              defaultValue={initial?.durationLabel}
              placeholder='e.g. "23–30 April 2026"'
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip category</label>
            <input
              name="tripCategory"
              type="text"
              defaultValue={initial?.tripCategory ?? ""}
              placeholder="Adventure / Cultural / Wildlife / Family / Luxury..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Hero image (main banner)</label>
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
            <label className="mb-1 block text-sm font-medium text-zinc-700">Short summary / introductory description</label>
            <textarea
              name="introText"
              rows={4}
              required
              defaultValue={initial?.introText}
              placeholder="Summary paragraph describing the destination..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 2. Photo & Media Content */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Photo & Media Content</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Trip gallery images</label>
            <p className="mb-2 text-xs text-zinc-500">
              Choose one or many images in a single selection (Ctrl/Cmd+click). New uploads are added when
              you save. On edit, remove thumbnails with the × button to drop them from the trip.
            </p>
            <input
              name="galleryImages"
              type="file"
              multiple
              accept="image/*"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            {mode === "edit" && galleryUrls.length > 0 ? (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
                <p className="mb-3 text-xs font-medium text-zinc-700">
                  Gallery ({galleryUrls.length}) — × removes from this trip on save. New files above are
                  appended.
                </p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {galleryUrls.map((url, idx) => (
                    <li
                      key={`${url}-${idx}`}
                      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 180px"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/65 text-[15px] font-light leading-none text-white shadow-sm transition-colors hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                          aria-label="Remove image from gallery"
                        >
                          ×
                        </button>
                      </div>
                      <p className="truncate p-1.5 text-[10px] leading-tight text-zinc-500" title={url}>
                        {url}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : mode === "create" ? (
              <p className="mt-2 text-xs text-zinc-500">
                After upload, images appear on the public trip page gallery.
              </p>
            ) : (
              <p className="mt-2 text-xs text-zinc-500">
                No gallery images saved yet for this trip. Upload above to add some.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Optional video URL</label>
            <input
              name="tripVideoUrl"
              type="url"
              defaultValue={initial?.tripVideoUrl ?? ""}
              placeholder="https://youtube.com/... (optional)"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-zinc-700">PDF itinerary / program download</label>
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
      </section>

      {/* 3. Daily Itinerary */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Daily Itinerary</h2>
        <p className="mb-4 text-sm text-zinc-600">
          Add one block per day. The description field supports HTML (e.g. &lt;strong&gt;, &lt;ul&gt;...). Day images are optional.
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
                placeholder="Day title (e.g. Amman -> Jerash)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <input
                type="text"
                value={day.dateLabel}
                onChange={(e) => updateDay(i, "dateLabel", e.target.value)}
                placeholder="Optional date label (e.g. 23 April)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <textarea
                value={day.description}
                onChange={(e) => updateDay(i, "description", e.target.value)}
                rows={5}
                placeholder="Activities, bold keywords, links (HTML allowed)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <input
                name={`dayImages_${i}`}
                type="file"
                multiple
                accept="image/*"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 file:mr-2 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              {mode === "edit" && (day.imageUrls?.length ?? 0) > 0 ? (
                <div className="rounded-md border border-zinc-200 bg-white p-3">
                  <p className="mb-2 text-xs font-medium text-zinc-600">
                    Saved images for this day ({day.imageUrls!.length}) — × removes on save; new files above
                    are added.
                  </p>
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {day.imageUrls!.map((url, j) => (
                      <li
                        key={`${url}-${j}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-100"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 120px"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeDayImage(i, url)}
                          className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/65 text-[15px] font-light leading-none text-white shadow-sm transition-colors hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                          aria-label="Remove image from this day"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
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

      {/* 4. Trip logistics */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Trip Logistics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Start location (city / airport)</label>
            <input
              name="startLocation"
              type="text"
              defaultValue={initial?.startLocation ?? ""}
              placeholder="e.g. Rome FCO"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">End location</label>
            <input
              name="endLocation"
              type="text"
              defaultValue={initial?.endLocation ?? ""}
              placeholder="e.g. Rome FCO"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Meeting point / pickup</label>
            <input
              name="meetingPoint"
              type="text"
              defaultValue={initial?.meetingPoint ?? ""}
              placeholder="e.g. Hotel lobby"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Transport used during trip</label>
            <input
              name="transportUsed"
              type="text"
              defaultValue={initial?.transportUsed ?? ""}
              placeholder="Bus / Train / Flight / Private transfer"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Accommodation type</label>
            <input
              name="accommodationType"
              type="text"
              defaultValue={initial?.accommodationType ?? ""}
              placeholder="Hotel / Resort / Guesthouse"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Hotel category</label>
            <input
              name="hotelCategory"
              type="text"
              defaultValue={initial?.hotelCategory ?? ""}
              placeholder="e.g. 4★"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Room type</label>
            <input
              name="roomType"
              type="text"
              defaultValue={initial?.roomType ?? ""}
              placeholder="shared / twin / single"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 5. Group information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Group Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Minimum participants required</label>
            <input
              name="minParticipants"
              type="number"
              min="0"
              defaultValue={initial?.minParticipants ?? ""}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Maximum group size</label>
            <input
              name="maxGroupSize"
              type="number"
              min="0"
              defaultValue={initial?.maxGroupSize ?? ""}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Age restrictions (if any)</label>
            <input
              name="ageRestrictions"
              type="text"
              defaultValue={initial?.ageRestrictions ?? ""}
              placeholder="e.g. 18+"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Physical / difficulty level</label>
            <input
              name="difficultyLevel"
              type="text"
              defaultValue={initial?.difficultyLevel ?? ""}
              placeholder="Moderate"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Example requirement (km/day)</label>
            <input
              name="requiresWalkingKmPerDay"
              type="text"
              defaultValue={initial?.requiresWalkingKmPerDay ?? ""}
              placeholder="e.g. Requires walking up to 5km daily"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 6. Pricing information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Pricing Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Base price per person</label>
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
            <label className="mb-1 block text-sm font-medium text-zinc-700">Currency</label>
            <select
              name="currency"
              defaultValue={initial?.currency ?? "EUR"}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Single supplement</label>
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
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Deposit required for booking</label>
            <input
              name="depositLabel"
              type="text"
              defaultValue={initial?.depositLabel ?? ""}
              placeholder="e.g. 30% at booking"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Balance payment deadline</label>
            <input
              name="balanceDeadline"
              type="text"
              defaultValue={initial?.balanceDeadline ?? ""}
              placeholder="e.g. 60 days before departure"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Child policy</label>
            <textarea
              name="childPolicy"
              rows={3}
              defaultValue={initial?.childPolicy ?? ""}
              placeholder="e.g. age 0-3 free, 4-8 50%, 9-11 75%, 12+ adult price"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 7. What’s included */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">What’s Included</h2>
        <textarea
          name="included"
          rows={6}
          required
          defaultValue={initial?.included}
          placeholder="One item per line or use bullet points"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </section>

      {/* 8. What’s not included */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">What’s Not Included</h2>
        <textarea
          name="excluded"
          rows={6}
          required
          defaultValue={initial?.excluded}
          placeholder="One item per line"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </section>

      {/* 8b. Cancellation penalties (JSON + preview) */}
      <CancellationPenaltiesEditor value={cancellationPenalties} onChange={setCancellationPenalties} />

      {/* 9. Insurance */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Insurance</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Mandatory insurance</label>
            <textarea
              name="mandatoryInsurance"
              rows={4}
              defaultValue={initial?.mandatoryInsurance ?? ""}
              placeholder="Mandatory insurance description"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Optional insurance offer</label>
            <textarea
              name="optionalInsurance"
              rows={4}
              defaultValue={initial?.optionalInsurance ?? ""}
              placeholder="Optional insurance offer"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 10. Booking information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Booking Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Booking deadline (last date to book)</label>
            <input
              name="bookingDeadline"
              type="text"
              defaultValue={initial?.bookingDeadline ?? ""}
              placeholder="e.g. 60 days before departure"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Available seats / capacity (optional)</label>
            <input
              name="availableSeats"
              type="number"
              min="0"
              defaultValue={initial?.availableSeats ?? ""}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* 11. Contact information */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Contact Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Contact staff member name</label>
            <input
              name="contactStaffName"
              type="text"
              defaultValue={initial?.contactStaffName ?? ""}
              placeholder="Name"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Phone number</label>
            <input
              name="contactPhone"
              type="tel"
              defaultValue={initial?.contactPhone ?? ""}
              placeholder="+39 ..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email address</label>
            <input
              name="contactEmail"
              type="email"
              defaultValue={initial?.contactEmail ?? ""}
              placeholder="email@domain.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
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
