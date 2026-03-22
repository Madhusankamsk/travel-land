"use client";

import Image from "next/image";
import { LangLink } from "@/components/lang-link";
import { formatTripPrice } from "@/lib/trip-price";

export type UpcomingTourCardTour = {
  id: string;
  title: string;
  eyebrow: string;
  introText: string;
  heroImageUrl: string | null;
  durationLabel: string;
  basePrice: number;
  currency: string;
  programPdfUrl: string | null;
};

type UpcomingTourCardProps = {
  tour: UpcomingTourCardTour;
};

export function UpcomingTourCard({ tour }: UpcomingTourCardProps) {
  const priceDisplay = formatTripPrice(tour.basePrice, tour.currency);

  return (
    <article className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
      <LangLink
        href={`/upcoming-trips/${tour.id}`}
        className="absolute inset-0 z-[1] rounded-[20px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-[3px]"
        aria-label={`Vedi dettagli: ${tour.title}`}
      />

      <div className="pointer-events-none relative z-0">
        <div className="relative h-[220px] overflow-hidden">
          {tour.heroImageUrl ? (
            <Image
              src={tour.heroImageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-parchment" aria-hidden />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,23,20,0.2)_0%,rgba(107,58,42,0.35)_50%,rgba(26,23,20,0.6)_100%)]"
            aria-hidden
          />

          {tour.durationLabel ? (
            <span className="absolute top-4 left-4 rounded-full bg-obsidian/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-champagne backdrop-blur-sm">
              {tour.durationLabel}
            </span>
          ) : null}
        </div>

        <div className="p-6">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-terracotta">
            {tour.eyebrow}
          </p>
          <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
            {tour.title}
          </h3>

          {tour.introText ? (
            <p className="mb-4 text-[13px] leading-relaxed text-[#7A7060]">{tour.introText}</p>
          ) : null}

          <div className="flex items-center justify-between border-t border-bone pt-4">
            <div>
              <p className="text-[11px] text-[#7A7060]">Da</p>
              <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium text-obsidian">
                {priceDisplay}{" "}
                <span className="text-[13px] opacity-60">a pers.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {tour.programPdfUrl ? (
        <div className="relative z-10 mt-4 px-6 pb-6">
          <a
            href={tour.programPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex w-full min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-bone bg-parchment px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] text-obsidian transition-colors duration-[var(--dur-fast)] hover:bg-bone/80 focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 active:scale-[0.97]"
          >
            Programma (PDF)
          </a>
        </div>
      ) : null}
    </article>
  );
}
