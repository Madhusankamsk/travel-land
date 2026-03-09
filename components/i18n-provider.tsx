"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import itMessages from "@/app/i18n/it.json";
import enMessages from "@/app/i18n/en.json";

export type Lang = "it" | "en";

type Messages = typeof itMessages;

type I18nContextValue = {
  lang: Lang;
  t: (key: keyof Messages | string, vars?: Record<string, string | number>) => string;
  setLang: (next: Lang) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolveLang(raw: string | null | undefined): Lang {
  return raw === "en" ? "en" : "it";
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars[key];
    return value !== undefined ? String(value) : "";
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialLang = resolveLang(searchParams.get("lang"));
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const fromUrlRaw = searchParams.get("lang");
    if (fromUrlRaw) {
      const fromUrl = resolveLang(fromUrlRaw);
      setLangState(fromUrl);
      return;
    }

    // Fallback to cookie if no lang param is present
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )tl_lang=([a-zA-Z-]+)/);
      if (match && match[1]) {
        const fromCookie = resolveLang(match[1]);
        setLangState(fromCookie);
      }
    }
  }, [searchParams]);

  const messages: Messages = useMemo(
    () => (lang === "en" ? enMessages : itMessages),
    [lang]
  );

  const updateUrl = useCallback(
    (next: Lang) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", next);
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      if (typeof document !== "undefined") {
        // Persist language preference for ~1 year
        document.cookie = `tl_lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
      updateUrl(next);
    },
    [updateUrl]
  );

  const t = useCallback(
    (key: keyof Messages | string, vars?: Record<string, string | number>): string => {
      const k = key as string;
      const value = (messages as Record<string, string>)[k];
      if (!value) {
        return k;
      }
      return interpolate(value, vars);
    },
    [messages]
  );

  const value = useMemo(
    () => ({
      lang,
      t,
      setLang,
    }),
    [lang, t, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

