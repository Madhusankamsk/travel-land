import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/auth-actions";
import { DashboardHeaderActions } from "./dashboard-header-actions";
import { DashboardNav } from "./dashboard-nav";
import { DashboardShell } from "./dashboard-shell";
import { DashboardThemeProvider } from "./dashboard-theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <DashboardThemeProvider>
      <DashboardShell>
        <DashboardHeaderActions>
          <form action={logoutAction} className="inline-block">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              title="Log out"
            >
              <LogOut className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </DashboardHeaderActions>
        <aside className="flex shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <DashboardNav />
        </aside>
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </DashboardShell>
    </DashboardThemeProvider>
  );
}
