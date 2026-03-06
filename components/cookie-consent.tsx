"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== "accepted") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    }
    setVisible(false);
  };

  const decline = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "declined");
    }
    setVisible(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-start gap-4 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg shadow-zinc-900/5 backdrop-blur">
        <div className="flex-1 text-sm text-zinc-700">
          <p className="font-medium text-zinc-900">We use cookies</p>
          <p className="mt-1 text-xs text-zinc-600">
            We use essential cookies to make this site work, and optional
            analytics cookies to understand how you use it. You can change your
            choice at any time in your browser.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Only essential
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

