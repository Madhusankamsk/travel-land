import Link from "next/link";

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
      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden bg-obsidian">
        {/* Placeholder background — replace with real hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1714] via-[#2E2921] to-[#1A4A70]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(26,23,20,0.8)_0%,transparent_60%),radial-gradient(ellipse_80%_80%_at_20%_20%,rgba(46,107,158,0.15)_0%,transparent_50%),radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(184,150,62,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-12 pt-32 lg:px-20 lg:pb-16">
          <div className="max-w-[700px]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
              Featured Journey · Autumn 2025
            </p>
            <h1 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(36px,6vw,80px)] font-normal leading-[1.1] tracking-tighter text-[#F0EAE0]">
              Discover <em className="text-champagne">Italia</em>
              <br />
              Like Never Before
            </h1>
            <p className="mb-8 max-w-[520px] text-base leading-relaxed text-[#B5A890]">
              Seven nights of absolute immersion — private Colosseum access,
              Vatican at dawn, and the finest tables in the Eternal City. Crafted
              exclusively for the discerning traveler.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/upcoming-trips"
                className="inline-flex items-center rounded-full bg-oro px-7 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
              >
                Begin Planning
              </Link>
              <Link
                href="/catalogs"
                className="inline-flex items-center rounded-full px-7 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10"
              >
                View Itineraries
              </Link>
            </div>
          </div>

          {/* Booking Search Bar */}
          <div className="relative z-10 mt-10 grid grid-cols-1 gap-[1px] overflow-hidden rounded-xl border border-bone bg-white shadow-[var(--shadow-xl)] sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="cursor-pointer rounded-lg p-4 transition-colors duration-150 hover:bg-travertine sm:border-r sm:border-bone">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                Destination
              </p>
              <p className="text-[15px] font-medium text-obsidian">
                Where to?
              </p>
            </div>
            <div className="cursor-pointer rounded-lg p-4 transition-colors duration-150 hover:bg-travertine sm:border-r sm:border-bone">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                Check In
              </p>
              <p className="text-[15px] text-[#B5A890]">Select date</p>
            </div>
            <div className="cursor-pointer rounded-lg p-4 transition-colors duration-150 hover:bg-travertine">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                Travelers
              </p>
              <p className="text-[15px] text-[#B5A890]">2 adults</p>
            </div>
            <div className="flex items-center p-3">
              <button className="inline-flex w-full items-center justify-center rounded-full bg-obsidian px-7 py-3.5 text-sm font-medium tracking-wide text-[#F0EAE0] transition-all duration-150 hover:bg-[#2E2921] hover:shadow-[var(--shadow-md)]">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

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
                {/* Image placeholder */}
                <div className="relative h-[220px] overflow-hidden">
                  <div
                    className={`flex h-full w-full items-end bg-gradient-to-br ${dest.gradient} p-4 font-[family-name:var(--font-cormorant)] text-5xl font-light italic text-white/40 transition-transform duration-500 group-hover:scale-105`}
                  >
                    {dest.city}
                  </div>
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

      {/* ==================== STATS BAR ==================== */}
      <section className="bg-parchment py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-6 sm:grid-cols-4 lg:px-20">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-bone bg-white p-6 text-center shadow-[var(--shadow-sm)]"
            >
              <p className="font-[family-name:var(--font-cormorant)] text-[40px] font-medium leading-none text-obsidian">
                {stat.value}
                {stat.suffix && (
                  <span className="text-[28px] text-oro">{stat.suffix}</span>
                )}
              </p>
              <p className="mt-2 text-xs tracking-wide text-[#7A7060]">
                {stat.label}
              </p>
            </div>
          ))}
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
      <section className="bg-parchment py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            Guest Stories
          </p>
          <h2 className="mb-12 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian">
            What Our Travelers Say
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="rounded-[20px] border border-bone bg-white p-8 shadow-[var(--shadow-sm)]"
              >
                <div className="mb-4 flex gap-[3px] text-base text-oro">
                  {Array.from({ length: review.stars }, (_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mb-6 font-[family-name:var(--font-cormorant)] text-xl font-normal italic leading-relaxed text-obsidian">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-bone bg-parchment font-[family-name:var(--font-cormorant)] text-lg font-medium text-terracotta">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-obsidian">
                      {review.name}
                    </p>
                    <p className="text-xs text-[#7A7060]">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
