"use client";

import Image from "next/image";
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
            <p className="mb-2 font-[family-name:var(--font-cormorant)] text-base italic text-[#7A7060]">
              Agenzia di viaggi, tour operator
            </p>
            <p className="mb-4 max-w-[320px] text-[13px] leading-relaxed text-[#7A7060]">
              <strong className="text-champagne/90">TRAVEL-LAND S.R.L.</strong>
              <br />
              <a href="mailto:eleonora@travel-land.it" className="hover:text-[#F0EAE0]">
                eleonora@travel-land.it
              </a>
              <br />
              P.IVA: 07403720969 · Codice Univoco: M5UXCR1
              <br />
              Sede legale: Viale Edison 666, Sesto San Giovanni (MI)
            </p>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-champagne/80">
              Si riceve su appuntamento
            </p>
            <p className="text-[13px] text-[#7A7060]">Lun–Ven 10:00–19:00</p>
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
            <ul className="flex flex-col gap-3">
              <li>
                <LangLink
                  href="/who-we-are"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.whoWeAre")}
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/sustainable-tourism"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.sustainableTourism")}
                </LangLink>
              </li>
              <li>
                <LangLink
                  href="/contacts"
                  className="text-[13px] text-[#7A7060] transition-colors duration-150 hover:text-[#F0EAE0]"
                >
                  {t("footer.link.contacts")}
                </LangLink>
              </li>
            </ul>
            <p className="mt-3 text-[12px] text-[#7A7060]">
              🟢 {t("footer.whatsapp.label")}
              <br />
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
              <br />
              <a
                href="https://wa.me/393249241395"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F0EAE0]"
              >
                +39 324 924 1395
              </a>{" "}
              Sisira
              <br />
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <span className="text-xs text-[#7A7060]">
            {t("footer.copyright", { year })}
          </span>
        </div>
      </div>
    </footer>
  );
}

