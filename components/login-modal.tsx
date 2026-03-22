"use client";

import { useActionState, useEffect, useMemo } from "react";
import { toast } from "@/lib/toast";
import { loginAction } from "@/app/login/actions";

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

  const googleHref = useMemo(() => {
    const q = new URLSearchParams();
    q.set("from", defaultFrom);
    return `/api/auth/google?${q.toString()}`;
  }, [defaultFrom]);

  const showGoogle =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "string" &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.length > 0;

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

        {showGoogle && (
          <>
            <a
              href={googleHref}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
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
              Continue with Google
            </a>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">Or use email</span>
              </div>
            </div>
          </>
        )}

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
