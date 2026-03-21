import type { Prisma } from "@prisma/client";
import defaultPenalties from "@/data/cancellation-penalties-default.json";

export type CancellationPenaltyRule = {
  daysBefore: number;
  percent: number;
  /** Optional full line instead of auto “X% of the total confirmed” */
  label?: string;
};

export type CancellationPenalties = {
  title: string;
  intro: string;
  rules: CancellationPenaltyRule[];
  footnote: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function normalizeRule(raw: unknown): CancellationPenaltyRule | null {
  if (!isRecord(raw)) return null;
  const daysBefore = Number(raw.daysBefore);
  const percent = Number(raw.percent);
  if (!Number.isFinite(daysBefore) || !Number.isFinite(percent)) return null;
  const label = typeof raw.label === "string" && raw.label.trim() ? raw.label.trim() : undefined;
  return { daysBefore: Math.trunc(daysBefore), percent, label };
}

function normalizeRules(raw: unknown): CancellationPenaltyRule[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeRule).filter((r): r is CancellationPenaltyRule => r != null);
}

/** Deep-merge DB / form JSON with the project default so missing keys still work. */
export function mergeCancellationPenalties(db: unknown): CancellationPenalties {
  const def = defaultPenalties as unknown as CancellationPenalties;
  if (db == null || !isRecord(db)) {
    return {
      title: def.title,
      intro: def.intro,
      rules: [...def.rules],
      footnote: def.footnote,
    };
  }
  const normalizedRules = normalizeRules(db.rules);
  return {
    title: typeof db.title === "string" && db.title.trim() ? db.title.trim() : def.title,
    intro: typeof db.intro === "string" ? db.intro : def.intro,
    rules: normalizedRules.length ? normalizedRules : [...def.rules],
    footnote: typeof db.footnote === "string" ? db.footnote : def.footnote,
  };
}

export function getDefaultCancellationPenalties(): CancellationPenalties {
  return mergeCancellationPenalties(null);
}

/** One-line summary for dashboard table / cards */
export function summarizeCancellationPenalties(json: unknown): string {
  const p = mergeCancellationPenalties(json);
  if (!p.rules.length) return "—";
  const parts = p.rules.slice(0, 3).map((r) => `${r.daysBefore}d→${r.percent}%`);
  const more = p.rules.length > 3 ? ` +${p.rules.length - 3}` : "";
  return `${p.rules.length} tier${p.rules.length === 1 ? "" : "s"}: ${parts.join(", ")}${more}`;
}

export function parseCancellationPenaltiesFromForm(raw: string | null): CancellationPenalties | null {
  if (raw == null || !String(raw).trim()) return null;
  try {
    const parsed = JSON.parse(String(raw)) as unknown;
    return mergeCancellationPenalties(parsed);
  } catch {
    return null;
  }
}

/** JSON round-trip removes `undefined` keys (Prisma Json rejects undefined in nested objects in some paths). */
export function cancellationPenaltiesToPrismaJson(data: CancellationPenalties): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}
