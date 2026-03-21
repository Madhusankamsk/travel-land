import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { hash as bcryptHash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const AUTH_COOKIE = "auth_session";
const AUTH_ROLE_COOKIE = "auth_role";
const AUTH_USER_ID_COOKIE = "auth_user_id";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getAllowedNext(next: unknown): string {
  const s = typeof next === "string" ? next : "";
  if (!s.startsWith("/")) return "/membership?callback=1";
  if (s.startsWith("/membership")) return s;
  if (s.startsWith("/dashboard")) return s;
  if (s.startsWith("/profile")) return s;
  if (s.startsWith("/login")) return s;
  if (s.startsWith("/signup")) return s;
  return "/membership?callback=1";
}

async function getSecureCookieFlag(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? headersList.get("x-forwarded-ssl");
  return proto === "https" || proto === "on";
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

  const secure = await getSecureCookieFlag();
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });
  cookieStore.set(AUTH_ROLE_COOKIE, user.role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });
  cookieStore.set(AUTH_USER_ID_COOKIE, user.id, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });

  const redirectTo = next.startsWith("/") ? next : "/membership?callback=1";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

