import { S3Client } from "@aws-sdk/client-s3";

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.R2_BUCKET;
const r2PublicUrlBase =
  process.env.R2_PUBLIC_URL_BASE ||
  (r2AccountId && r2Bucket ? `https://${r2Bucket}.${r2AccountId}.r2.dev` : "");

export function isR2Configured(): boolean {
  return Boolean(r2AccountId && r2AccessKeyId && r2SecretAccessKey && r2Bucket);
}

export function getR2PublicUrlBase(): string {
  return r2PublicUrlBase;
}

export function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId!,
      secretAccessKey: r2SecretAccessKey!,
    },
  });
}

