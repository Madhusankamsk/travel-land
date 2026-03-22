import crypto from "crypto";

function getSecret(): string {
  const s = process.env.AUTH_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET (or GOOGLE_CLIENT_SECRET) must be set for OAuth state signing.");
    }
    return "dev-oauth-state-insecure";
  }
  return s;
}

/** Signed payload: where to redirect after Google sign-in (path only, validated in callback). */
export function signOAuthState(from: string): string {
  const payload = Buffer.from(
    JSON.stringify({ from, exp: Date.now() + 10 * 60_000 }),
    "utf8"
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyOAuthState(state: string): { from: string } | null {
  const parts = state.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      from?: string;
      exp?: number;
    };
    if (typeof json.from !== "string" || typeof json.exp !== "number") return null;
    if (Date.now() > json.exp) return null;
    return { from: json.from };
  } catch {
    return null;
  }
}
