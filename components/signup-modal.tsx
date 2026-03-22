"use client";

import { useActionState, useEffect } from "react";
import { toast } from "@/lib/toast";
import { signupAction } from "@/app/signup/actions";

type SignupState = {
  error?: string;
} | null;

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  defaultFrom: string;
  defaultEmail?: string;
  onSwitchToLogin: () => void;
};

export function SignupModal({
  open,
  onClose,
  defaultFrom,
  defaultEmail = "",
  onSwitchToLogin,
}: SignupModalProps) {
  const [state, formAction] = useActionState<SignupState, FormData>(signupAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-zinc-200 bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="signup-modal-title" className="text-2xl font-bold text-zinc-900">
            Create account
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

        <form action={formAction} className="flex flex-col gap-4">
          {defaultFrom ? <input type="hidden" name="from" value={defaultFrom} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="signup-firstName" className="mb-1 block text-sm font-medium text-zinc-700">
                First name
              </label>
              <input
                id="signup-firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="signup-lastName" className="mb-1 block text-sm font-medium text-zinc-700">
                Last name
              </label>
              <input
                id="signup-lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-mobile" className="mb-1 block text-sm font-medium text-zinc-700">
              Mobile number
            </label>
            <input
              id="signup-mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="+39 333 000 0000"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="signup-confirmPassword" className="mb-1 block text-sm font-medium text-zinc-700">
              Confirm password
            </label>
            <input
              id="signup-confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
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
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-70"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-zinc-800 underline hover:text-zinc-900"
          >
            Log in
          </button>
          .
        </p>
      </div>
    </div>
  );
}
