"use client";

import Link from "next/link";

const AUTH_COOKIE = "auth_session";

export default function DashboardPage() {
  function signOut() {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-zinc-600">You are signed in.</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={signOut}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Sign out
        </button>
        <Link
          href="/"
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
