-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('UPCOMING', 'ARCHIVED');

-- CreateTable
CREATE TABLE "tours" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TourStatus" NOT NULL DEFAULT 'UPCOMING',
    "durationLabel" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "introText" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "singleSupplement" DECIMAL(10,2),
    "mandatoryInsurance" TEXT,
    "optionalInsurance" TEXT,
    "depositLabel" TEXT,
    "balanceDeadline" TEXT,
    "included" TEXT NOT NULL,
    "excluded" TEXT NOT NULL,
    "cancellationPolicy" TEXT,
    "programPdfUrl" TEXT,
    "contactStaff" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_days" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "dayHeading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_days_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_days" ADD CONSTRAINT "tour_days_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
