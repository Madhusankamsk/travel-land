"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AUTH_COOKIE = "auth_session";

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${AUTH_COOKIE}=`));
}

export function AuthNavButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasAuthCookie());
  }, []);

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-800 hover:bg-zinc-100"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-800 hover:bg-zinc-100"
    >
      Log in
    </Link>
  );
}

