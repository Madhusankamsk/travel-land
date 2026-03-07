import fs from "fs";
import path from "path";
import { getSupabaseServer, isSupabaseStorageConfigured } from "./supabase-server";

const STORAGE_BUCKET = "tours";
const LOCAL_UPLOADS_DIR = "public/uploads";

/**
 * Save a tour file (hero image or program PDF). Tries Supabase Storage first when
 * configured and reachable; falls back to local public/uploads (e.g. in Docker without Supabase).
 * Returns the public URL, or null only if no file was provided.
 */
export async function saveTourFile(
  file: File,
  prefix: string
): Promise<string | null> {
  const ext = path.extname(file.name) || (prefix === "program" ? ".pdf" : ".jpg");
  const objectPath = `${prefix}-${Date.now()}${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Try Supabase first when configured
  if (isSupabaseStorageConfigured()) {
    try {
      const contentType = file.type || (ext === ".pdf" ? "application/pdf" : "image/jpeg");
      const supabase = getSupabaseServer();

      const doUpload = () =>
        supabase.storage.from(STORAGE_BUCKET).upload(objectPath, buffer, {
          contentType,
          upsert: false,
        });

      let result = await doUpload();
      if (result.error?.message?.toLowerCase().includes("bucket not found")) {
        await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
        result = await doUpload();
      }
      if (!result.error) {
        const {
          data: { publicUrl },
        } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
        return publicUrl;
      }
    } catch {
      // Supabase unreachable (e.g. Docker without supabase start) — fall through to local
    }
  }

  // Fallback: save to local public/uploads (works in Docker with uploads_data volume)
  const dir = path.join(process.cwd(), LOCAL_UPLOADS_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, objectPath);
  fs.writeFileSync(filePath, buffer);
  // public/ is served at root, so URL is /uploads/...
  return `/uploads/${objectPath}`;
}
