import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { AuthNavButton } from "@/components/auth-nav-button";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRAVEL-LAND.IT — Italy, Curated for You",
  description:
    "Crafting bespoke Italian journeys for the world's most discerning travelers. Luxury curated tours across Rome, Venice, Florence, Amalfi Coast, and Tuscany.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-bone bg-travertine/88 backdrop-blur-[20px] backdrop-saturate-[180%]">
            <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-20">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-cormorant)] text-xl font-medium tracking-wide text-obsidian">
                  TRAVEL-LAND
                  <span className="text-oro">.IT</span>
                </span>
              </Link>

              <nav className="hidden items-center gap-8 md:flex">
                <Link
                  href="/upcoming-trips"
                  className="text-[13px] font-medium tracking-wide text-obsidian/70 transition-opacity duration-150 hover:text-obsidian"
                >
                  Destinations
                </Link>
                <Link
                  href="/catalogs"
                  className="text-[13px] font-medium tracking-wide text-obsidian/70 transition-opacity duration-150 hover:text-obsidian"
                >
                  Experiences
                </Link>
                <Link
                  href="/travel-history"
                  className="text-[13px] font-medium tracking-wide text-obsidian/70 transition-opacity duration-150 hover:text-obsidian"
                >
                  Itineraries
                </Link>
                <Link
                  href="/who-we-are"
                  className="text-[13px] font-medium tracking-wide text-obsidian/70 transition-opacity duration-150 hover:text-obsidian"
                >
                  About
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <button className="hidden items-center gap-1.5 rounded-full border border-bone px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-obsidian transition-colors duration-150 hover:border-obsidian sm:flex">
                  EN · IT · DE
                </button>
                <AuthNavButton />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-obsidian text-[#F0EAE0]">
            <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:py-24">
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <div>
                  <p className="mb-4 font-[family-name:var(--font-cormorant)] text-[28px] font-normal">
                    TRAVEL-LAND<span className="text-oro">.IT</span>
                  </p>
                  <p className="mb-6 font-[family-name:var(--font-cormorant)] text-base italic text-[#7A7060]">
                    Italy, Curated for You.
                  </p>
                  <p className="max-w-[280px] text-[13px] leading-relaxed text-[#7A7060]">
                    Crafting bespoke Italian journeys for the world&apos;s most
                    discerning travelers since 2015. ASTA Member · ILTM Select
                    Partner.
                  </p>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Destinations
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {["Rome", "Venice", "Florence", "Amalfi Coast", "Tuscany"].map(
                      (item) => (
                        <li key={item}>
                          <Link
                            href="/upcoming-trips"
                            className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                          >
                            {item}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Experiences
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Culinary",
                      "Art & Culture",
                      "Private Villas",
                      "Yacht Charters",
                    ].map((item) => (
                      <li key={item}>
                        <Link
                          href="/catalogs"
                          className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Company
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {[
                      { label: "About Us", href: "/who-we-are" },
                      { label: "Sustainability", href: "/sustainable-tourism" },
                      { label: "Contact", href: "/contacts" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
                <span className="text-xs text-[#7A7060]">
                  © {new Date().getFullYear()} TRAVEL-LAND.IT · All rights
                  reserved
                </span>
                <div className="flex gap-3">
                  {["EN", "IT", "DE", "FR", "ES"].map((lang, i) => (
                    <span
                      key={lang}
                      className={`cursor-pointer text-[11px] transition-colors duration-150 hover:text-[#F0EAE0] ${
                        i === 0 ? "text-champagne" : "text-[#7A7060]"
                      }`}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
