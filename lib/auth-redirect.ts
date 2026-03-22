/** Same-site relative paths only (open-redirect safe) for post-login / OAuth return. */
export function getAllowedNext(next: unknown): string {
  const s = typeof next === "string" ? next : "";
  if (!s.startsWith("/")) return "/profile";
  if (s.startsWith("//")) return "/profile";
  if (s.startsWith("/membership")) return s;
  if (s.startsWith("/dashboard")) return s;
  if (s.startsWith("/profile")) return s;
  if (s.startsWith("/upcoming-trips")) return s;
  return "/profile";
}

export function getOriginFromRequest(request: Request) {
  const headers = request.headers;
  const proto = headers.get("x-forwarded-proto") ?? "http";
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return "";
  return `${proto}://${host}`;
}
