import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InnerPageHero } from "@/components/inner-page-hero";

export const metadata: Metadata = {
  title: "Sustainable Tourism — TRAVEL-LAND.IT",
  description:
    "Discover how TRAVEL-LAND.IT practices responsible tourism in Italy and beyond — from environmental protection to partnerships like IBO Italia and traveler guidelines.",
};

export default function SustainableTourismPage() {
  return (
    <main className="min-h-screen bg-travertine">
      <InnerPageHero
        title="Sustainable Tourism"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sustainable Tourism" },
        ]}
      />

      {/* Intro + image, aligned with About/Our Story layout */}
      <section
        className="bg-travertine py-16 lg:py-24"
        aria-labelledby="sustainable-tourism-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                Sustainable &amp; Responsible Travel
              </p>
              <h1
                id="sustainable-tourism-heading"
                className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-obsidian"
              >
                Travel that leaves a positive legacy
              </h1>
              <p className="mb-4 text-[15px] leading-[1.65] text-[#7A7060]">
                At TRAVEL-LAND.IT we believe that every journey should create a positive legacy —
                for the people who welcome us, for the landscapes we cross, and for the cultures we
                are invited to experience.
              </p>
              <p className="text-[15px] leading-[1.65] text-[#7A7060]">
                This page shares how we understand responsible tourism, the partners we trust, and
                simple ways you can help protect the places you love to visit.
              </p>
            </div>

            <div className="relative h-[260px] overflow-hidden rounded-[24px] border border-bone bg-obsidian/80 shadow-[var(--shadow-lg)] md:h-[320px]">
              <Image
                src="/sustainable-tourism.jpeg"
                alt="Terraced vineyards and coastal landscape in Italy at golden hour"
                fill
                priority={false}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover object-center opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content blocks — cards, aligned with About page structure */}
      <section className="bg-parchment py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="space-y-16 lg:space-y-20">
            {/* 1. What is Responsible Tourism? */}
            <section
              aria-labelledby="responsible-tourism-title"
              className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] lg:p-8"
            >
              <h2
                id="responsible-tourism-title"
                className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian"
              >
                What is Responsible Tourism?
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-obsidian/80">
                Responsible tourism is tourism implemented according to principles of social and
                economic justice and with full respect for the environment and cultures. It focuses
                on minimizing negative impacts while maximizing benefits for local communities,
                heritage, and ecosystems.
              </p>
              <p className="mb-5 text-[15px] leading-relaxed text-obsidian/80">
                It encourages travelers, tour operators, and local communities to work together to
                protect natural resources and cultural traditions while creating meaningful travel
                experiences.
              </p>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                Key principles
              </h3>
              <ul className="grid gap-2 text-[14px] leading-relaxed text-[#7A7060] sm:grid-cols-2">
                <li className="flex gap-2">
                  <span className="mt-[2px] text-terracotta">•</span>
                  <span>Protecting natural environments</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-terracotta">•</span>
                  <span>Respecting local cultures and traditions</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-terracotta">•</span>
                  <span>Supporting local economies</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-terracotta">•</span>
                  <span>Promoting ethical travel practices</span>
                </li>
                <li className="flex gap-2 sm:col-span-2">
                  <span className="mt-[2px] text-terracotta">•</span>
                  <span>Reducing environmental impact</span>
                </li>
              </ul>
            </section>

            {/* 3. Our Commitment to Responsible Travel */}
            <section
              aria-labelledby="our-commitment-title"
              className="rounded-[20px] border border-bone bg-parchment/70 p-6 shadow-[var(--shadow-sm)] lg:p-8"
            >
              <h2
                id="our-commitment-title"
                className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian"
              >
                Our Commitment
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-obsidian/80">
                Travel Land is committed to promoting responsible tourism through sustainable
                practices and ethical partnerships. Every itinerary is designed to balance discovery,
                comfort, and care for the destinations we love.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[16px] bg-white/80 p-4">
                  <h3 className="mb-1 text-[14px] font-semibold text-obsidian">
                    🌿 Environmental Protection
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#7A7060]">
                    We support eco-friendly tourism practices that reduce waste, conserve resources,
                    and protect wildlife habitats.
                  </p>
                </div>
                <div className="rounded-[16px] bg-white/80 p-4">
                  <h3 className="mb-1 text-[14px] font-semibold text-obsidian">
                    🤝 Supporting Local Communities
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#7A7060]">
                    We prioritize working with local guides, businesses, and accommodation providers
                    to strengthen local economies.
                  </p>
                </div>
                <div className="rounded-[16px] bg-white/80 p-4">
                  <h3 className="mb-1 text-[14px] font-semibold text-obsidian">
                    🏛 Respect for Culture and Heritage
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#7A7060]">
                    Our tours encourage travelers to appreciate and respect local traditions,
                    customs, and historical heritage.
                  </p>
                </div>
                <div className="rounded-[16px] bg-white/80 p-4">
                  <h3 className="mb-1 text-[14px] font-semibold text-obsidian">
                    🌍 Sustainable Tourism Development
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#7A7060]">
                    We aim to develop tourism experiences that protect destinations for future
                    generations.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. How We Practice Responsible Tourism */}
            <section
              aria-labelledby="how-we-practice-title"
              className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] lg:p-8"
            >
              <h2
                id="how-we-practice-title"
                className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian"
              >
                How We Put This Into Action
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-obsidian/80">
                Travel Land applies responsible tourism principles through several concrete
                initiatives in the way we design, operate, and continually refine our journeys.
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[#7A7060]">
                <li>Working with local tour operators and small businesses</li>
                <li>Choosing eco-friendly hotels and accommodations</li>
                <li>Encouraging low-impact travel experiences</li>
                <li>Supporting community-based tourism projects</li>
                <li>
                  Partnering with organizations that contribute to local schools, hospitals, and
                  development programs
                </li>
              </ul>
              <p className="text-[14px] leading-relaxed text-obsidian/80">
                We also encourage travelers to be mindful of their environmental and social impact
                during their journeys, so that every trip leaves destinations better than we found
                them.
              </p>
            </section>

            {/* 5. Partner Organizations */}
            <section
              aria-labelledby="partners-title"
              className="rounded-[20px] border border-bone bg-parchment/70 p-6 shadow-[var(--shadow-sm)] lg:p-8"
            >
              <h2
                id="partners-title"
                className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian"
              >
                Our Sustainable Tourism Partners
              </h2>
              <div className="rounded-[16px] bg-white/80 p-5 lg:p-6">
                <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                  IBO Italia
                </h3>
                <p className="mb-3 text-[14px] leading-relaxed text-obsidian/80">
                  IBO Italia is a Christian-inspired non-governmental organization dedicated to
                  national and international volunteer work.
                </p>
                <p className="mb-3 text-[14px] leading-relaxed text-obsidian/80">
                  Founded in Northern Europe in 1953, the organization began with work camps helping
                  rebuild homes for refugees after the Second World War. IBO stands for{" "}
                  <em>Internationale Bouworde</em>, meaning International Building Partners.
                </p>
                <p className="mb-3 text-[14px] leading-relaxed text-obsidian/80">
                  The organization has been active in Italy since 1957 and was officially
                  established as an association in 1968. IBO Italia is recognized by the Italian
                  Ministry of Foreign Affairs for its work in international cooperation and is part
                  of the CCIVS – Coordination Committee for International Civil Service at UNESCO.
                </p>
                <p className="text-[14px] leading-relaxed text-obsidian/80">
                  Through partnerships with organizations like IBO, Travel Land supports initiatives
                  that promote social development and community empowerment.
                </p>
              </div>
            </section>

            {/* 6. Responsible Travel Guidelines for Travelers */}
            <section
              aria-labelledby="guidelines-title"
              className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] lg:p-8"
            >
              <h2
                id="guidelines-title"
                className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian"
              >
                How You Can Travel Responsibly
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-obsidian/80">
                We invite every traveler to become an active partner in sustainable tourism by
                embracing a few simple, thoughtful practices.
              </p>
              <ul className="space-y-2 text-[14px] leading-relaxed text-[#16513A]">
                <li>✔ Respect local traditions and cultural practices</li>
                <li>✔ Reduce plastic waste and litter</li>
                <li>✔ Support local businesses and artisans</li>
                <li>✔ Protect wildlife and natural habitats</li>
                <li>✔ Conserve water and energy</li>
                <li>
                  ✔ Report environmental or social issues observed during your travels to local
                  authorities or your Travel Land contact
                </li>
              </ul>
              <p className="mt-5 text-[14px] leading-relaxed text-obsidian/80">
                Together, we can create a positive impact on the places we visit and ensure that
                future generations can experience the same beauty, culture, and generosity that make
                travel so transformative.
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* CTA — cinematic banner encouraging responsible travel enquiries */}
      <section
        className="relative overflow-hidden bg-obsidian py-20 lg:py-28"
        aria-labelledby="sustainable-cta-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(184,150,62,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(46,107,158,0.10)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-20">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
            Design your responsible journey
          </p>
          <h2
            id="sustainable-cta-heading"
            className="mx-auto mb-6 max-w-[700px] font-[family-name:var(--font-cormorant)] text-[clamp(28px,5vw,56px)] font-normal italic leading-tight tracking-tighter text-[#F0EAE0]"
          >
            “Luxury travel can be gentle on the places we love — when it is designed with care.”
          </h2>
          <p className="mx-auto mb-8 max-w-[560px] text-[15px] leading-relaxed text-[#B5A890]">
            Share how you like to travel and we will craft an itinerary that balances comfort,
            culture, and sustainability — from low-impact experiences to local-first partnerships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian active:scale-[0.97]"
            >
              Request a sustainable itinerary
            </Link>
            <Link
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
            >
              View upcoming journeys
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
