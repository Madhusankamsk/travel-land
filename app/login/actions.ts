"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const AUTH_COOKIE = "auth_session";
const AUTH_ROLE_COOKIE = "auth_role";

/** Only use Secure cookie when the request is over HTTPS (or behind a proxy that set x-forwarded-proto). */
async function useSecureCookie(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? headersList.get("x-forwarded-ssl");
  return proto === "https" || proto === "on";
}

export async function loginAction(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  if (!user.is_active) {
    return { error: "This account is disabled." };
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: false,
    sameSite: "lax",
    secure: await useSecureCookie(),
  });

  cookieStore.set(AUTH_ROLE_COOKIE, user.role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure: await useSecureCookie(),
  });

  const defaultRedirect = user.role === "admin" ? "/dashboard" : "/profile";
  const from = (formData.get("from") as string) || defaultRedirect;
  redirect(from);
}
