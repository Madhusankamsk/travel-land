"use client";

import { useState } from "react";
import { getSupabaseBrowserOrNull } from "@/lib/supabase-browser";

const AUTH_CALLBACK_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "";
const MEMBERSHIP_NEXT = "/membership?callback=1";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  /** Pre-fill email for magic link (e.g. from form) */
  defaultEmail?: string;
};

export function AuthModal({ open, onClose, defaultEmail = "" }: AuthModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"google" | "magic" | null>(null);

  if (!open) return null;

  const supabase = getSupabaseBrowserOrNull();
  const notConfigured = !supabase;

  async function handleGoogle() {
    if (!supabase) return;
    setError(null);
    setLoading("google");
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${AUTH_CALLBACK_URL}?next=${encodeURIComponent(MEMBERSHIP_NEXT)}`,
        },
      });
      if (err) {
        setError(err.message);
        setLoading(null);
      }
      // else: redirect happens
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
      setLoading(null);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    setLoading("magic");
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${AUTH_CALLBACK_URL}?next=${encodeURIComponent(MEMBERSHIP_NEXT)}`,
        },
      });
      if (err) {
        setError(err.message);
        setLoading(null);
        return;
      }
      setMagicLinkSent(true);
      setLoading(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send link");
      setLoading(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="absolute inset-0 bg-[var(--color-obsidian)]/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-xl)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="auth-modal-title"
            className="font-[var(--font-display)] text-xl font-medium text-[var(--color-obsidian)]"
          >
            Sign in to continue
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-obsidian)]/70 hover:bg-[var(--color-travertine)] hover:text-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2"
            aria-label="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
        <p className="mb-5 text-sm text-[#7A7060]">
          Your form has been saved. Sign in with Google or receive a magic link by email to complete your booking.
        </p>

        {notConfigured ? (
          <p className="rounded-xl bg-[var(--color-warning-bg)] px-4 py-3 text-sm text-[var(--color-warning)]">
            Sign-in is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env, then restart the dev server (npm run dev).
          </p>
        ) : (
          <>
            {error && (
              <p
                className="mb-4 rounded-xl bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
                role="alert"
              >
                {error}
              </p>
            )}

            {magicLinkSent ? (
              <p className="rounded-xl bg-[var(--color-success-bg)] px-4 py-3 text-sm text-[var(--color-success)]">
                Check your email for a sign-in link. You can close this window and click the link to continue.
              </p>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={!!loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-bone)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-obsidian)] shadow-[var(--shadow-sm)] transition-[box-shadow,transform] hover:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 disabled:opacity-70 active:scale-[0.98]"
                >
                  {loading === "google" ? (
                    "Redirecting…"
                  ) : (
                    <>
                      <GoogleIcon className="h-5 w-5" />
                      Sign in with Google
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-bone)]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider text-[#7A7060]">
                    <span className="bg-white px-2">or</span>
                  </div>
                </div>

                <form onSubmit={handleMagicLink} className="space-y-3">
                  <label htmlFor="auth-modal-email" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-terracotta)]">
                    Email (magic link)
                  </label>
                  <input
                    id="auth-modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-[var(--color-bone)] bg-[var(--color-travertine)] px-4 py-3 text-[15px] text-[var(--color-obsidian)] placeholder-[#B5A890] focus:border-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)]/10"
                  />
                  <button
                    type="submit"
                    disabled={!!loading}
                    className="w-full rounded-full bg-[var(--color-obsidian)] px-4 py-3 text-sm font-medium text-[#F0EAE0] transition-[opacity,transform] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {loading === "magic" ? "Sending…" : "Send magic link"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
