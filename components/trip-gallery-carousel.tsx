"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

type TripGalleryCarouselProps = {
  images: string[];
  /** Accessible label for slides (Italian default matches trip page) */
  imageAltPrefix?: string;
};

export function TripGalleryCarousel({
  images,
  imageAltPrefix = "Immagine galleria",
}: TripGalleryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const n = images.length;

  const scrollToIndex = useCallback((i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w < 1) return;
    const next = ((i % n) + n) % n;
    el.scrollTo({ left: next * w, behavior: "smooth" });
    setIndex(next);
  }, [n]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || n < 2) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w < 1) return;
      setIndex(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / w))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [n]);

  useEffect(() => {
    if (n <= 1) return;
    if (reduceMotion) return;
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % n;
        const el = containerRef.current;
        if (el) {
          const w = el.clientWidth;
          el.scrollTo({ left: next * w, behavior: "smooth" });
        }
        return next;
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, [n, paused, reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (n === 0) return null;

  if (n === 1) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-bone bg-white shadow-[var(--shadow-sm)]">
        <Image
          src={images[0]}
          alt={`${imageAltPrefix} 1`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, min(800px, 100vw)"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex aspect-[16/10] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-xl border border-bone bg-white shadow-[var(--shadow-sm)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label="Galleria fotografica"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-full min-h-0 min-w-full shrink-0 snap-center snap-always"
          >
            <Image
              src={src}
              alt={`${imageAltPrefix} ${i + 1} di ${n}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, min(800px, 100vw)"
              unoptimized
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-bone/80 bg-white/90 text-obsidian shadow-md backdrop-blur-sm transition-opacity hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 md:left-3 md:h-11 md:w-11"
        aria-label="Immagine precedente"
        onClick={() => scrollToIndex(index - 1)}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        type="button"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-bone/80 bg-white/90 text-obsidian shadow-md backdrop-blur-sm transition-opacity hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 md:right-3 md:h-11 md:w-11"
        aria-label="Immagine successiva"
        onClick={() => scrollToIndex(index + 1)}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      <div
        className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
        aria-hidden
      >
        {images.map((_, i) => (
          <span
            key={i}
            className={`pointer-events-none h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/55"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
