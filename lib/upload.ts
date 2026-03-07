import path from "path";
import { getSupabaseServer, isSupabaseStorageConfigured } from "./supabase-server";

const STORAGE_BUCKET = "tours";

/**
 * Upload a tour file (hero image or program PDF) to Supabase Storage.
 * Returns the public URL, or null if Supabase is not configured (env vars missing).
 * Requires a Supabase project with a public bucket named "tours".
 */
export async function saveTourFile(
  file: File,
  prefix: string
): Promise<string | null> {
  if (!isSupabaseStorageConfigured()) {
    return null;
  }

  const ext = path.extname(file.name) || (prefix === "program" ? ".pdf" : ".jpg");
  const objectPath = `${prefix}-${Date.now()}${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const contentType = file.type || (ext === ".pdf" ? "application/pdf" : "image/jpeg");

  const supabase = getSupabaseServer();

  async function doUpload() {
    return supabase.storage.from(STORAGE_BUCKET).upload(objectPath, buffer, {
      contentType,
      upsert: false,
    });
  }

  let result = await doUpload();

  if (result.error?.message?.toLowerCase().includes("bucket not found")) {
    await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    result = await doUpload();
  }

  if (result.error) {
    throw new Error(
      `Supabase Storage upload failed: ${result.error.message}. Ensure bucket "${STORAGE_BUCKET}" exists and is public.`
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
  return publicUrl;
}
