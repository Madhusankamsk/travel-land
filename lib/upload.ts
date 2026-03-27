import fs from "fs";
import path from "path";
import { isCloudinaryConfigured, uploadBufferToCloudinary } from "./cloudinary";

const LOCAL_UPLOADS_DIR = "public/uploads";

/**
 * Save a tour file (hero image, gallery/day image, or program PDF).
 * Uses Cloudinary when configured and falls back to local public/uploads
 * in development.
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

  const isDev = process.env.NODE_ENV !== "production";
  const cloudinaryFolder = prefix === "program" ? "tours/program" : "tours/images";

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadBufferToCloudinary({
        buffer,
        mimeType: file.type || (ext === ".pdf" ? "application/pdf" : "image/jpeg"),
        folder: cloudinaryFolder,
        fileNameBase: prefix,
      });
      return result.secure_url;
    } catch (error) {
      if (!isDev) {
        throw error;
      }
      // Cloudinary upload failed in development; fall through to local.
    }
  } else if (!isDev) {
    throw new Error("Cloudinary is not configured in production.");
  }

  // Fallback: save to local public/uploads (useful for local development).
  const dir = path.join(process.cwd(), LOCAL_UPLOADS_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, objectPath);
  fs.writeFileSync(filePath, buffer);
  // public/ is served at root, so URL is /uploads/...
  return `/uploads/${objectPath}`;
}
