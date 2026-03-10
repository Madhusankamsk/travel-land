import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE = "auth_session";
export const AUTH_ROLE_COOKIE = "auth_role";
export const AUTH_USER_ID_COOKIE = "auth_user_id";

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
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<void> {
  const session = await requireAuth();
  if (session.role !== "admin") redirect("/profile");
}
