import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authLoginSearchParams } from "@/lib/auth-url";

export const AUTH_COOKIE = "auth_session";
export const AUTH_ROLE_COOKIE = "auth_role";
export const AUTH_USER_ID_COOKIE = "auth_user_id";

async function useSecureCookie(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? headersList.get("x-forwarded-ssl");
  return proto === "https" || proto === "on";
}

/** Sets the same session cookies used by email/password login and Google OAuth. */
export async function setAuthSessionCookies(userId: string, role: string): Promise<void> {
  const cookieStore = await cookies();
  const secure = await useSecureCookie();
  const opts = {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax" as const,
    secure,
  };
  cookieStore.set(AUTH_COOKIE, "true", opts);
  cookieStore.set(AUTH_ROLE_COOKIE, role, opts);
  cookieStore.set(AUTH_USER_ID_COOKIE, userId, opts);
}

export async function getAuthSession(): Promise<{ role: string; userId: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value ?? "user";
  const userId = cookieStore.get(AUTH_USER_ID_COOKIE)?.value ?? null;
  if (session !== "true" || !userId) return null;
  return { role, userId };
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getAuthSession();
  return session?.userId ?? null;
}

export async function requireAuth(): Promise<{ role: string }> {
  const session = await getAuthSession();
  if (!session) redirect(`/?${authLoginSearchParams({})}`);
  return session;
}

export async function requireAdmin(): Promise<void> {
  const session = await requireAuth();
  if (session.role !== "admin") redirect("/profile");
}
