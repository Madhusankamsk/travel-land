import Link from "next/link";
import { logoutAction } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-zinc-600">You are signed in.</p>
      <div className="flex gap-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Log out
          </button>
        </form>
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
