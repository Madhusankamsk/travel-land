"use server";

import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** True if a user exists for this email — used to open login vs signup after membership submit. */
export async function emailHasAccount(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!email || !EMAIL_RE.test(email)) return false;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user != null;
}
