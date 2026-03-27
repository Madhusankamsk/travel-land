import "dotenv/config";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { isCloudinaryConfigured, uploadBufferToCloudinary } from "../lib/cloudinary";

config({ path: ".env.local", override: true });

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";
if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required.");
}
if (!isCloudinaryConfigured()) {
  throw new Error(
    "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const migratedUrlCache = new Map<string, string>();

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com/");
}

function normalizeUrlList(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

function readExtFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return path.extname(parsed.pathname) || "";
  } catch {
    return path.extname(url) || "";
  }
}

async function readAssetBuffer(url: string): Promise<{ buffer: Buffer; mimeType?: string }> {
  if (url.startsWith("/uploads/")) {
    const localPath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    const buffer = await fs.promises.readFile(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const mimeType = ext === ".pdf" ? "application/pdf" : undefined;
    return { buffer, mimeType };
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type") ?? undefined;
  return { buffer, mimeType };
}

async function migrateUrlToCloudinary(url: string, folder: string, fileNameBase: string): Promise<string> {
  if (!url || isCloudinaryUrl(url)) return url;
  const cached = migratedUrlCache.get(url);
  if (cached) return cached;

  const { buffer, mimeType } = await readAssetBuffer(url);
  const ext = readExtFromUrl(url);
  const result = await uploadBufferToCloudinary({
    buffer,
    mimeType,
    folder,
    fileNameBase: `${fileNameBase}${ext ? `-${ext.replace(".", "")}` : ""}`,
  });
  migratedUrlCache.set(url, result.secure_url);
  return result.secure_url;
}

async function main() {
  const tours = await prisma.tour.findMany({
    select: {
      id: true,
      heroImageUrl: true,
      programPdfUrl: true,
      galleryImageUrls: true,
      days: {
        select: {
          id: true,
          order: true,
          dayImageUrls: true,
        },
      },
    },
    orderBy: { updatedAt: "asc" },
  });

  let migratedAssets = 0;
  let failedAssets = 0;
  let updatedTours = 0;
  let updatedDays = 0;

  for (const tour of tours) {
    let tourChanged = false;
    let nextHero = tour.heroImageUrl;
    let nextProgram = tour.programPdfUrl;
    const nextGallery = normalizeUrlList(tour.galleryImageUrls);

    if (tour.heroImageUrl && !isCloudinaryUrl(tour.heroImageUrl)) {
      try {
        nextHero = await migrateUrlToCloudinary(tour.heroImageUrl, "tours/hero", `tour-${tour.id}-hero`);
        if (nextHero !== tour.heroImageUrl) {
          migratedAssets += 1;
          tourChanged = true;
        }
      } catch (error) {
        failedAssets += 1;
        console.error(`[hero] ${tour.id}: ${(error as Error).message}`);
      }
    }

    if (tour.programPdfUrl && !isCloudinaryUrl(tour.programPdfUrl)) {
      try {
        nextProgram = await migrateUrlToCloudinary(
          tour.programPdfUrl,
          "tours/program",
          `tour-${tour.id}-program`
        );
        if (nextProgram !== tour.programPdfUrl) {
          migratedAssets += 1;
          tourChanged = true;
        }
      } catch (error) {
        failedAssets += 1;
        console.error(`[program] ${tour.id}: ${(error as Error).message}`);
      }
    }

    const migratedGallery: string[] = [];
    for (let i = 0; i < nextGallery.length; i++) {
      const current = nextGallery[i];
      if (!current || isCloudinaryUrl(current)) {
        migratedGallery.push(current);
        continue;
      }
      try {
        const migrated = await migrateUrlToCloudinary(
          current,
          "tours/gallery",
          `tour-${tour.id}-gallery-${i + 1}`
        );
        if (migrated !== current) {
          migratedAssets += 1;
          tourChanged = true;
        }
        migratedGallery.push(migrated);
      } catch (error) {
        failedAssets += 1;
        console.error(`[gallery] ${tour.id}#${i + 1}: ${(error as Error).message}`);
        migratedGallery.push(current);
      }
    }

    if (tourChanged) {
      await prisma.tour.update({
        where: { id: tour.id },
        data: {
          heroImageUrl: nextHero,
          programPdfUrl: nextProgram,
          galleryImageUrls: migratedGallery.length ? migratedGallery : Prisma.JsonNull,
        },
      });
      updatedTours += 1;
      console.log(`[tour updated] ${tour.id}`);
    }

    for (const day of tour.days) {
      const dayUrls = normalizeUrlList(day.dayImageUrls);
      if (!dayUrls.length) continue;
      let dayChanged = false;
      const migratedDayUrls: string[] = [];

      for (let i = 0; i < dayUrls.length; i++) {
        const current = dayUrls[i];
        if (!current || isCloudinaryUrl(current)) {
          migratedDayUrls.push(current);
          continue;
        }
        try {
          const migrated = await migrateUrlToCloudinary(
            current,
            "tours/day",
            `tour-${tour.id}-day-${day.order}-${i + 1}`
          );
          if (migrated !== current) {
            migratedAssets += 1;
            dayChanged = true;
          }
          migratedDayUrls.push(migrated);
        } catch (error) {
          failedAssets += 1;
          console.error(`[day] ${tour.id} day ${day.order}#${i + 1}: ${(error as Error).message}`);
          migratedDayUrls.push(current);
        }
      }

      if (dayChanged) {
        await prisma.tourDay.update({
          where: { id: day.id },
          data: {
            dayImageUrls: migratedDayUrls.length ? migratedDayUrls : Prisma.JsonNull,
          },
        });
        updatedDays += 1;
        console.log(`[day updated] ${tour.id} day ${day.order}`);
      }
    }
  }

  console.log("Cloudinary migration finished.");
  console.log(
    JSON.stringify(
      {
        toursScanned: tours.length,
        toursUpdated: updatedTours,
        daysUpdated: updatedDays,
        migratedAssets,
        failedAssets,
        cachedAssets: migratedUrlCache.size,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
