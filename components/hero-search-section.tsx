"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookingDatePicker } from "@/components/booking-date-picker";

type ActiveSearchField = "destination" | "checkin" | "travelers" | null;

export function HeroSearchSection() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [activeField, setActiveField] = useState<ActiveSearchField>(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchExpanded) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchExpanded]);

  return (
    <section
      className={`relative flex min-h-[85vh] flex-col justify-end overflow-hidden pt-[5.5rem] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        searchExpanded ? "-mt-[5.5rem] min-h-[70vh]" : "-mt-[5.5rem] bg-obsidian"
      }`}
    >
      {/* Hero image — always visible; when search expanded: zoom in + blur + reduced opacity */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          searchExpanded ? "scale-110 opacity-50" : "scale-100 opacity-100"
        }`}
        style={{ filter: searchExpanded ? "blur(10px)" : "blur(0)" }}
      >
        <Image
          src="/hero1.jpg"
          alt="Dramatic sunset through ancient stone arches"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(26,23,20,0.8)_0%,transparent_60%),radial-gradient(ellipse_80%_80%_at_20%_20%,rgba(46,107,158,0.15)_0%,transparent_50%),radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(184,150,62,0.08)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-travertine transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          searchExpanded ? "opacity-60" : "opacity-0"
        }`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-10 pt-24 lg:px-12 lg:pb-14 lg:pt-28">
        <div
          ref={containerRef}
          className={`rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            searchExpanded
              ? "liquid-surface-inner border border-bone bg-white p-8 shadow-[var(--shadow-xl)] lg:p-12"
              : "liquid-surface-dark p-8 lg:p-12"
          }`}
        >
          {/* Headline block — collapse when search expanded */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              searchExpanded ? "max-h-0 opacity-0 mb-0" : "max-h-[500px] opacity-100 mb-0"
            }`}
          >
            <div className="max-w-[700px] pb-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
                Featured Journey · Autumn 2025
              </p>
              <h1 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(36px,6vw,80px)] font-normal leading-[1.1] tracking-tighter text-[#F0EAE0]">
                Discover <em className="text-champagne">Italia</em>
                <br />
                Like Never Before
              </h1>
              <p className="mb-8 max-w-[520px] text-base leading-relaxed text-[#B5A890]">
                Seven nights of absolute immersion — private Colosseum access,
                Vatican at dawn, and the finest tables in the Eternal City. Crafted
                exclusively for the discerning traveler.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/upcoming-trips"
                  className="inline-flex items-center rounded-full bg-oro px-7 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
                >
                  Begin Planning
                </Link>
                <Link
                  href="/catalogs"
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-medium tracking-wide text-[#F0EAE0] backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                >
                  View Itineraries
                </Link>
              </div>
            </div>
          </div>

          {/* When expanded: back icon + title above search */}
          {searchExpanded && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => {
                  setSearchExpanded(false);
                  setActiveField(null);
                }}
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-bone bg-transparent text-obsidian transition-all duration-200 hover:border-obsidian hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-3"
                aria-label="Back to hero"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-obsidian lg:text-3xl">
                Where are you going?
              </h2>
            </div>
          )}

          {/* Search bar — clickable container; becomes main focus when expanded */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSearchExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSearchExpanded(true);
              }
            }}
            className={`grid cursor-pointer grid-cols-1 overflow-hidden rounded-2xl transition-all duration-300 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] ${
              searchExpanded
                ? "liquid-surface-inner border border-bone bg-parchment/80 shadow-[var(--shadow-md)]"
                : "liquid-surface-inner mt-10"
            }`}
          >
            <div
              role="group"
              onClick={() => {
                setSearchExpanded(true);
                setActiveField("destination");
                destinationInputRef.current?.focus();
              }}
              className={`flex w-full cursor-text flex-col justify-center rounded-lg p-4 transition-all duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-oro focus-within:outline-offset-2 sm:border-r sm:border-bone ${
                activeField === "destination"
                  ? "bg-bone/80 border-l-2 border-l-bone"
                  : "hover:bg-white/50"
              }`}
            >
              <label htmlFor="hero-destination-input" className="mb-1 block cursor-text text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                Destination
              </label>
              <input
                ref={destinationInputRef}
                id="hero-destination-input"
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onFocus={() => {
                  setSearchExpanded(true);
                  setActiveField("destination");
                }}
                placeholder="Where to?"
                autoComplete="off"
                aria-label="Destination, Where to?"
                className="w-full border-none bg-transparent p-0 text-[15px] font-medium text-obsidian placeholder:text-[#B5A890] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex w-full items-stretch sm:border-r sm:border-bone">
              <BookingDatePicker
                searchExpanded={searchExpanded}
                isSelected={activeField === "checkin"}
                onOpenChange={(open) => setActiveField(open ? "checkin" : null)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchExpanded(true);
                setActiveField("travelers");
              }}
              className={`flex w-full cursor-pointer items-center rounded-lg p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 active:scale-[0.99] ${
                activeField === "travelers"
                  ? "bg-bone/80 hover:bg-bone/90 border-l-2 border-l-bone"
                  : "hover:bg-white/50 active:bg-parchment/80"
              }`}
            >
              <div className="w-full">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                  Travelers
                </p>
                <p className="text-[15px] text-[#B5A890]">2 adults</p>
              </div>
            </button>
            <div className="flex items-center p-3">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full bg-obsidian px-7 py-3.5 text-sm font-medium tracking-wide text-[#F0EAE0] transition-all duration-150 hover:bg-[#2E2921] hover:shadow-[var(--shadow-md)]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
