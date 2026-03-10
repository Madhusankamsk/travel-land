import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white">
          <div className="flex h-16 items-center border-b border-zinc-200 px-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Admin
            </span>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/trips"
              className="block rounded-lg px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            >
              Trips
            </Link>
          </nav>
          <form action={logoutAction} className="border-t border-zinc-200 p-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              Log out
            </button>
          </form>
        </aside>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
