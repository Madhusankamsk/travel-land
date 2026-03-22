"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useDashboardTheme } from "./dashboard-theme-provider";

type DashboardSidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

export function useDashboardSidebar() {
  const ctx = useContext(DashboardSidebarContext);
  return ctx;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { dark } = useDashboardTheme();
  const childArray = React.Children.toArray(children);
  const headerRight = childArray[0];
  const sidebar = childArray[1] as React.ReactElement<{ className?: string }>;
  const main = childArray[2] as React.ReactElement<{ className?: string }>;

  return (
    <DashboardSidebarContext.Provider value={{ open, setOpen }}>
      <div
        className={`flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${dark ? "dark" : ""}`}
      >
        {/* Small header - always visible, logout + theme toggle top right */}
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-900 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 rounded">
              <Image src="/Logo.png" alt="Travel Land" width={90} height={24} className="h-6 w-auto object-contain sm:h-7" />
            </Link>
          </div>
          <div className="flex items-center">{headerRight}</div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Backdrop - mobile only when sidebar open */}
          {open && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              aria-hidden
              onClick={() => setOpen(false)}
            />
          )}

          {/* Sidebar - fixed overlay on mobile, static on desktop */}
          {sidebar &&
            React.cloneElement(sidebar, {
              className: [
                sidebar.props?.className ?? "",
                "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-900 md:relative md:translate-x-0",
                open ? "translate-x-0" : "-translate-x-full",
              ].join(" "),
            })}

          {/* Main content */}
          {main &&
            React.cloneElement(main, {
              className: [
                main.props?.className ?? "",
                "min-h-0 flex-1 overflow-auto bg-zinc-50 px-4 py-4 dark:bg-zinc-950 dark:text-zinc-100 sm:px-6 sm:py-6",
              ].join(" "),
            })}
        </div>
      </div>
    </DashboardSidebarContext.Provider>
  );
}
