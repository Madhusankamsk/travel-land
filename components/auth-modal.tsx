"use client";

import { useState } from "react";

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
  const [loading, setLoading] = useState<"magic" | null>(null);

  if (!open) return null;

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    setLoading("magic");
    try {
      const res = await fetch("/api/auth/magic/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, next: MEMBERSHIP_NEXT }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to send magic link");
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
          Your form has been saved. Enter your email to receive a magic link and complete your booking.
        </p>

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
            <div className="space-y-3">
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
      </div>
    </div>
  );
}
