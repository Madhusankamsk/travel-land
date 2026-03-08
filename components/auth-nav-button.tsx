"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AUTH_COOKIE = "auth_session";

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${AUTH_COOKIE}=`));
}

export function AuthNavButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(hasAuthCookie());
  }, [pathname]);

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-2.5 text-sm font-medium tracking-wide text-[#F0EAE0] transition-all duration-150 hover:bg-[#2E2921] hover:shadow-[var(--shadow-md)]"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/contacts"
      className="inline-flex items-center gap-2 rounded-full bg-oro px-5 py-2.5 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
    >
      Contattaci
    </Link>
  );
}
