"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setAuthSessionCookies } from "@/lib/auth";

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

  if (!user.password) {
    return {
      error: "This account uses Google sign-in. Use “Continue with Google” below.",
    };
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await setAuthSessionCookies(user.id, user.role);

  const defaultRedirect = user.role === "admin" ? "/dashboard" : "/profile";
  const from =
    (formData.get("from") as string) ||
    (formData.get("next") as string) ||
    defaultRedirect;
  redirect(from);
}
