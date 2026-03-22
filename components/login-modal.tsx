"use client";

import { useActionState, useEffect } from "react";
import { toast } from "@/lib/toast";
import { loginAction } from "@/app/login/actions";
import { GoogleAuthStack } from "@/components/google-sign-in-button";

const GOOGLE_ERR: Record<string, string> = {
  google_config: "Google sign-in is not configured on this server.",
  google_access_denied: "Google sign-in was cancelled.",
  google_oauth: "Google sign-in failed. Please try again.",
  google_state: "Sign-in session expired. Please try again.",
  google_token: "Could not complete Google sign-in. Please try again.",
  google_profile: "Could not read your Google profile. Please try again.",
  google_no_email: "Google did not share an email address. Use another account.",
  google_unverified: "Verify your Google email address, then try again.",
  google_account_mismatch: "This Google account is already linked to another user.",
  google_email_in_use: "This email is registered with a different sign-in method.",
  google_email_mismatch: "Account email could not be verified. Please contact support.",
  disabled: "This account is disabled.",
};

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  /** Post-login path (validated server-side). */
  defaultFrom: string;
  defaultEmail: string;
  errorParam: string | null;
  onSwitchToSignup: () => void;
};

export function LoginModal({
  open,
  onClose,
  defaultFrom,
  defaultEmail,
  errorParam,
  onSwitchToSignup,
}: LoginModalProps) {
  const [state, formAction] = useActionState(loginAction, null as {
    error?: string;
  } | null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  useEffect(() => {
    if (errorParam && GOOGLE_ERR[errorParam]) {
      toast.error(GOOGLE_ERR[errorParam]);
    }
  }, [errorParam]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="login-modal-title" className="text-2xl font-bold text-zinc-900">
            Sign in
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <GoogleAuthStack returnPath={defaultFrom} dividerLabel="Or use email" />

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="from" value={defaultFrom} />
          <div>
            <label htmlFor="login-modal-email" className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="login-modal-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={defaultEmail}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-modal-password" className="mb-1 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="login-modal-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-70"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-zinc-500">
          Only admin accounts can access the dashboard.{" "}
          <span className="block">
            Need an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-zinc-800 underline hover:text-zinc-900"
            >
              Create one
            </button>
            .
          </span>
        </p>
      </div>
    </div>
  );
}
