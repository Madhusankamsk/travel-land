import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedStat } from "@/components/animated-stat";
import { InnerPageHero } from "@/components/inner-page-hero";

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
      <InnerPageHero
        title="About Us"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* Who We Are — placed before Our Story; introduces mission & vision */}
      <section
        className="bg-travertine py-16 lg:py-24"
        aria-labelledby="who-we-are-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
              Who We Are
            </p>
            <h2
              id="who-we-are-heading"
              className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-obsidian"
            >
              Our Mission &amp; Vision
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#7A7060]">
              We are Italian travel specialists dedicated to designing journeys
              that feel effortless, personal, and deeply connected to place.
              Every itinerary is handcrafted by in-country experts who treat
              your time as the rarest luxury.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <article className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-parchment text-terracotta"
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3l2.5 5.1 5.6.8-4.1 4 1 5.6L12 16.7 7 18.5l1-5.6-4.1-4 5.6-.8L12 3z" />
                  </svg>
                </span>
                <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                  Our Mission
                </h3>
              </div>
              <p className="text-[15px] leading-[1.65] text-[#7A7060]">
                Our mission is to remove every friction between you and the Italy
                you dream of—curating private, design-forward experiences that
                honour local culture, support trusted partners, and leave you
                free to simply arrive and enjoy.
              </p>
            </article>

            <article className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-parchment text-terracotta"
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" />
                  </svg>
                </span>
                <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                  Our Vision
                </h3>
              </div>
              <p className="text-[15px] leading-[1.65] text-[#7A7060]">
                Our vision is to be Italy&apos;s most trusted luxury travel
                partner—where every journey feels singular, relationships last
                well beyond the final transfer, and travel becomes a meaningful
                part of your life story, not just a holiday.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Our Story — space-16 (64px) between major sections; design system: eyebrow 10–11px 600 uppercase 0.12em terracotta; Title/Headline Cormorant; body DM Sans 16px #7A7060 secondary */}
      <section
        className="bg-parchment py-16 lg:py-24"
        aria-labelledby="our-story-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="text-center md:text-left">
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
                TRAVEL-LAND.IT was born from a simple belief: the best of Italy
                is not in brochures—it is in the hands of people who live it.
                Since 2015 we have been connecting discerning travelers with
                private access, rare experiences, and the kind of hospitality
                that turns a trip into a lifelong memory.
              </p>
              <p className="text-[15px] leading-[1.65] text-[#7A7060]">
                We do not run group tours. We do not sell fixed packages. We
                listen, we design, and we deliver one-of-a-kind journeys across
                Rome, Venice, Florence, the Amalfi Coast, Tuscany, and
                beyond—backed by our ASTA membership and ILTM Select
                Partnership.
              </p>
            </div>

            <div className="relative h-[260px] overflow-hidden rounded-[24px] border border-bone bg-obsidian/80 shadow-[var(--shadow-lg)] md:h-[320px]">
              <Image
                src="/our-history.jpeg"
                alt="Private Italian travel experience overlooking the sea at sunset"
                fill
                priority={false}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover object-center opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values — design system: cards white bg, bone border, radius-xl (20px), shadow-sm; hover shadow-lg translateY(-4px); Title Cormorant 22px/500; body 13–15px #7A7060 */}
      <section
        className="bg-travertine py-16 lg:py-24"
        aria-labelledby="values-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
            What We Stand For
          </p>
          <h2
            id="values-heading"
            className="mb-6 text-center font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            Why Travel With Us
          </h2>

          <p className="mx-auto mb-10 max-w-[640px] text-center text-[15px] leading-[1.65] text-[#7A7060]">
            We are more than a booking service. From the first conversation to
            your final transfer, your dedicated Travel Designer and our
            in-country partners are focused on one thing.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((item) => (
              <article
                key={item.title}
                className="rounded-[20px] border border-bone bg-white p-8 text-center shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="mb-4 flex justify-center">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-parchment text-terracotta"
                    aria-hidden
                  >
                    {item.title === "In-country expertise" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s6-5.2 6-11a6 6 0 10-12 0c0 5.8 6 11 6 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    )}
                    {item.title === "Bespoke only" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" />
                        <path d="M14.5 6.5l3 3" />
                      </svg>
                    )}
                    {item.title === "Trusted partnerships" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 11l3 3 7-7" />
                        <path d="M4 12a5 5 0 015-5h2" />
                        <path d="M20 12a5 5 0 01-5 5h-2" />
                      </svg>
                    )}
                    {item.title === "No group tours" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 7a3 3 0 116 0 3 3 0 01-6 0z" />
                        <path d="M4 20a5 5 0 0116 0" />
                        <path d="M4 4l16 16" />
                      </svg>
                    )}
                  </span>
                </div>
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

      {/* Upcoming Tours CTA — design-system banner, dark image bg + gold CTA */}
      <section
        className="relative overflow-hidden py-16 lg:py-20"
        aria-labelledby="upcoming-cta-heading"
      >
        <div className="absolute inset-0">
          <Image
            src="/cta-bg.png"
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Design-system CTA overlay: cinematic gradients + obsidian veil */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(184,150,62,0.18)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(46,107,158,0.16)_0%,transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[#1A1714]/55"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
            Upcoming small-group journeys
          </p>
          <h2
            id="upcoming-cta-heading"
            className="mx-auto mb-4 max-w-[820px] font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,44px)] font-medium italic leading-tight text-champagne"
          >
            Join a limited-edition journey through Italy, crafted by in-country
            experts.
          </h2>

          <div className="flex justify-center">
            <Link
              href="/upcoming-trips"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-[0.04em] text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian active:scale-[0.97]"
            >
              View upcoming tours
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — two-column card grid, aligned with design system */}
      <section
        className="bg-travertine py-16"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-[960px] px-6 lg:px-20">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className="mb-8 text-center font-[family-name:var(--font-cormorant)] text-[clamp(26px,3.5vw,36px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            Answers before you enquire
          </h2>
          <p className="mx-auto mb-8 max-w-[640px] text-center text-[15px] leading-[1.65] text-[#7A7060]">
            From how bespoke each itinerary is to what happens if plans change
            while you are in Italy, these answers cover the questions guests ask
            most often before they begin designing their journey with us.
          </p>

          <div className="columns-1 gap-4 md:columns-2">
            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  Do you only plan trips within Italy?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                Italy is our home and our focus. We specialise in journeys
                across Rome, Florence, Venice, the Amalfi Coast, Tuscany and
                other regions, and can coordinate select extensions to nearby
                European cities on request.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  How bespoke is each itinerary?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                Every journey is designed from scratch around your dates, pace,
                interests and budget. We do not sell pre-set group tours or
                generic packages — your Travel Designer curates hotels,
                experiences and logistics specifically for you.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  What is the process once I enquire?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                After you share a few details, your dedicated Travel Designer
                will arrange a call to understand your plans in depth. We then
                craft a tailored proposal, refine it with you, and take care of
                confirmations, payments and on-the-ground support.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  Can you help with special occasions and celebrations?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                Absolutely. We regularly design honeymoons, anniversaries,
                milestone birthdays and multi-generational journeys, including
                private venues, chefs and experiences tailored to your
                celebration.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  How far in advance should I start planning?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                For peak seasons (spring, early summer, September) we recommend
                beginning 6–9 months in advance. For quieter periods, 3–4 months
                is often sufficient, but the earlier we begin, the more options
                we can secure for you.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  What types of travelers do you work with?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                We design journeys for couples, families, friends travelling
                together and small private groups. What unites our guests is not
                age, but a preference for thoughtful details, comfort and
                authentic connection to place.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  Do you assist with flights and travel?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                We focus on the in-country experience in Italy, but we are happy
                to advise on ideal flight timings and routes, and can connect you
                with trusted partners for international flights and comprehensive
                travel insurance.
              </div>
            </details>

            <details className="mb-4 break-inside-avoid group rounded-[16px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[var(--shadow-lg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-6 py-5 text-left">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium leading-snug text-obsidian">
                  What happens if plans change while I&apos;m in Italy?
                </span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-bone text-[13px] text-obsidian transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-[14px] leading-[1.7] text-[#7A7060]">
                Your Travel Designer and our on-the-ground team remain available
                throughout your stay to assist with adjustments, from shifting
                dinner reservations to reworking a day due to weather or
                transport changes.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA — homepage-style cinematic banner */}
      <section
        className="relative overflow-hidden bg-obsidian py-20 lg:py-28"
        aria-labelledby="about-cta-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(184,150,62,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(46,107,158,0.10)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-20">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
            Your next Italian journey
          </p>
          <h2
            id="about-cta-heading"
            className="mx-auto mb-6 max-w-[700px] font-[family-name:var(--font-cormorant)] text-[clamp(28px,5vw,56px)] font-normal italic leading-tight tracking-tighter text-[#F0EAE0]"
          >
            “Every great trip begins with a conversation.”
          </h2>
          <p className="mx-auto mb-8 max-w-[560px] text-[15px] leading-relaxed text-[#B5A890]">
            Share a few details about how you like to travel, and our in-country
            team will design a journey that feels crafted just for you — from
            first call to final farewell.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian active:scale-[0.97]"
            >
              Request your bespoke itinerary
            </Link>
            <Link
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
            >
              View upcoming tours
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
