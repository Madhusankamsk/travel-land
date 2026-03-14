import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteShell } from "@/components/site-shell";
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
            <SiteShell>{children}</SiteShell>
          </I18nProvider>
        </Suspense>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
