"use client";

import Image from "next/image";
import { ChevronRight, Facebook, Instagram, Mail, MessageCircle, Youtube } from "lucide-react";
import { LangLink } from "@/components/lang-link";
import { useI18n } from "@/components/i18n-provider";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian text-[#F0EAE0]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-20 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/Logo.png"
              alt="TRAVEL-LAND.IT"
              width={180}
              height={60}
              className="mb-4 h-14 w-auto brightness-0 invert"
            />
            <p className="mb-2 font-(family-name:--font-cormorant) text-base italic text-[#7A7060]">
              {t("footer.brand.tagline")}
            </p>
            <p className="mb-4 max-w-[320px] text-[13px] leading-relaxed text-[#7A7060]">
              <strong className="text-champagne/90">{t("footer.companyName")}</strong>
              <br />
              <a href="mailto:eleonora@travel-land.it" className="hover:text-[#F0EAE0]">
                eleonora@travel-land.it
              </a>
              <br />
              P.IVA: 07403720969 · Codice Univoco: M5UXCR1
              <br />
              Sede legale: Viale Edison 666, Sesto San Giovanni (MI)
            </p>
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-champagne/70">
                {t("footer.social.label")}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#7A7060]">
                <a
                  href="https://www.facebook.com/travelland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#F0EAE0]"
                >
                  <Facebook size={14} aria-hidden="true" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/travelland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#F0EAE0]"
                >
                  <Instagram size={14} aria-hidden="true" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#F0EAE0]"
                >
                  <Youtube size={14} aria-hidden="true" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

          </div>


          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
              {t("footer.section.contacts")}
            </h4>

            <div className="mt-3 space-y-4 text-[12px] text-[#7A7060]">
              <div>
                <p className="mb-2 inline-flex items-center gap-2">
                  <MessageCircle size={14} className="text-champagne/70" aria-hidden="true" />
                  <span>{t("footer.whatsapp.label")}</span>
                </p>
                <div className="space-y-1">
                  <p>
                    <a
                      href="https://wa.me/393284292203"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F0EAE0]"
                    >
                      +39 328 429 2203
                    </a>{" "}
                    ·{" "}
                    <a
                      href="https://wa.me/393384571070"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F0EAE0]"
                    >
                      +39 338 457 1070
                    </a>{" "}
                    Eleonora
                  </p>
                  <p>
                    <a
                      href="https://wa.me/393249241395"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F0EAE0]"
                    >
                      +39 324 924 1395
                    </a>{" "}
                    Sisira
                  </p>
                  <p>
                    <a
                      href="https://wa.me/393201668589"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F0EAE0]"
                    >
                      +39 320 166 8589
                    </a>{" "}
                    Romeo
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 inline-flex items-center gap-2">
                  <Mail size={14} className="text-champagne/70" aria-hidden="true" />
                  <span>{t("footer.email.label")}</span>
                </p>
                <div className="space-y-1">
                  <p>
                    <a href="mailto:info@travel-land.it" className="hover:text-[#F0EAE0]">
                      info@travel-land.it
                    </a>
                  </p>
                  <p>
                    <a href="mailto:gruppi@travel-land.it" className="hover:text-[#F0EAE0]">
                      gruppi@travel-land.it
                    </a>
                  </p>
                  <p>
                    <a href="mailto:eleonora@travel-land.it" className="hover:text-[#F0EAE0]">
                      eleonora@travel-land.it
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
              {t("footer.section.quickLinks")}
            </h4>
            <ul className="flex flex-col gap-0">
              <li>
                <LangLink
                  href="/upcoming-trips"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.tripHistory")}</span>
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/upcoming-trips"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.allTours")}</span>
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/catalogs"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.catalogs")}</span>
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/who-we-are"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.whoWeAre")}</span>
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/sustainable-tourism"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.sustainableTourism")}</span>
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/contacts"
                  className="inline-flex items-center gap-1 text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  <ChevronRight size={12} aria-hidden="true" />
                  <span>{t("footer.link.contacts")}</span>
                </LangLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
              Newsletter
            </h4>
            <p className="mb-3 max-w-[280px] text-[12px] leading-relaxed text-[#7A7060]">
              Get travel inspiration, curated offers, and upcoming departures in your inbox.
            </p>
            <form className="flex items-center overflow-hidden rounded-full border border-white/12 bg-[#242019] p-1">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email Address"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[13px] text-[#F0EAE0] placeholder:text-[#7A7060] focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-oro px-5 py-2 text-[13px] font-semibold text-obsidian transition-colors duration-150 hover:bg-bronze hover:text-[#F0EAE0]"
              >
                Join
              </button>
            </form>
            <p className="mt-3 max-w-[280px] text-[11px] leading-relaxed text-[#7A7060]">
              {t("footer.newsletter.termsPrefix")}{" "}
              <LangLink
                href="/terms-and-conditions"
                className="inline-block text-[#7A7060] underline underline-offset-2 hover:text-[#F0EAE0]"
              >
                {t("footer.newsletter.termsLink")}
              </LangLink>
              .
            </p>
            
          </div>

          
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/8 pt-8 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 text-xs text-[#7A7060]">
            <span>
              ©
            </span>
            <span>
              {year} Travel Land. All Right Reserved. Developed by AlteredMinds.co
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

