"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/lib/toast";
import { loginAction } from "./actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";

  const [state, formAction] = useActionState(loginAction, null as {
    error?: string;
  } | null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">Sign in</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="from" value={from} />
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id="password"
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
            <a
              href="/signup"
              className="font-medium text-zinc-800 hover:text-zinc-900"
            >
              Create one
            </a>
            .
          </span>
        </p>
      </div>
    </div>
  );
}
