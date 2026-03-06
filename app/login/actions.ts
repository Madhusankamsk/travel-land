"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const AUTH_COOKIE = "auth_session";

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

  if (user.role !== "admin") {
    return { error: "Only admin users can sign in." };
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const from = (formData.get("from") as string) || "/dashboard";
  redirect(from);
}
