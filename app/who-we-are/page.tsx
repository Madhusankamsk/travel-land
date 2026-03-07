import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedStat } from "@/components/animated-stat";

export const metadata: Metadata = {
  title: "About Us — TRAVEL-LAND.IT",
  description:
    "We are in-country travel experts crafting bespoke Italian journeys. ASTA Member · ILTM Select Partner. Our story, values, and commitment to luxury travel.",
};

const STATS = [
  { value: "500", suffix: "+", label: "Curated Tours" },
  { value: "98", suffix: "%", label: "Guest Satisfaction" },
  { value: "12", suffix: "", label: "Italian Regions" },
  { value: "40", suffix: "+", label: "Countries Served" },
];

const VALUES = [
  {
    title: "In-country expertise",
    description:
      "Our team lives in Italy. We know the hidden trattorias, the private keys to palazzi, and the seasons when each region shines.",
  },
  {
    title: "Bespoke only",
    description:
      "No set itineraries. Every journey is designed from scratch around your pace, interests, and the moments you want to remember.",
  },
  {
    title: "Trusted partnerships",
    description:
      "ASTA Member and ILTM Select Partner. We work only with vetted guides, properties, and experiences that meet our standards.",
  },
  {
    title: "No group tours",
    description:
      "Your trip is yours alone—private transfers, private access, and dedicated attention from your Travel Designer from first call to farewell.",
  },
];

export default function WhoWeArePage() {
  return (
    <main className="min-h-screen bg-travertine">
      {/* Breadcrumb — design system: 13px #7A7060, › #B5A890, active obsidian 500 */}
      <nav
        className="border-b border-bone bg-travertine py-4"
        aria-label="Breadcrumb"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#7A7060]">
            <li>
              <Link
                href="/"
                className="transition-colors duration-150 hover:text-obsidian"
              >
                Home
              </Link>
            </li>
            <li className="text-[#B5A890]" aria-hidden>
              ›
            </li>
            <li className="font-medium text-obsidian" aria-current="page">
              About Us
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero — design system: Obsidian bg, radius-2xl (32px), padding 96px 64px, min-height 400px; eyebrow 11px uppercase gold; title clamp(36px, 5vw, 64px) Cormorant 400 #F0EAE0; subtitle 16px #B5A890; Gold CTA + Ghost */}
      <section
        className="px-6 py-16 lg:px-20 lg:py-24"
        aria-labelledby="about-hero-heading"
      >
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[32px] min-h-[400px]">
          <div className="absolute inset-0">
            <Image
            src="/background-img-1.jpeg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          </div>
          <div
            className="absolute inset-0 bg-obsidian/88"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(26,23,20,0.4) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[400px] flex-col justify-end px-8 py-12 lg:px-16 lg:py-24">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
              About Us
            </p>
            <h1
              id="about-hero-heading"
              className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(36px,5vw,64px)] font-normal leading-[1.1] tracking-tight text-[#F0EAE0]"
            >
              Crafting <em className="text-champagne">Bespoke</em> Italian
              Journeys
            </h1>
            <p className="mb-8 max-w-[560px] text-[16px] leading-relaxed text-[#B5A890]">
              We are a team of in-country travel experts passionate about Italy.
              From private Vatican access to hidden trattorias and villa stays,
              we design journeys that blend cultural depth with effortless
              luxury—exclusively for the discerning traveler.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contacts"
                className="inline-flex items-center rounded-full bg-oro px-7 py-4 text-base font-medium tracking-[0.04em] text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                Get in Touch
              </Link>
              <Link
                href="/upcoming-trips"
                className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-7 py-4 text-base font-medium tracking-[0.04em] text-[#F0EAE0] transition-colors duration-150 hover:border-white/50 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                View Upcoming Trips
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — design system: 4-col grid; AnimatedStat uses liquid-surface-dark (dark cards); overlap hero with -mt for continuity */}
      <section className="relative z-10 -mt-4 px-6 lg:px-20" aria-label="Our reach">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <AnimatedStat
                key={stat.label}
                value={parseInt(stat.value, 10)}
                suffix={stat.suffix ?? ""}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story — space-16 (64px) between major sections; design system: eyebrow 10–11px 600 uppercase 0.12em terracotta; Title/Headline Cormorant; body DM Sans 16px #7A7060 secondary */}
      <section
        className="py-16 lg:py-24"
        aria-labelledby="our-story-heading"
      >
        <div className="mx-auto max-w-[720px] px-6 text-center lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
            Our Story
          </p>
          <h2
            id="our-story-heading"
            className="mb-6 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            Italy, Curated for You
          </h2>
          <p className="mb-6 text-[16px] leading-[1.65] text-obsidian">
            TRAVEL-LAND.IT was born from a simple belief: the best of Italy is
            not in brochures—it is in the hands of people who live it. Since
            2015 we have been connecting discerning travelers with private
            access, rare experiences, and the kind of hospitality that turns a
            trip into a lifelong memory.
          </p>
          <p className="text-[15px] leading-[1.65] text-[#7A7060]">
            We do not run group tours. We do not sell fixed packages. We listen,
            we design, and we deliver one-of-a-kind journeys across Rome, Venice,
            Florence, the Amalfi Coast, Tuscany, and beyond—backed by our ASTA
            membership and ILTM Select Partnership.
          </p>
        </div>
      </section>

      {/* Values — design system: cards white bg, bone border, radius-xl (20px), shadow-sm; hover shadow-lg translateY(-4px); Title Cormorant 22px/500; body 13–15px #7A7060 */}
      <section
        className="bg-parchment py-16 lg:py-24"
        aria-labelledby="values-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
            What We Stand For
          </p>
          <h2
            id="values-heading"
            className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            Why Travel With Us
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((item) => (
              <article
                key={item.title}
                className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              >
                <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-[#7A7060]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — design system: one Gold CTA per section; Secondary for second; 64px section spacing */}
      <section
        className="py-16 lg:py-24"
        aria-label="Start your journey"
      >
        <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-20">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium italic leading-tight text-obsidian">
            Ready to write your Italian story?
          </h2>
          <p className="mx-auto mb-8 max-w-[480px] text-[15px] leading-[1.65] text-[#7A7060]">
            Tell us your dreams. We&apos;ll design the journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-[0.04em] text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-travertine active:scale-[0.97]"
            >
              Get in Touch
            </Link>
            <Link
              href="/upcoming-trips"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-[1.5px] border-bone bg-white px-8 py-4 text-base font-medium tracking-[0.04em] text-obsidian transition-all duration-150 hover:border-obsidian/30 hover:bg-travertine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-travertine active:scale-[0.97]"
            >
              View Upcoming Trips
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
