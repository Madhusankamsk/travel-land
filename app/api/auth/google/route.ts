import { NextResponse } from "next/server";
import { getAllowedNext, getOriginFromRequest } from "@/lib/auth-redirect";
import { signOAuthState } from "@/lib/google-oauth-state";

export async function GET(request: Request) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const requestUrl = new URL(request.url);

  if (!clientId) {
    const fromRaw = requestUrl.searchParams.get("from") ?? "/profile";
    const err = new URL("/", requestUrl.origin);
    err.searchParams.set("auth", "login");
    err.searchParams.set("error", "google_config");
    err.searchParams.set("from", fromRaw);
    return NextResponse.redirect(err);
  }

  const fromRaw = requestUrl.searchParams.get("from") ?? "/profile";
  const origin = getOriginFromRequest(request);
  if (!origin) {
    return NextResponse.json({ error: "Could not determine request origin." }, { status: 500 });
  }

  const from = getAllowedNext(fromRaw);
  const state = signOAuthState(from);
  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
