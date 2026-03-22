import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllowedNext, getOriginFromRequest } from "@/lib/auth-redirect";
import { verifyOAuthState } from "@/lib/google-oauth-state";
import { setAuthSessionCookies } from "@/lib/auth";
import { authLoginSearchParams } from "@/lib/auth-url";

function redirectLoginError(origin: string, errorCode: string) {
  return NextResponse.redirect(new URL(`/?${authLoginSearchParams({ error: errorCode })}`, origin));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
};

type GoogleUserInfo = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
};

export async function GET(request: Request) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectLoginError(new URL(request.url).origin, "google_config");
  }

  const requestUrl = new URL(request.url);
  const origin = getOriginFromRequest(request);
  if (!origin) {
    return NextResponse.json({ error: "Could not determine origin." }, { status: 500 });
  }

  const err = requestUrl.searchParams.get("error");
  if (err) {
    return redirectLoginError(origin, `google_${err}`);
  }

  const code = requestUrl.searchParams.get("code");
  const stateRaw = requestUrl.searchParams.get("state");
  if (!code || !stateRaw) {
    return redirectLoginError(origin, "google_oauth");
  }

  const statePayload = verifyOAuthState(stateRaw);
  if (!statePayload) {
    return redirectLoginError(origin, "google_state");
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return redirectLoginError(origin, "google_token");
  }

  const tokens = (await tokenRes.json()) as GoogleTokenResponse;
  const accessToken = tokens.access_token;
  if (!accessToken) {
    return redirectLoginError(origin, "google_token");
  }

  const userinfoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userinfoRes.ok) {
    return redirectLoginError(origin, "google_profile");
  }

  const profile = (await userinfoRes.json()) as GoogleUserInfo;
  const googleSub = profile.sub;
  const emailRaw = profile.email;
  if (!googleSub || !emailRaw) {
    return redirectLoginError(origin, "google_no_email");
  }
  if (profile.email_verified === false) {
    return redirectLoginError(origin, "google_unverified");
  }

  const email = normalizeEmail(emailRaw);
  const firstName = profile.given_name?.trim() || profile.name?.split(/\s+/)[0]?.trim() || null;
  const lastName =
    profile.family_name?.trim() ||
    (profile.name && profile.name.includes(" ")
      ? profile.name.split(/\s+/).slice(1).join(" ").trim()
      : null) ||
    null;

  let user = await prisma.user.findUnique({ where: { googleSub } });

  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      if (byEmail.googleSub && byEmail.googleSub !== googleSub) {
        return redirectLoginError(origin, "google_email_in_use");
      }
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: {
          googleSub,
          firstName: byEmail.firstName ?? firstName,
          lastName: byEmail.lastName ?? lastName,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: null,
          googleSub,
          firstName,
          lastName,
          role: "user",
          is_active: true,
        },
      });
    }
  } else if (user.email !== email) {
    return redirectLoginError(origin, "google_email_mismatch");
  }

  if (!user.is_active) {
    return redirectLoginError(origin, "disabled");
  }

  await setAuthSessionCookies(user.id, user.role);

  const nextPath = getAllowedNext(statePayload.from);
  const redirectTo = nextPath.startsWith("/") ? nextPath : "/profile";
  return NextResponse.redirect(new URL(redirectTo, origin));
}
