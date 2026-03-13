"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AuthNavButton } from "@/components/auth-nav-button";
import { useI18n } from "@/components/i18n-provider";
import { LangLink } from "@/components/lang-link";

const EDGE_ZONE = 22; // % from left/right where hover triggers edge reflection

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LiquidHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
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
        className={`liquid-surface liquid-surface--nav mx-auto max-w-[1440px] rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOverlapping ? "liquid-surface--overlap bg-white/20" : ""
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
          <LangLink href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="TRAVEL-LAND.IT"
              width={140}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </LangLink>

          <nav className="hidden items-center gap-6 md:gap-8 lg:flex" aria-label="Menu principale">
            <LangLink
              href="/"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.home")}
            </LangLink>
            <LangLink
              href="/who-we-are"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/who-we-are") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.whoWeAre")}
            </LangLink>
            <LangLink
              href="/sustainable-tourism"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/sustainable-tourism") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.sustainableTourism")}
            </LangLink>
            <LangLink
              href="/upcoming-trips"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/upcoming-trips") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.upcomingTrips")}
            </LangLink>
            <LangLink
              href="/catalogs"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/catalogs") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.catalogs")}
            </LangLink>
            <LangLink
              href="/contacts"
              className={`liquid-nav-link text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-obsidian ${
                isActive(pathname, "/contacts") ? "border-b-[1.5px] border-obsidian text-obsidian" : "text-obsidian/60"
              }`}
            >
              {t("nav.contacts")}
            </LangLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center sm:flex">
              <label className="sr-only" htmlFor="site-language-select">
                {t("language.ariaLabel")}
              </label>
              <div className="relative">
                <select
                  id="site-language-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value === "en" ? "en" : "it")}
                  className="liquid-pill appearance-none rounded-full border border-obsidian/10 bg-white/60 px-3 py-1.5 pr-7 text-xs font-medium uppercase tracking-[0.16em] text-obsidian/80 outline-none backdrop-blur-md transition-all duration-300 hover:border-obsidian/25 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2"
                >
                  <option value="it">{t("language.short.it")}</option>
                  <option value="en">{t("language.short.en")}</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[9px] text-obsidian/50">
                  ▼
                </span>
              </div>
            </div>
            <AuthNavButton />
          </div>
        </div>
      </div>
    </header>
  );
}
