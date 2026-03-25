"use client";

import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
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
            <p className="mb-2 max-w-[360px] text-[13px] italic leading-relaxed text-[#7A7060]">
              {t("footer.quote.text")}
              <br />
              <span className="mt-1 inline-block">{t("footer.quote.author")}</span>
            </p>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-champagne/80">
              {t("footer.appointmentNote")}
            </p>
            <p className="text-[13px] text-[#7A7060]">{t("footer.openingHours")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
              {t("footer.section.upcoming")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <LangLink
                  href="/upcoming-trips"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.tripHistory")}
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/upcoming-trips"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.allTours")}
                </LangLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/70">
              {t("footer.section.catalog")}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <LangLink
                  href="/catalogs"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.catalogs")}
                </LangLink>
              </li>
            </ul>
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
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <span className="text-xs text-[#7A7060]">
            {t("footer.copyright", { year })}
          </span>
        </div>
      </div>
    </footer>
  );
}

