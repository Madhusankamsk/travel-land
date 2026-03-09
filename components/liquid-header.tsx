"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthNavButton } from "@/components/auth-nav-button";

const EDGE_ZONE = 22; // % from left/right where hover triggers edge reflection

export function LiquidHeader() {
  const [scrollY, setScrollY] = useState(0);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [hoverXPercent, setHoverXPercent] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setIsOverlapping(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = headerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setHoverXPercent(x);
    },
    []
  );

  const onMouseLeave = useCallback(() => {
    setHoverXPercent(null);
  }, []);

  const progress = Math.min(scrollY / 200, 1);

  const leftEdgeOpacity =
    hoverXPercent === null ? 0.55 : hoverXPercent < EDGE_ZONE ? 0.55 * (1 - hoverXPercent / EDGE_ZONE) : 0.55;
  const rightEdgeOpacity =
    hoverXPercent === null
      ? 0.55
      : hoverXPercent > 100 - EDGE_ZONE
        ? 0.55 * (1 - (hoverXPercent - (100 - EDGE_ZONE)) / EDGE_ZONE)
        : 0.55;

  return (
    <header
      className="sticky top-0 z-50 px-4 pt-3 lg:px-6"
      style={{ minHeight: "var(--header-height)" }}
    >
      <div
        ref={headerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`liquid-surface liquid-surface--nav mx-auto max-w-[1440px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOverlapping ? "liquid-surface--overlap" : ""
        }`}
        style={{
          "--liquid-bg-opacity": isOverlapping ? 0.72 : 0.6,
          "--liquid-blur": isOverlapping ? "24px" : "20px",
          "--liquid-border-opacity": isOverlapping ? 0.4 : 0.3,
          "--liquid-shadow-intensity": progress * 0.14,
          "--liquid-glow-opacity": progress * 0.5,
          "--liquid-edge-left": String(leftEdgeOpacity),
          "--liquid-edge-right": String(rightEdgeOpacity),
        } as React.CSSProperties}
      >
        <div
          className="liquid-surface-edge-reflection"
          aria-hidden
        />
        <div className="relative z-10 flex h-[64px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="TRAVEL-LAND.IT"
              width={140}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 md:gap-8 lg:flex" aria-label="Menu principale">
            <Link
              href="/"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Home
            </Link>
            <Link
              href="/who-we-are"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Chi siamo
            </Link>
            <Link
              href="/sustainable-tourism"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Turismo sostenibile
            </Link>
            <Link
              href="/upcoming-trips"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Prossimi viaggi
            </Link>
            <Link
              href="/catalogs"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Cataloghi viaggi
            </Link>
            <Link
              href="/contacts"
              className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
            >
              Contatti
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="liquid-pill hidden items-center gap-1.5 rounded-full border border-obsidian/10 bg-white/50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-obsidian/70 transition-all duration-300 hover:border-obsidian/25 hover:bg-white/80 sm:flex"
              aria-label="Lingua"
            >
              IT · EN · DE
            </button>
            <AuthNavButton />
          </div>
        </div>
      </div>
    </header>
  );
}
