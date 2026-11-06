-- CreateEnum
CREATE TYPE "ShowStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "commissionRateBps" INTEGER;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "status" "ShowStatus" NOT NULL DEFAULT 'DRAFT';

-- Preserve the lifecycle state of existing shows.
UPDATE "Show"
SET "status" = CASE
    WHEN "isActive" = true THEN 'PUBLISHED'::"ShowStatus"
    ELSE 'CANCELLED'::"ShowStatus"
END;

-- AlterTable
ALTER TABLE "ShowSeat" ADD COLUMN     "priceAdjustment" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "cleaningBufferMinutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "commissionRateBps" INTEGER NOT NULL DEFAULT 1000;
