import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { LiquidHeader } from "@/components/liquid-header";
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
          <LiquidHeader />

          <main className="flex-1">{children}</main>

          <footer className="bg-obsidian text-[#F0EAE0]">
            <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:py-24">
              <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <div>
                  <Image
                    src="/Logo.png"
                    alt="TRAVEL-LAND.IT"
                    width={180}
                    height={60}
                    className="mb-4 h-14 w-auto brightness-0 invert"
                  />
                  <p className="mb-2 font-[family-name:var(--font-cormorant)] text-base italic text-[#7A7060]">
                    Agenzia di viaggi, tour operator
                  </p>
                  <p className="mb-4 max-w-[320px] text-[13px] leading-relaxed text-[#7A7060]">
                    <strong className="text-champagne/90">TRAVEL-LAND S.R.L.</strong>
                    <br />
                    <a href="mailto:eleonora@travel-land.it" className="hover:text-[#F0EAE0]">eleonora@travel-land.it</a>
                    <br />
                    P.IVA: 07403720969 · Codice Univoco: M5UXCR1
                    <br />
                    Sede legale: Viale Edison 666, Sesto San Giovanni (MI)
                  </p>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-champagne/80">
                    Si riceve su appuntamento
                  </p>
                  <p className="text-[13px] text-[#7A7060]">
                    Lun–Ven 10:00–19:00
                  </p>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Prossimi viaggi
                  </h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/upcoming-trips" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Storico Viaggi
                      </Link>
                    </li>
                    <li>
                      <Link href="/upcoming-trips" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Tutti i tour
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Catalogo
                  </h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/catalogs" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Cataloghi viaggi
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
                    Contatti
                  </h4>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="/who-we-are" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Chi siamo
                      </Link>
                    </li>
                    <li>
                      <Link href="/sustainable-tourism" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Turismo sostenibile
                      </Link>
                    </li>
                    <li>
                      <Link href="/contacts" className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]">
                        Contatti
                      </Link>
                    </li>
                  </ul>
                  <p className="mt-3 text-[12px] text-[#7A7060]">
                    🟢 Scrivici su WhatsApp
                    <br />
                    <a href="https://wa.me/393284292203" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EAE0]">+39 328 429 2203</a> · <a href="https://wa.me/393384571070" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EAE0]">+39 338 457 1070</a> Eleonora
                    <br />
                    <a href="https://wa.me/393249241395" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EAE0]">+39 324 924 1395</a> Sisira
                    <br />
                    <a href="https://wa.me/393201668589" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0EAE0]">+39 320 166 8589</a> Romeo
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
                <span className="text-xs text-[#7A7060]">
                  © {new Date().getFullYear()} Travelland SRL · Agenzia di viaggi Milano. Tutti i diritti riservati.
                </span>
                <div className="flex gap-3">
                  {["IT", "EN", "DE", "FR", "ES"].map((lang, i) => (
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
