"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "dashboard-dark";

type DashboardThemeContextValue = {
  dark: boolean;
  setDark: (dark: boolean) => void;
  toggleDark: () => void;
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(
  null
);

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  return ctx;
}

export function DashboardThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDarkState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setDarkState(stored === "1");
  }, [mounted]);

  const setDark = useCallback((value: boolean) => {
    setDarkState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
  }, []);

  const toggleDark = useCallback(() => {
    setDarkState((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      }
      return next;
    });
  }, []);

  const value: DashboardThemeContextValue = {
    dark: mounted ? dark : false,
    setDark,
    toggleDark,
  };

  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  );
}
