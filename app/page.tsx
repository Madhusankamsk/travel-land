"use client";

import Image from "next/image";
import { AnimatedStat } from "@/components/animated-stat";
import { HeroSearchSection } from "@/components/hero-search-section";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { useI18n } from "@/components/i18n-provider";
import { LangLink } from "@/components/lang-link";

const DESTINATIONS = [
  {
    city: "EGITTO",
    region: "Storico Viaggi",
    title: "Cairo e Alessandria — 2026",
    description:
      "Dal 05 al 09 marzo 2026. Partendo dalla capitale Il Cairo: Necropoli di Giza con le Piramidi e il Grand Egyptian Museum, la mitica Alessandria e il nuovo Museo Egizio. Guida Selim, egittologo con trent'anni di esperienza; programma esclusivo Travelland con visite a nuovi siti archeologici e chiese di storia millenaria. Quota 5 giorni tutto incluso: 1.380 Euro - Sup. singola 120 Euro.",
    price: "€1,380",
    badge: "Storico Viaggi",
    stars: 5,
    gradient: "from-[#8B6914] to-[#6B3A2A]",
    image: "/temp/Egitto.jpg",
  },
  {
    city: "ISLANDA",
    region: "Storico Viaggi · 2026",
    title: "Aurora Boreale — 6 Giorni",
    description:
      "Dal 24 al 29 gennaio 2026. Viaggio on the road invernale: Circolo d'Oro, Parco di Thingvellir, geyser, cascate Gullfoss, ghiacciaio e iceberg a Jökulsárlón, Diamond Beach, grotte di ghiaccio, aurora boreale, avvistamento balene, acque termali. Quota 1.720 Euro — Sup. singola 420 Euro.",
    price: "€1,720",
    badge: "Storico Viaggi",
    stars: 5,
    gradient: "from-[#1A4A70] to-[#2E6B9E]",
    image: "/temp/ISLANDA.jpg",
  },
  {
    city: "SRI LANKA",
    region: "Storico Viaggi · 2026",
    title: "Sri Lanka, Doha & Maldives — 12 Giorni",
    description:
      "Dal 3 al 14 febbraio 2026. La terra della felicità: Colombo in festa per l'Independence Day, Pinnawala, Sigiriya Rock, Polonnaruwa, Anuradhapura, Dambulla, Kandy e il Tempio del Dente, tea plantation, Yala safari, Galle. Opzione estensione 2 giorni a Doha o 6 giorni alle Maldive. Quota su richiesta.",
    price: "Su richiesta",
    badge: "Storico Viaggi",
    stars: 5,
    gradient: "from-[#2D6A4F] to-[#5B8C3B]",
    image: "/temp/SRI LANKA.avif",
  },
];

const STATS = [
  { value: "500", suffix: "+", label: "Viaggi curati" },
  { value: "98", suffix: "%", label: "Soddisfazione clienti" },
  { value: "12", suffix: "", label: "Regioni d'Italia" },
  { value: "40", suffix: "+", label: "Paesi nel mondo" },
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
  const { t } = useI18n();

  return (
    <>
      {/* ==================== HERO + SEARCH (Airbnb-style expand) ==================== */}
      <HeroSearchSection />

      {/* ==================== FEATURED DESTINATIONS ==================== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            {t("home.upcoming.eyebrow")}
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian">
            {t("home.upcoming.title")}
          </h2>
          <p className="mb-12 max-w-[640px] text-[15px] leading-relaxed text-obsidian/65">
            {t("home.upcoming.subtitle")}
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
                    className="absolute top-4 left-4 rounded-full bg-obsidian/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-champagne backdrop-blur-sm"
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
                      <p className="text-[11px] text-[#7A7060]">Da</p>
                      <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium text-obsidian">
                        {dest.price}{" "}
                        <span className="text-[13px] opacity-60">a pers.</span>
                      </p>
                    </div>
                    <StarRating count={dest.stars} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <LangLink
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full bg-parchment px-7 py-3.5 text-sm font-medium tracking-wide text-siena transition-all duration-150 hover:bg-bone/80 active:scale-[0.97] focus:outline-2 focus:outline-oro focus:outline-offset-3"
            >
              {t("home.upcoming.ctaAll")}
            </LangLink>
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
            {t("home.about.eyebrow")}
          </p>
          <h2
            id="about-us-heading"
            className="mb-4 text-center font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-[#F0EAE0]"
          >
            {t("home.about.title")}
          </h2>
          <p className="mx-auto mb-12 max-w-[640px] text-center text-[15px] leading-relaxed text-[#B5A890]">
            {t("home.about.body")}
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
            {/* Image */}
            <div className="relative min-h-[240px] overflow-hidden lg:min-h-full">
              <Image
                src="/temp/Naples.jpg"
                alt="Naples and Amalfi Coast"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 280px"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-transparent to-transparent"
                aria-hidden
              />
            </div>

            <div className="flex flex-col justify-between p-6 lg:p-8">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-oro/30 bg-oro/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-bronze">
                    Storico Viaggi
                  </span>
                  <span className="rounded-full border border-azure/25 bg-azure/8 px-2.5 py-1 text-[11px] font-medium tracking-wide text-azure">
                    New Year&apos;s
                  </span>
                  <span className="rounded-full border border-bone px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#7A7060]">
                    5 Days
                  </span>
                  <span className="rounded-full border border-bone px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#7A7060]">
                    Dec 29 – Jan 2, 2026
                  </span>
                </div>
                <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-snug text-obsidian">
                  Naples, Salerno & Amalfi Coast — New Year&apos;s 2025
                </h3>
                <div className="mb-4 flex flex-wrap gap-6">
                  <span className="text-[13px] text-[#7A7060]">
                    <strong className="font-medium text-obsidian">
                      Naples
                    </strong>{" "}
                    · Toledo metro, historic center
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    Phlegraean Fields · Salerno Luci d&apos;Artista
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    Positano · Amalfi · Sorrento
                  </span>
                  <span className="text-[13px] text-[#7A7060]">
                    New Year&apos;s Eve party with live music
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#7A7060]">
                  Christmas markets and nativity scenes in Naples, the magical
                  Luci d&apos;Artista in Salerno, Cuma and the Phlegraean
                  Fields, Pozzuoli and the Temple Church. Then Positano, Amalfi
                  and the Path of the Gods, Sorrento, and a grand New
                  Year&apos;s Eve celebration. Train from Milan included.
                </p>
              </div>

              <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-bone pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] text-[#7A7060]">Quota</p>
                  <p className="font-[family-name:var(--font-cormorant)] text-[32px] font-medium text-obsidian">
                    Su richiesta{" "}
                    <span className="text-sm opacity-50">a persona</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <LangLink
                    href="/upcoming-trips"
                    className="inline-flex items-center rounded-full border border-bone bg-white px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:border-obsidian hover:bg-travertine"
                  >
                    Vedi dettagli
                  </LangLink>
                  <LangLink
                    href="/contacts"
                    className="inline-flex items-center rounded-full bg-oro px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
                  >
                    Contattaci
                  </LangLink>
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
            {t("home.testimonials.eyebrow")}
          </p>
          <h2
            id="testimonials-heading"
            className="mb-12 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight tracking-tight text-obsidian"
          >
            {t("home.testimonials.title")}
          </h2>
          <TestimonialsCarousel reviews={REVIEWS} />
        </div>
      </section>

      {/* ==================== CTA BANNER + Bolaño + Form informazioni ==================== */}
      <section className="relative overflow-hidden bg-obsidian py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(184,150,62,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(46,107,158,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-20">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-oro">
            {t("home.cta.eyebrow")}
          </p>
          <h2 className="mx-auto mb-6 max-w-[700px] font-[family-name:var(--font-cormorant)] text-[clamp(28px,5vw,56px)] font-normal italic leading-tight tracking-tighter text-[#F0EAE0]">
            <em>{t("home.cta.quoteAttribution")}</em>
          </h2>
          <p className="mx-auto mb-8 max-w-[560px] text-[15px] leading-relaxed text-[#B5A890]">
            {t("home.cta.body").replace(
              t("home.cta.linkForm"),
              ""
            )}
            <LangLink
              href="/contacts"
              className="underline decoration-champagne/60 underline-offset-2 hover:text-champagne"
            >
              {t("home.cta.linkForm")}
            </LangLink>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LangLink
              href="/upcoming-trips"
              className="inline-flex items-center rounded-full bg-oro px-8 py-4 text-base font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
            >
              {t("home.cta.btnUpcoming")}
            </LangLink>
            <LangLink
              href="/catalogs"
              className="inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10"
            >
              {t("home.cta.btnCatalog")}
            </LangLink>
            <LangLink
              href="/sustainable-tourism"
              className="inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10"
            >
              {t("home.cta.btnSustainable")}
            </LangLink>
            <LangLink
              href="/contacts"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-medium tracking-wide text-[#F0EAE0] transition-colors duration-150 hover:bg-white/10"
            >
              {t("home.cta.btnContacts")}
            </LangLink>
          </div>
        </div>
      </section>
    </>
  );
}
