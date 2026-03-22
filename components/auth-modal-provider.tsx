"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";

type AuthModalContextValue = {
  openLogin: (opts?: { from?: string; email?: string }) => void;
  openSignup: (opts?: { from?: string; email?: string }) => void;
  close: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

const AUTH_QUERY_KEYS = ["auth", "from", "email", "error", "next"] as const;

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  const syncFromUrl = useCallback(() => {
    const a = searchParams.get("auth");
    if (a === "login") setMode("login");
    else if (a === "signup") setMode("signup");
    else setMode(null);
  }, [searchParams]);

  useEffect(() => {
    syncFromUrl();
  }, [syncFromUrl]);

  /** Keep viewport position when auth query changes; lock background scroll while a modal is open. */
  useEffect(() => {
    if (!mode) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mode]);

  const clearAuthParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    AUTH_QUERY_KEYS.forEach((k) => params.delete(k));
    const qs = params.toString();
    const path = pathname || "/";
    router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
  }, [pathname, router, searchParams]);

  const close = useCallback(() => {
    setMode(null);
    clearAuthParams();
  }, [clearAuthParams]);

  const openLogin = useCallback(
    (opts?: { from?: string; email?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("auth", "login");
      if (opts?.from) params.set("from", opts.from);
      else params.delete("from");
      if (opts?.email) params.set("email", opts.email);
      else params.delete("email");
      params.delete("error");
      params.delete("next");
      router.push(`${pathname || "/"}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const openSignup = useCallback(
    (opts?: { from?: string; email?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("auth", "signup");
      if (opts?.from) params.set("from", opts.from);
      else params.delete("from");
      if (opts?.email) params.set("email", opts.email);
      else params.delete("email");
      params.delete("error");
      params.delete("next");
      router.push(`${pathname || "/"}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const loginFrom = useMemo(() => {
    return searchParams.get("from") ?? searchParams.get("next") ?? "/dashboard";
  }, [searchParams]);

  const loginEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const loginError = useMemo(() => searchParams.get("error"), [searchParams]);
  const signupFrom = useMemo(() => searchParams.get("from") ?? "", [searchParams]);
  const signupEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const switchToSignup = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", "signup");
    params.delete("error");
    params.delete("next");
    router.replace(`${pathname || "/"}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const switchToLogin = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", "login");
    router.replace(`${pathname || "/"}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const value = useMemo(
    () => ({ openLogin, openSignup, close }),
    [openLogin, openSignup, close]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal
        open={mode === "login"}
        onClose={close}
        defaultFrom={loginFrom}
        defaultEmail={loginEmail}
        errorParam={loginError}
        onSwitchToSignup={switchToSignup}
      />
      <SignupModal
        open={mode === "signup"}
        onClose={close}
        defaultFrom={signupFrom}
        defaultEmail={signupEmail}
        onSwitchToLogin={switchToLogin}
      />
    </AuthModalContext.Provider>
  );
}
