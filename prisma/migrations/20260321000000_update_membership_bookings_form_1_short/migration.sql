-- Add fields needed by "Form 1 - Short" membership booking UI.

ALTER TABLE "membership_bookings"
ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';

ALTER TABLE "membership_bookings"
ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

ALTER TABLE "membership_bookings"
ADD COLUMN "supplementsVarious" DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE "membership_bookings"
ADD COLUMN "travelCancellationInsuranceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;

