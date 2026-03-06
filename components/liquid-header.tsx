"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthNavButton } from "@/components/auth-nav-button";

export function LiquidHeader() {
  const [scrollY, setScrollY] = useState(0);
  const [isOverlapping, setIsOverlapping] = useState(false);
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

  const progress = Math.min(scrollY / 200, 1);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 lg:px-6">
      <div
        ref={headerRef}
        className={`liquid-surface mx-auto max-w-[1440px] rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOverlapping ? "liquid-surface--overlap" : ""
        }`}
        style={{
          "--liquid-bg-opacity": isOverlapping ? 0.72 : 0.6,
          "--liquid-blur": isOverlapping ? "24px" : "20px",
          "--liquid-border-opacity": isOverlapping ? 0.4 : 0.3,
          "--liquid-shadow-intensity": progress * 0.14,
          "--liquid-glow-opacity": progress * 0.5,
        } as React.CSSProperties}
      >
        <div className="flex h-[64px] items-center justify-between px-5 lg:px-8">
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

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { href: "/upcoming-trips", label: "Destinations" },
              { href: "/catalogs", label: "Experiences" },
              { href: "/travel-history", label: "Itineraries" },
              { href: "/who-we-are", label: "About" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="liquid-nav-link text-[13px] font-medium tracking-wide text-obsidian/60 transition-all duration-300 hover:text-obsidian"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="liquid-pill hidden items-center gap-1.5 rounded-full border border-obsidian/10 bg-white/50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-obsidian/70 transition-all duration-300 hover:border-obsidian/25 hover:bg-white/80 sm:flex">
              EN · IT · DE
            </button>
            <AuthNavButton />
          </div>
        </div>
      </div>
    </header>
  );
}
