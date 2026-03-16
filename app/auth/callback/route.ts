import { createClient } from "@supabase/supabase-js";
import { hash } from "bcryptjs";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AUTH_COOKIE = "auth_session";
const AUTH_ROLE_COOKIE = "auth_role";
const AUTH_USER_ID_COOKIE = "auth_user_id";

async function useSecureCookie(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return false;
  const headersList = await headers();
  const proto = headersList.get("x-forwarded-proto") ?? headersList.get("x-forwarded-ssl");
  return proto === "https" || proto === "on";
}

/**
 * Supabase Auth callback: exchange code for session, sync user to Prisma, set app cookies, redirect to membership form.
 * Redirect URL in Supabase must point to: https://your-domain/auth/callback
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/membership?callback=1";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/membership?error=callback_config", requestUrl.origin));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);
  if (authError || !authData.user) {
    return NextResponse.redirect(new URL("/membership?error=auth_failed", requestUrl.origin));
  }

  const supabaseUser = authData.user;
  const email = (supabaseUser.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.redirect(new URL("/membership?error=no_email", requestUrl.origin));
  }

  const fullName =
    (supabaseUser.user_metadata?.full_name ??
      supabaseUser.user_metadata?.name ??
      [supabaseUser.user_metadata?.given_name, supabaseUser.user_metadata?.family_name].filter(Boolean).join(" ")) ||
    null;
  const [firstName, ...lastParts] = (fullName ?? "").trim().split(/\s+/);
  const lastName = lastParts.length > 0 ? lastParts.join(" ") : null;

  const placeholderPassword = await hash(
    `supabase-${supabaseUser.id}-${Date.now()}-${Math.random().toString(36)}`,
    10
  );

  let prismaUser = await prisma.user.findUnique({ where: { email } });
  if (prismaUser) {
    await prisma.user.update({
      where: { id: prismaUser.id },
      data: {
        firstName: firstName || prismaUser.firstName,
        lastName: lastName || prismaUser.lastName,
        updatedAt: new Date(),
      },
    });
  } else {
    prismaUser = await prisma.user.create({
      data: {
        email,
        password: placeholderPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: "user",
        is_active: true,
      },
    });
  }

  const cookieStore = await cookies();
  const secure = await useSecureCookie();

  cookieStore.set(AUTH_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });
  cookieStore.set(AUTH_ROLE_COOKIE, prismaUser.role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });
  cookieStore.set(AUTH_USER_ID_COOKIE, prismaUser.id, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    sameSite: "lax",
    secure,
  });

  const redirectTo = next.startsWith("/") ? next : `/membership?callback=1`;
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
