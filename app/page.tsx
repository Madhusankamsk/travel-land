import Image from "next/image";
import Link from "next/link";
import { AnimatedStat } from "@/components/animated-stat";
import { HeroSearchSection } from "@/components/hero-search-section";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

const DESTINATIONS = [
  {
    city: "Roma",
    region: "Lazio, Italy",
    title: "Roma Eterna — 7 Nights",
    description:
      "Private Colosseum access, Vatican at dawn, hidden rioni and Michelin dining.",
    price: "€6,400",
    badge: "Bestseller",
    stars: 5,
    gradient: "from-[#3A2E1C] to-[#6B3A2A]",
    image: "/leopard.jpeg",
  },
  {
    city: "Venezia",
    region: "Veneto, Italy",
    title: "La Serenissima — 5 Nights",
    description:
      "Private gondola, Palazzo stay, Murano glass workshop, exclusive Biennale access.",
    price: "€9,200",
    badge: "Exclusive",
    badgeGold: true,
    stars: 5,
    gradient: "from-[#1A4A70] to-[#2E6B9E]",
    image: "/travel-1.jpeg",
  },
  {
    city: "Toscana",
    region: "Tuscany, Italy",
    title: "Chianti Harvest Week",
    description:
      "Participate in the vendemmia, private cellar tastings, villa stay, truffle hunting.",
    price: "€5,800",
    badge: "Limited Slots",
    stars: 4,
    gradient: "from-[#2D6A4F] to-[#5B8C3B]",
    image: "/beach.jpeg",
  },
];

const STATS = [
  { value: "500", suffix: "+", label: "Curated Tours" },
  { value: "98", suffix: "%", label: "Guest Satisfaction" },
  { value: "12", suffix: "", label: "Italian Regions" },
  { value: "40", suffix: "+", label: "Countries Served" },
];

const REVIEWS = [
  {
    stars: 5,
    quote:
      "An experience that transcended every expectation. Our Travel Designer thought of everything — from a private Mass in the Sistine Chapel to a last-minute table at Le Calandre.",
    name: "Jonathan & Maria Whittaker",
    location: "London, UK · Rome & Tuscany",
    initials: "JM",
  },
  {
    stars: 5,
    quote:
      "The Amalfi itinerary was nothing short of perfection. Every villa, every meal, every sunset was curated with extraordinary attention to detail.",
    name: "Chen Li & David Park",
    location: "Singapore · Amalfi Coast",
    initials: "CL",
  },
  {
    stars: 5,
    quote:
      "We've traveled with many luxury operators — TRAVEL-LAND.IT is in a class of its own. The Venice experience was pure magic from start to finish.",
    name: "Fatima Al-Rashid",
    location: "Dubai, UAE · Venice & Lake Como",
    initials: "FA",
  },
  {
    stars: 5,
    quote:
      "Tuscany in harvest season exceeded every dream. The private vineyard dinner and truffle experience were once-in-a-lifetime moments.",
    name: "Michael & Sarah Brenner",
    location: "Munich, Germany · Tuscany",
    initials: "MB",
  },
  {
    stars: 5,
    quote:
      "From the moment we landed in Naples to our last evening in Positano, every detail was flawless. The boat day along the coast was unforgettable.",
    name: "James & Elena Torres",
    location: "Madrid, Spain · Amalfi Coast",
    initials: "JT",
  },
  {
    stars: 5,
    quote:
      "Our family of five had the trip of a lifetime. The team arranged kid-friendly Colosseum access and a cooking class we still talk about.",
    name: "David & Rachel Kim",
    location: "Seoul, South Korea · Rome & Florence",
    initials: "DK",
  },
  {
    stars: 5,
    quote:
      "Lake Como was pure romance. The villa, the boat, the gardens — we felt like we had Italy to ourselves. Already planning our return.",
    name: "Thomas & Isabelle Moreau",
    location: "Paris, France · Lake Como",
    initials: "TM",
  },
  {
    stars: 5,
    quote:
      "The food experiences alone were worth the journey. Michelin dinners, family trattorias, and a secret pasta lesson in Bologna.",
    name: "Anna & Marco Rossi",
    location: "Milan, Italy · Bologna & Emilia-Romagna",
    initials: "AR",
  },
  {
    stars: 5,
    quote:
      "Sicily surprised us in the best way. Ancient ruins, stunning coastlines, and hospitality that made us feel like family.",
    name: "William & Sophie Clarke",
    location: "Sydney, Australia · Sicily",
    initials: "WC",
  },
  {
    stars: 5,
    quote:
      "Our honeymoon was everything we hoped for. Private Vatican at dawn, a sunset over the Tiber — TRAVEL-LAND.IT made it magical.",
    name: "Alex & Jordan Taylor",
    location: "New York, USA · Rome & Amalfi",
    initials: "AT",
  },
  {
    stars: 5,
    quote:
      "The attention to logistics was remarkable. Every transfer, every reservation, every surprise was executed perfectly. Zero stress.",
    name: "Hans & Ingrid Weber",
    location: "Zurich, Switzerland · Venice & Dolomites",
    initials: "HW",
  },
  {
    stars: 5,
    quote:
      "We've recommended TRAVEL-LAND.IT to everyone. Our second trip with them — Puglia — was just as exceptional as the first.",
    name: "Robert & Linda Chen",
    location: "Toronto, Canada · Puglia",
    initials: "RC",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-oro">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-sm">
          {i < count ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ==================== HERO + SEARCH (Airbnb-style expand) ==================== */}
      <HeroSearchSection />

      {/* ==================== FEATURED DESTINATIONS ==================== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            Curated Destinations
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian">
            Where Will Italy Take You?
          </h2>
          <p className="mb-12 max-w-[640px] text-[15px] leading-relaxed text-obsidian/65">
            Each journey is handcrafted by our in-country specialists, blending
            cultural depth with effortless luxury logistics across Italy&apos;s
            most coveted regions.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((dest) => (
              <article
                key={dest.city}
                className="group cursor-pointer overflow-hidden rounded-[20px] border border-bone bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              >
                {/* Image or gradient placeholder */}
                <div className="relative h-[220px] overflow-hidden">
                  {"image" in dest && dest.image ? (
                    <>
                      <Image
                        src={dest.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,23,20,0.2)_0%,rgba(107,58,42,0.35)_50%,rgba(26,23,20,0.6)_100%)]"
                        aria-hidden
                      />
                    </>
                  ) : (
                    <div
                      className={`flex h-full w-full items-end bg-gradient-to-br ${dest.gradient} p-4 font-[family-name:var(--font-cormorant)] text-5xl font-light italic text-white/40 transition-transform duration-500 group-hover:scale-105`}
                    >
                      {dest.city}
                    </div>
                  )}
                  <span
                    className={`absolute top-4 left-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
                      dest.badgeGold
                        ? "bg-oro/90 text-obsidian"
                        : "bg-obsidian/70 text-champagne"
                    }`}
                  >
                    {dest.badge}
                  </span>
                </div>

                <div className="p-6">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-terracotta">
                    {dest.region}
                  </p>
                  <h3 className="mb-2 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-obsidian">
                    {dest.title}
                  </h3>
                  <p className="mb-4 text-[13px] leading-relaxed text-[#7A7060]">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-bone pt-4">
                    <div>
                      <p className="text-[11px] text-[#7A7060]">From</p>
                      <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium text-obsidian">
                        {dest.price}{" "}
                        <span className="text-[13px] opacity-60">pp</span>
                      </p>
                    </div>
                    <StarRating count={dest.stars} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT US ==================== */}
      <section className="relative overflow-hidden py-16 lg:py-24" aria-labelledby="about-us-heading">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/background-img-1.jpeg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
        </div>
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-[#1A1714]/88"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-20">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8D5A3]">
            Who We Are
          </p>
          <h2
            id="about-us-heading"
            className="mb-4 text-center font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-[#F0EAE0]"
          >
            Crafting Bespoke Italian Journeys
          </h2>
          <p className="mx-auto mb-12 max-w-[640px] text-center text-[15px] leading-relaxed text-[#B5A890]">
            We are a team of in-country travel experts passionate about Italy. From private Vatican access to hidden trattorias and villa stays, we design journeys that blend cultural depth with effortless luxury—exclusively for the discerning traveler.
          </p>
          <div className="mx-auto mb-12 grid max-w-[1440px] grid-cols-2 gap-4 sm:grid-cols-4">
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

      {/* ==================== FEATURED PACKAGE ==================== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <article className="overflow-hidden rounded-[20px] border border-bone bg-white shadow-[var(--shadow-sm)] lg:grid lg:grid-cols-[280px_1fr]">
            {/* Image placeholder */}
            <div className="relative flex min-h-[240px] items-end bg-gradient-to-br from-[#8B6914] to-[#B8963E] p-6 lg:min-h-full">
              <span className="font-[family-name:var(--font-cormorant)] text-[56px] font-light italic leading-none text-white/90 drop-shadow-lg">
                Amalfi
              </span>
            </div>

            <div className="flex flex-col justify-between p-6 lg:p-8">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-oro/30 bg-oro/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-bronze">
                    ✦ Luxury
                  </span>
                  <span className="rounded-full border border-azure/25 bg-azure/8 px-2.5 py-1 text-[11px] font-medium tracking-wide text-azure">
                    Bestseller
                  </span>
                  <span className="rounded-full border border-bone px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#7A7060]">
                    8 Days
                  </span>
                  <span className="rounded-full border border-bone px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#7A7060]">
                    Coastal
                  </span>
                </div>
                <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian">
                  The Amalfi Coast in Full
                </h3>
                <div className="mb-4 flex flex-wrap gap-6">
                  <span className="text-[13px] text-[#7A7060]">
                    <strong className="font-medium text-obsidian">
                      8 nights
                    </strong>{" "}
                    · 4 villas
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    Private transfers
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    Yacht day charter
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    2 Michelin dinners
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#7A7060]">
                  From Positano to Ravello, this curated itinerary traces the
                  world&apos;s most photographed coastline in private style —
                  with exclusive villa access, a full-day yacht charter, and an
                  intimate cooking class with a local chef.
                </p>
              </div>

              <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-bone pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] text-[#7A7060]">From</p>
                  <p className="font-[family-name:var(--font-cormorant)] text-[32px] font-medium text-obsidian">
                    €11,400{" "}
                    <span className="text-sm opacity-50">per person</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/upcoming-trips"
                    className="inline-flex items-center rounded-full border border-bone bg-white px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:border-obsidian hover:bg-travertine"
                  >
                    View Details
                  </Link>
                  <Link
                    href="/contacts"
                    className="inline-flex items-center rounded-full bg-oro px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
                  >
                    Inquire Now
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="bg-parchment py-16 lg:py-24" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            Guest Stories
          </p>
          <h2
            id="testimonials-heading"
            className="mb-12 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            What Our Travelers Say
          </h2>
          <TestimonialsCarousel reviews={REVIEWS} />
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="relative overflow-hidden bg-obsidian py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(184,150,62,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(46,107,158,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-20">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
            Your Journey Begins Here
          </p>
          <h2 className="mx-auto mb-6 max-w-[700px] font-[family-name:var(--font-cormorant)] text-[clamp(28px,5vw,56px)] font-normal leading-tight tracking-tighter text-[#F0EAE0]">
            Begin Planning Your{" "}
            <em className="text-champagne">Italian Journey</em>
          </h2>
          <p className="mx-auto mb-10 max-w-[480px] text-base leading-relaxed text-[#B5A890]">
            Speak with a dedicated Travel Designer who will craft your perfect
            Italian experience from the very first conversation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
            >
              Start Planning
            </Link>
            <Link
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10"
            >
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
