import crypto from "crypto";
import { NextResponse } from "next/server";
import { hash as bcryptHash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAllowedNext } from "@/lib/auth-redirect";
import { setAuthSessionCookies } from "@/lib/auth";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") ?? "";
  const next = getAllowedNext(requestUrl.searchParams.get("next"));

  if (!token) {
    return NextResponse.redirect(new URL("/membership?error=auth_failed", requestUrl.origin));
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();

  // Atomic single-use: mark token used only if it is unused and not expired.
  const updateRes = await prisma.magicLinkToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    data: { usedAt: now },
  });

  if (updateRes.count !== 1) {
    return NextResponse.redirect(new URL("/membership?error=auth_failed", requestUrl.origin));
  }

  const tokenRow = await prisma.magicLinkToken.findUnique({ where: { tokenHash } });
  if (!tokenRow) {
    // Should be rare due to updateMany uniqueness.
    return NextResponse.redirect(new URL("/membership?error=auth_failed", requestUrl.origin));
  }

  const email = normalizeEmail(tokenRow.email);
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // We don't know user's password; create a placeholder so existing schema still works.
    const placeholderPassword = await bcryptHash(
      `magic-${email}-${Date.now()}-${Math.random().toString(36)}`,
      10
    );
    user = await prisma.user.create({
      data: {
        email,
        password: placeholderPassword,
        role: "user",
        is_active: true,
      },
    });
  }

  await setAuthSessionCookies(user.id, user.role);

  const redirectTo = next.startsWith("/") ? next : "/profile";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

