import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE = "auth_session";
export const AUTH_ROLE_COOKIE = "auth_role";

export async function getAuthSession(): Promise<{ role: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value ?? "user";
  if (session !== "true") return null;
  return { role };
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

export async function logoutAction(): Promise<never> {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_ROLE_COOKIE, "", { path: "/", maxAge: 0 });
  redirect("/login");
}
