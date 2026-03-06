import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tours");

export async function saveTourFile(
  file: File,
  prefix: string
): Promise<string> {
  const ext = path.extname(file.name) || ".jpg";
  const name = `${prefix}-${Date.now()}${ext}`;
  const dir = UPLOAD_DIR;
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, name);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));
  return `/uploads/tours/${name}`;
}
