import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/auth-actions";
import { DashboardNav } from "./dashboard-nav";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <DashboardShell>
      <form action={logoutAction} className="inline-block">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          title="Log out"
        >
          <LogOut className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </form>
      <aside className="flex shrink-0 flex-col border-r border-zinc-200 bg-white">
        <DashboardNav />
      </aside>
      <main className="min-h-0 flex-1 overflow-auto">{children}</main>
    </DashboardShell>
  );
}
