"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  { src: "/hero1.jpg", alt: "Dramatic sunset through ancient stone arches" },
  { src: "/hero2.jpeg", alt: "Italian coastline and Mediterranean views" },
  { src: "/hero3.jpeg", alt: "Historic Italian architecture and streets" },
];

const CAROUSEL_INTERVAL_MS = 10000;
const ZOOM_DURATION_MS = 8000;

export function HeroSearchSection() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [carouselTick, setCarouselTick] = useState(0);
  const carouselIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance hero carousel (ref-based interval so it always runs)
  useEffect(() => {
    if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
    carouselIntervalRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
      setCarouselTick((t) => t + 1);
    }, CAROUSEL_INTERVAL_MS);
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
        carouselIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <section
      className="hero-viewport relative flex flex-col overflow-hidden bg-obsidian"
      style={{
        paddingTop: "var(--header-height)",
        marginTop: "calc(-1 * var(--header-height))",
      }}
    >
      {/* Hero carousel — 3 images with crossfade + zoom */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => {
          const isActive = i === heroIndex;
          return (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
              }}
              aria-hidden={!isActive}
            >
            <div
              key={isActive ? `zoom-${heroIndex}-${carouselTick}` : `zoom-inactive-${i}`}
              className="h-full w-full animate-hero-zoom"
              style={{
                animationDuration: `${ZOOM_DURATION_MS}ms`,
                animationPlayState: isActive ? "running" : "paused",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
            </div>
          );
        })}
      </div>
      {/* Dark overlay: on top of images (z-[5]) so hero text is readable */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: "linear-gradient(to bottom, rgba(26,23,20,0.25) 0%, rgba(26,23,20,0.4) 40%, rgba(26,23,20,0.6) 70%, rgba(26,23,20,0.85) 100%), radial-gradient(ellipse 140% 80% at 50% 100%, rgba(26,23,20,0.85) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="hero-content-area relative z-10 flex flex-1 flex-col">
        <div className="hero-nav-spacer" aria-hidden />
        <div className="flex min-h-0 flex-1 flex-col justify-start md:justify-end">
          <div className="hero-content-inner mx-auto w-full max-w-[1440px] px-4 pb-10 pt-2 md:pt-0 lg:px-12 lg:pb-14 lg:pt-8">
            <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="mx-auto w-full max-w-[75vw] pb-8 text-center">
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
              Agenzia di viaggi, tour operator
            </p>
            <h1 className="mb-4 text-center font-[family-name:var(--font-cormorant)] text-[clamp(36px,6vw,80px)] font-normal leading-[1.1] tracking-tighter text-[#F0EAE0]">
              Travel land SRL
            </h1>
            <blockquote className="hero-quote mx-auto mb-8 max-w-[80vw]">
              <p className="hero-quote-text">
                <span className="hero-quote-mark-open" aria-hidden>“</span>
                Una volta che hai viaggiato, il viaggio non finisce mai,
                ma si ripete infinite volte negli angoli più silenziosi della mente.
                <em className="block mt-3">La mente non sa separarsi dal viaggio.<span className="hero-quote-mark-close" aria-hidden>&rdquo;</span></em>
              </p>
              <cite className="hero-quote-cite not-italic">
                — Pat Conroy
              </cite>
            </blockquote>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/upcoming-trips"
                className="inline-flex items-center rounded-full bg-oro px-7 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
              >
                Prossimi viaggi
              </Link>
              <Link
                href="/catalogs"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-medium tracking-wide text-[#F0EAE0] backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                Cataloghi viaggi
              </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

