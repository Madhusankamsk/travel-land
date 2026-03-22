"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/components/auth-modal-provider";
import { useI18n } from "@/components/i18n-provider";
import { logoutAction } from "@/lib/auth-actions";

const AUTH_COOKIE = "auth_session";
const AUTH_ROLE_COOKIE = "auth_role";

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${AUTH_COOKIE}=`));
}

function getAuthRole(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_ROLE_COOKIE}=`));
  if (!match) return null;
  const [, value] = match.split("=", 2);
  return value || null;
}

export function AuthNavButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const { openLogin } = useAuthModal();
  const { t } = useI18n();

  useEffect(() => {
    setIsAuthenticated(hasAuthCookie());
    setRole(getAuthRole());
  }, [pathname]);

  if (isAuthenticated) {
    const isAdmin = role === "admin";
    const onProfilePage = pathname === "/profile";

    if (!isAdmin && onProfilePage) {
      return (
        <form action={logoutAction} className="inline-block">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-2.5 text-sm font-medium tracking-wide text-[#F0EAE0] transition-all duration-150 hover:bg-[#2E2921] hover:shadow-[var(--shadow-md)]"
          >
            {t("profile.logOut")}
          </button>
        </form>
      );
    }

    const targetHref = isAdmin ? "/dashboard" : "/profile";
    const label = isAdmin ? "Dashboard" : "Profile";

    return (
      <Link
        href={targetHref}
        className="inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-2.5 text-sm font-medium tracking-wide text-[#F0EAE0] transition-all duration-150 hover:bg-[#2E2921] hover:shadow-[var(--shadow-md)]"
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openLogin()}
      className="inline-flex items-center gap-2 rounded-full bg-oro px-5 py-2.5 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:bg-bronze hover:text-white hover:shadow-[var(--shadow-gold)]"
    >
      Login
    </button>
  );
}
