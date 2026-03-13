import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { LiquidHeader } from "@/components/liquid-header";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/site-footer";
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
    <html lang="en" >
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <I18nProvider>
            <div className="flex min-h-screen flex-col">
              <LiquidHeader />

              <main className="flex-1">{children}</main>

              <SiteFooter />
            </div>
          </I18nProvider>
        </Suspense>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
