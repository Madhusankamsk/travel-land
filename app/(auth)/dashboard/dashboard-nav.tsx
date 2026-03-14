"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin } from "lucide-react";
import { useDashboardSidebar } from "./dashboard-shell";

const links = [
  { href: "/dashboard", label: "Overview", exact: true, icon: LayoutDashboard },
  { href: "/dashboard/trips", label: "Trips", exact: false, icon: MapPin },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const sidebar = useDashboardSidebar();

  return (
    <nav className="flex-1 space-y-1 overflow-auto px-3 py-4 text-sm">
      {links.map(({ href, label, exact, icon: Icon }) => {
        const isActive = exact
          ? pathname === href
          : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => sidebar?.setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
              isActive
                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
