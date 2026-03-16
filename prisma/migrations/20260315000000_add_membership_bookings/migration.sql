-- CreateTable
CREATE TABLE "membership_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "tourId" TEXT,
    "roomType" TEXT NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,
    "insuranceAmount" DECIMAL(10,2) NOT NULL,
    "registrationFees" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "gdprAccepted" BOOLEAN NOT NULL,
    "cancellationAccepted" BOOLEAN NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membership_bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "membership_bookings" ADD CONSTRAINT "membership_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
