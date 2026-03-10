import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageHero } from "@/components/inner-page-hero";

export const metadata: Metadata = {
  title: "Contacts — TRAVEL-LAND.IT",
  description:
    "Contact TRAVEL-LAND.IT to begin planning your bespoke Italian journey. Request information, speak with our travel designers, or visit our office in Sesto San Giovanni (Milan).",
};

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-travertine">
      {/* Hero — reuse inner page hero pattern from About Us */}
      <InnerPageHero
        title="Contacts"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contacts" },
        ]}
      />

      {/* Intro + key contact information */}
      <section
        className="bg-travertine py-16 lg:py-24"
        aria-labelledby="contacts-intro-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
            {/* Left column — enquiry form */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                Get in touch
              </p>
              <h2
                id="contacts-intro-heading"
                className="mb-4 font-(family-name:--font-cormorant) text-[clamp(26px,3.5vw,36px)] font-medium leading-tight tracking-tight text-obsidian"
              >
                Start your Italian journey
              </h2>
              <p className="mb-8 text-[15px] leading-[1.65] text-[#7A7060]">
                Share a few details about how you like to travel and we will
                connect you with an in-country Travel Designer. You can also
                reach us directly by phone, email, or WhatsApp for time-sensitive
                enquiries.
              </p>

              <form className="space-y-6 rounded-[20px] border border-bone bg-white p-6 shadow-(--shadow-sm)">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7A7060]"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="w-full rounded-[8px] border border-bone bg-travertine px-3.5 py-3 text-[15px] text-obsidian placeholder:text-[#B5A890] focus:border-obsidian focus:outline-none focus:ring-2 focus:ring-obsidian/10"
                      placeholder="Alex"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7A7060]"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="w-full rounded-[8px] border border-bone bg-travertine px-3.5 py-3 text-[15px] text-obsidian placeholder:text-[#B5A890] focus:border-obsidian focus:outline-none focus:ring-2 focus:ring-obsidian/10"
                      placeholder="Rossi"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7A7060]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-[8px] border border-bone bg-travertine px-3.5 py-3 text-[15px] text-obsidian placeholder:text-[#B5A890] focus:border-obsidian focus:outline-none focus:ring-2 focus:ring-obsidian/10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed text-[#7A7060]">
                  By submitting this form you agree that your data will be
                  processed in accordance with GDPR (EU Reg. 2016/679) and our
                  privacy policy. We usually reply within one business day.
                </p>

                <button
                  type="submit"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-obsidian px-8 py-3 text-[14px] font-medium tracking-[0.04em] text-[#F0EAE0] transition-all duration-150 hover:shadow-(--shadow-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.97]"
                >
                  Send enquiry
                </button>
              </form>
            </div>

            {/* Right column — office details and social links */}
            <aside className="space-y-8 rounded-[20px] border border-bone bg-parchment p-6 shadow-(--shadow-sm)">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                  Office
                </p>
                <h3 className="mb-2 font-(family-name:--font-cormorant) text-[22px] font-medium leading-snug text-obsidian">
                  Travel land SRL
                </h3>
                <p className="text-[14px] leading-relaxed text-[#7A7060]">
                  Via Padre Ravasi 4
                  <br />
                  20099 Sesto San Giovanni (MI)
                  <br />
                  Italy
                </p>
                <p className="mt-2 text-[13px] text-[#7A7060]">
                  <span className="font-medium text-obsidian">
                    Opening hours:
                  </span>{" "}
                  Mon–Fri 10:00–19:00 · by appointment only
                </p>
              </div>

              <div className="h-px w-full bg-bone/70" aria-hidden />

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                  Contacts
                </p>
                <div className="space-y-2 text-[14px] leading-relaxed text-[#7A7060]">
                  <p>
                    <span className="font-medium text-obsidian">Phone:</span>{" "}
                    <a
                      href="tel:+39022404967"
                      className="text-azure underline-offset-2 hover:text-adriatic hover:underline"
                    >
                      +39 02 2404 967
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-obsidian">
                      Mobile / WhatsApp:
                    </span>{" "}
                    <a
                      href="https://wa.me/393351234567"
                      className="text-azure underline-offset-2 hover:text-adriatic hover:underline"
                    >
                      +39 335 123 4567
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-obsidian">Email:</span>{" "}
                    <a
                      href="mailto:info@travel-land.it"
                      className="text-azure underline-offset-2 hover:text-adriatic hover:underline"
                    >
                      info@travel-land.it
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-obsidian">
                      Group trips:
                    </span>{" "}
                    <a
                      href="mailto:gruppi@travel-land.it"
                      className="text-azure underline-offset-2 hover:text-adriatic hover:underline"
                    >
                      gruppi@travel-land.it
                    </a>
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-bone/70" aria-hidden />

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                  Social
                </p>
                <div className="space-y-2 text-[14px] leading-relaxed">
                  <Link
                    href="https://www.facebook.com/travelland"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-azure underline-offset-2 hover:text-adriatic hover:underline"
                  >
                    <span className="h-5 w-5 rounded-full bg-obsidian/90 text-[11px] font-semibold text-[#F0EAE0] flex items-center justify-center">
                      f
                    </span>
                    Facebook
                  </Link>
                  <br />
                  <Link
                    href="https://www.instagram.com/travelland"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-azure underline-offset-2 hover:text-adriatic hover:underline"
                  >
                    <span className="h-5 w-5 rounded-full bg-obsidian/90 text-[11px] font-semibold text-[#F0EAE0] flex items-center justify-center">
                      in
                    </span>
                    Instagram
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Map section */}
      <section
        className="bg-travertine pb-16 lg:pb-24"
        aria-labelledby="contacts-map-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta">
                Visit us
              </p>
              <h2
                id="contacts-map-heading"
                className="mb-3 font-(family-name:--font-cormorant) text-[clamp(24px,3vw,32px)] font-medium leading-tight tracking-tight text-obsidian"
              >
                Find our office in Sesto San Giovanni
              </h2>
              <p className="mb-4 text-[15px] leading-[1.65] text-[#7A7060]">
                Our agency is a short walk from Sesto Rondò metro station (Line
                1 – Red). Parking is available nearby. Please contact us in
                advance to schedule an appointment with a Travel Designer.
              </p>
              <p className="text-[14px] text-[#7A7060]">
                For urgent travel assistance while you are in Italy, please use
                the WhatsApp number provided above.
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-bone bg-[#E0D5C2] shadow-(--shadow-lg)">
              <iframe
                title="TRAVEL-LAND.IT office location on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.08861664758!2d9.235!3d45.528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDUuNTI4LCDCsDMnMjEuMCJF!5e0!3m2!1sen!2sit!4v1700000000000"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[260px] w-full border-0 md:h-[320px]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
