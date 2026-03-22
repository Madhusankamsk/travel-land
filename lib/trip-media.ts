/**
 * Normalizes JSON stored in Prisma (galleryImageUrls / dayImageUrls) into URL strings.
 * Ignores invalid entries instead of dropping the whole array.
 */
export function normalizeUrlList(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

/** Parses a hidden JSON field from FormData (edit round-trip). */
export function parseUrlArrayFromFormField(formData: FormData, key: string): string[] | null {
  const raw = formData.get(key);
  if (raw == null || raw === "") return null;
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = normalizeUrlList(parsed);
    return list;
  } catch {
    return null;
  }
}
