"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type SignupState = {
  error?: string;
};

export async function signupAction(
  _prev: SignupState | null,
  formData: FormData
): Promise<SignupState | null> {
  const firstName = (formData.get("firstName") as string | null)?.trim() || "";
  const lastName = (formData.get("lastName") as string | null)?.trim() || "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const mobile = (formData.get("mobile") as string | null)?.trim();
  const password = (formData.get("password") as string | null) ?? "";
  const confirmPassword =
    (formData.get("confirmPassword") as string | null) ?? "";

  if (!email || !mobile || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }],
    } as any,
  });

  if (existing) {
    return { error: "An account with this email or mobile already exists." };
  }

  const passwordHash = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      mobile,
      role: "user",
      is_active: true,
    } as any,
  });

  redirect("/login");
}

