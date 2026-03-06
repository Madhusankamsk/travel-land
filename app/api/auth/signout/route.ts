import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "auth_session";

export async function POST(request: NextRequest) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
