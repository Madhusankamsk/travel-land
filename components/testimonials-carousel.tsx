"use client";

import { useState, useCallback, useEffect } from "react";

export type Review = {
  stars: number;
  quote: string;
  name: string;
  location: string;
  initials: string;
};

const MOBILE_BREAKPOINT = 768;
const AUTOPLAY_INTERVAL_MS = 5000;

const ArrowPrev = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ArrowNext = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cardsVisible = isMobile ? 1 : 3;
  const totalSteps = Math.max(1, reviews.length - cardsVisible + 1);

  useEffect(() => {
    setPage((p) => Math.min(p, totalSteps - 1));
  }, [totalSteps]);

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

  // Build slides: each slide shows cardsVisible cards
  const slides = Array.from({ length: totalSteps }, (_, i) =>
    reviews.slice(i, i + cardsVisible)
  );

  return (
    <div className="w-full">
      {/* Arrows sit outside the card area so they never overlap or peek */}
      <div className="flex items-stretch gap-4 md:gap-6">
        {totalSteps > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-bone bg-white text-obsidian transition-[box-shadow,border-color] duration-200 hover:border-obsidian/20 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-parchment active:scale-95"
            aria-label="Previous testimonials"
          >
            <ArrowPrev />
          </button>
        )}

        {/* Only this area shows cards — one full slide at a time, no partial peek */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex"
            style={{
              width: `${totalSteps * 100}%`,
              transform: `translateX(-${(page / totalSteps) * 100}%)`,
              transition: prefersReducedMotion
                ? "none"
                : "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {slides.map((slideReviews, slideIndex) => (
              <div
                key={slideIndex}
                className="grid shrink-0 grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
                style={{ width: `${100 / totalSteps}%` }}
              >
                {slideReviews.map((review) => (
                  <article
                    key={`${review.name}-${review.location}`}
                    className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
                  >
                    <div className="mb-5 flex gap-0.5 text-[16px] leading-none text-oro" aria-hidden>
                      {Array.from({ length: review.stars }, (_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <blockquote className="mb-8">
                      <p className="font-[family-name:var(--font-cormorant)] text-[20px] font-normal italic leading-[1.5] text-obsidian">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </blockquote>
                    <footer className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-bone bg-parchment font-[family-name:var(--font-cormorant)] text-lg font-medium text-terracotta">
                        {review.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-obsidian">{review.name}</p>
                        <p className="mt-0.5 text-[13px] text-[#7A7060]">{review.location}</p>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {totalSteps > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-bone bg-white text-obsidian transition-[box-shadow,border-color] duration-200 hover:border-obsidian/20 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-parchment active:scale-95"
            aria-label="Next testimonials"
          >
            <ArrowNext />
          </button>
        )}
      </div>

      {totalSteps > 1 && (
        <div
          className="mt-12 flex justify-center gap-2"
          role="tablist"
          aria-label="Testimonial position"
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              role="tab"
              aria-selected={i === page}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === page
                  ? "h-2.5 w-8 bg-terracotta"
                  : "h-2.5 w-2.5 bg-bone hover:bg-[#C0B098]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
