import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildMagicLinkEmail } from "@/lib/email-templates/magic-link-email";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  // Basic validation; final check is handled by the email system.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getOriginFromRequest(request: Request) {
  const headers = request.headers;
  const proto = headers.get("x-forwarded-proto") ?? "http";
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return "";
  return `${proto}://${host}`;
}

function getAllowedNext(next: unknown): string {
  const s = typeof next === "string" ? next : "";
  if (!s.startsWith("/")) return "/profile";
  if (s.startsWith("/membership")) return s;
  if (s.startsWith("/dashboard")) return s;
  if (s.startsWith("/profile")) return s;
  if (s.startsWith("/login")) return s;
  if (s.startsWith("/signup")) return s;
  return "/profile";
}

async function sendMagicEmail(toEmail: string, verifyUrl: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpPortRaw || !smtpUser || !smtpPass || !smtpFrom) {
    return NextResponse.json(
      {
        ok: false,
        error: "SMTP not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.",
      },
      { status: 500 }
    );
  }

  const smtpPort = Number(smtpPortRaw);
  if (!Number.isFinite(smtpPort) || smtpPort <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid SMTP_PORT" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // common convention; use 587 for STARTTLS
    auth: { user: smtpUser, pass: smtpPass },
  });

  const { subject, text, html } = buildMagicLinkEmail(verifyUrl);

  await transporter.sendMail({
    from: smtpFrom,
    to: toEmail,
    subject,
    text,
    html,
  });
}

export async function POST(request: Request) {
  const origin = getOriginFromRequest(request);
  const body = (await request.json()) as { email?: string; next?: string };

  const email = normalizeEmail(body.email ?? "");
  if (!isValidEmail(email)) {
    // Avoid leaking whether the email exists.
    return NextResponse.json({ ok: true });
  }

  const allowedNext = getAllowedNext(body.next);

  // Rate-limit (DB-based): allow up to 3 magic-link requests per email per minute.
  const since = new Date(Date.now() - 60_000);
  const recentCount = await prisma.magicLinkToken.count({
    where: {
      email,
      createdAt: { gt: since },
    },
  });
  if (recentCount >= 3) {
    return NextResponse.json({ ok: true });
  }

  const rawToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60_000); // 15 minutes

  // Create a new token (single-use). Unique tokenHash prevents overwrites.
  await prisma.magicLinkToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
      usedAt: null,
    },
  });

  if (!origin) {
    return NextResponse.json(
      { ok: false, error: "Could not determine request origin to build verify URL." },
      { status: 500 }
    );
  }

  const verifyUrl = new URL("/api/auth/magic/verify", origin);
  verifyUrl.searchParams.set("token", rawToken);
  verifyUrl.searchParams.set("next", allowedNext);

  const mailRes = await sendMagicEmail(email, verifyUrl.toString());
  if (mailRes instanceof NextResponse) return mailRes;

  return NextResponse.json({ ok: true });
}

