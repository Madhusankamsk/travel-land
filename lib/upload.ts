import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2PublicUrlBase, isR2Configured } from "./r2";

const LOCAL_UPLOADS_DIR = "public/uploads";

/**
 * Save a tour file (hero image or program PDF). Tries Cloudflare R2 first when
 * configured; falls back to local public/uploads.
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

  // Try Cloudflare R2 first when configured
  if (isR2Configured()) {
    try {
      const contentType = file.type || (ext === ".pdf" ? "application/pdf" : "image/jpeg");
      const r2 = getR2Client();
      const bucket = process.env.R2_BUCKET as string;
      await r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: objectPath,
          Body: buffer,
          ContentType: contentType,
        })
      );

      const baseUrl = getR2PublicUrlBase();
      return `${baseUrl}/${objectPath}`;
    } catch {
      // R2 unreachable or misconfigured — fall through to local
    }
  }

  // Fallback: save to local public/uploads (useful for local dev).
  const dir = path.join(process.cwd(), LOCAL_UPLOADS_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, objectPath);
  fs.writeFileSync(filePath, buffer);
  // public/ is served at root, so URL is /uploads/...
  return `/uploads/${objectPath}`;
}
