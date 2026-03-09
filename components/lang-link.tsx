"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";

type LangLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
  href: string;
};

export function LangLink({ href, children, ...rest }: LangLinkProps) {
  const { lang } = useI18n();
  const searchParams = useSearchParams();

  const targetHref = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    const query = params.toString();
    if (!query) return href;

    // Avoid duplicating query if href already has one
    const [path, existingQuery] = href.split("?");
    const merged = new URLSearchParams(existingQuery ?? "");
    params.forEach((value, key) => merged.set(key, value));
    const finalQuery = merged.toString();
    return finalQuery ? `${path}?${finalQuery}` : path;
  }, [href, lang, searchParams]);

  return (
    <Link href={targetHref} {...rest}>
      {children}
    </Link>
  );
}

