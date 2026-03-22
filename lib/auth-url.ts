/** Build `/?auth=login&...` for server redirects (replaces removed /login page). */
export function authLoginSearchParams(
  opts: { from?: string; email?: string; error?: string; next?: string } = {}
): string {
  const q = new URLSearchParams();
  q.set("auth", "login");
  if (opts.from) q.set("from", opts.from);
  if (opts.email) q.set("email", opts.email);
  if (opts.error) q.set("error", opts.error);
  if (opts.next) q.set("next", opts.next);
  return q.toString();
}

/** Build `/?auth=signup&...` for server redirects (replaces removed /signup page). */
export function authSignupSearchParams(opts: { from?: string; email?: string } = {}): string {
  const q = new URLSearchParams();
  q.set("auth", "signup");
  if (opts.from) q.set("from", opts.from);
  if (opts.email) q.set("email", opts.email);
  return q.toString();
}
