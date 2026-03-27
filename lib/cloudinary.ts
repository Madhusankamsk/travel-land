import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function hasCloudinaryUrl(): boolean {
  return Boolean(process.env.CLOUDINARY_URL);
}

function readCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return (
    hasCloudinaryUrl() ||
    Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
}

function configureCloudinary(): void {
  if (hasCloudinaryUrl()) {
    // Cloudinary SDK reads CLOUDINARY_URL from environment.
    cloudinary.config({ secure: true });
    return;
  }

  const cfg = readCloudinaryConfig();
  cloudinary.config({
    cloud_name: cfg.cloudName,
    api_key: cfg.apiKey,
    api_secret: cfg.apiSecret,
    secure: true,
  });
}

type UploadToCloudinaryParams = {
  buffer: Buffer;
  mimeType?: string;
  folder: string;
  fileNameBase: string;
};

export async function uploadBufferToCloudinary({
  buffer,
  mimeType,
  folder,
  fileNameBase,
}: UploadToCloudinaryParams): Promise<UploadApiResponse> {
  configureCloudinary();

  const normalizedMime = (mimeType || "").toLowerCase();
  const isPdf = normalizedMime === "application/pdf";
  const resourceType: UploadApiOptions["resource_type"] = isPdf ? "raw" : "image";

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        public_id: `${fileNameBase}-${Date.now()}`,
        overwrite: false,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed without a response."));
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}
