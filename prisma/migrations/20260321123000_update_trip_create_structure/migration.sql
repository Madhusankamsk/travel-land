-- Trip creation structure update:
-- - TourStatus expanded to UPCOMING/OPEN/SOLD_OUT/COMPLETED
-- - Add new trip fields (logistics, group info, booking + contact, media gallery)
-- - TourDay enhanced with optional date + day images
-- - Remove legacy cancellationPolicy/contactStaff fields

-- 1) Update enum
ALTER TYPE "TourStatus" RENAME TO "TourStatus_old";
CREATE TYPE "TourStatus" AS ENUM ('UPCOMING', 'OPEN', 'SOLD_OUT', 'COMPLETED');

ALTER TABLE "tours" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "tours"
  ALTER COLUMN "status" TYPE "TourStatus"
  USING (
    CASE
      WHEN "status"::text = 'ARCHIVED' THEN 'COMPLETED'::"TourStatus"
      ELSE ("status"::text)::"TourStatus"
    END
  );

ALTER TABLE "tours" ALTER COLUMN "status" SET DEFAULT 'UPCOMING'::"TourStatus";

DROP TYPE "TourStatus_old";

-- 2) Tours: remove legacy fields
ALTER TABLE "tours" DROP COLUMN IF EXISTS "cancellationPolicy";
ALTER TABLE "tours" DROP COLUMN IF EXISTS "contactStaff";

-- 3) Tours: add new fields
ALTER TABLE "tours" ADD COLUMN "durationDaysNights" TEXT;
ALTER TABLE "tours" ADD COLUMN "tripSubtitle" TEXT;
ALTER TABLE "tours" ADD COLUMN "tripCode" TEXT;
ALTER TABLE "tours" ADD CONSTRAINT "tours_tripCode_key" UNIQUE ("tripCode");

ALTER TABLE "tours" ADD COLUMN "destinationCountry" TEXT;
ALTER TABLE "tours" ADD COLUMN "destinationCities" TEXT;
ALTER TABLE "tours" ADD COLUMN "tripCategory" TEXT;

ALTER TABLE "tours" ADD COLUMN "galleryImageUrls" JSONB;
ALTER TABLE "tours" ADD COLUMN "tripVideoUrl" TEXT;

ALTER TABLE "tours" ADD COLUMN "startLocation" TEXT;
ALTER TABLE "tours" ADD COLUMN "endLocation" TEXT;
ALTER TABLE "tours" ADD COLUMN "meetingPoint" TEXT;
ALTER TABLE "tours" ADD COLUMN "transportUsed" TEXT;
ALTER TABLE "tours" ADD COLUMN "accommodationType" TEXT;
ALTER TABLE "tours" ADD COLUMN "hotelCategory" TEXT;
ALTER TABLE "tours" ADD COLUMN "roomType" TEXT;

ALTER TABLE "tours" ADD COLUMN "minParticipants" INTEGER;
ALTER TABLE "tours" ADD COLUMN "maxGroupSize" INTEGER;
ALTER TABLE "tours" ADD COLUMN "ageRestrictions" TEXT;
ALTER TABLE "tours" ADD COLUMN "difficultyLevel" TEXT;
ALTER TABLE "tours" ADD COLUMN "requiresWalkingKmPerDay" TEXT;

ALTER TABLE "tours" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';

ALTER TABLE "tours" ADD COLUMN "bookingDeadline" TEXT;
ALTER TABLE "tours" ADD COLUMN "availableSeats" INTEGER;
ALTER TABLE "tours" ADD COLUMN "childPolicy" TEXT;

ALTER TABLE "tours" ADD COLUMN "contactStaffName" TEXT;
ALTER TABLE "tours" ADD COLUMN "contactPhone" TEXT;
ALTER TABLE "tours" ADD COLUMN "contactEmail" TEXT;

-- 4) TourDays: add optional date + day images
ALTER TABLE "tour_days" ADD COLUMN IF NOT EXISTS "dateLabel" TEXT;
ALTER TABLE "tour_days" ADD COLUMN IF NOT EXISTS "dayImageUrls" JSONB;

