import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { AuthNavButton } from "@/components/auth-nav-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Land",
  description: "Curated small-group trips around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-zinc-50">
          <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <Link
                href="/"
                className="text-sm font-semibold tracking-tight text-zinc-900"
              >
                Travel Land
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/upcoming-trips"
                  className="text-zinc-700 hover:text-zinc-900"
                >
                  Upcoming trips
                </Link>
                <Link
                  href="/travel-history"
                  className="text-zinc-700 hover:text-zinc-900"
                >
                  Past trips
                </Link>
                <Link
                  href="/who-we-are"
                  className="text-zinc-700 hover:text-zinc-900"
                >
                  About
                </Link>
                <Link
                  href="/contacts"
                  className="text-zinc-700 hover:text-zinc-900"
                >
                  Contacts
                </Link>
                <AuthNavButton />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-xs text-zinc-500">
              <p>© {new Date().getFullYear()} Travel Land. All rights reserved.</p>
              <div className="flex gap-4">
                <a
                  href="/contacts"
                  className="hover:text-zinc-700"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="hover:text-zinc-700"
                >
                  Terms
                </a>
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
