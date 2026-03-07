"use client";

import { useState, useCallback, useEffect } from "react";

export type Review = {
  stars: number;
  quote: string;
  name: string;
  location: string;
  initials: string;
};

const CARDS_VISIBLE = 3; // show 3 at a time
const AUTOPLAY_INTERVAL_MS = 5000;

const ArrowPrev = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ArrowNext = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  // page = starting index; we show 3 cards starting at page, move 1 by 1
  const [page, setPage] = useState(0);
  const totalSteps = Math.max(1, reviews.length - CARDS_VISIBLE + 1);

  const goPrev = useCallback(() => {
    setPage((p) => (p <= 0 ? totalSteps - 1 : p - 1));
  }, [totalSteps]);

  const goNext = useCallback(() => {
    setPage((p) => (p >= totalSteps - 1 ? 0 : p + 1));
  }, [totalSteps]);

  useEffect(() => {
    if (totalSteps <= 1) return;
    const id = setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [totalSteps, goNext]);

  const slice = reviews.slice(page, page + CARDS_VISIBLE);

  return (
    <div className="relative">
      {/* Left arrow — vertically centered on left */}
      {totalSteps > 1 && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-bone bg-white text-obsidian shadow-[var(--shadow-sm)] transition-all hover:border-obsidian/30 hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2"
          aria-label="Previous testimonials"
        >
          <ArrowPrev />
        </button>
      )}

      <div className="px-12 md:px-14">
        <div className="grid gap-6 md:grid-cols-3">
          {slice.map((review) => (
            <div
              key={`${review.name}-${review.location}`}
              className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div className="mb-4 flex gap-[3px] text-base text-oro">
                {Array.from({ length: review.stars }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mb-6 font-[family-name:var(--font-cormorant)] text-xl font-normal italic leading-relaxed text-obsidian">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-bone bg-parchment font-[family-name:var(--font-cormorant)] text-lg font-medium text-terracotta">
                  {review.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-obsidian">{review.name}</p>
                  <p className="text-xs text-[#7A7060]">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalSteps > 1 && (
          <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Testimonial position">
            {Array.from({ length: totalSteps }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                role="tab"
                aria-selected={i === page}
                aria-label={`Position ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === page ? "bg-terracotta" : "bg-bone hover:bg-[#C0B098]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right arrow — vertically centered on right */}
      {totalSteps > 1 && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-bone bg-white text-obsidian shadow-[var(--shadow-sm)] transition-all hover:border-obsidian/30 hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2"
          aria-label="Next testimonials"
        >
          <ArrowNext />
        </button>
      )}
    </div>
  );
}
