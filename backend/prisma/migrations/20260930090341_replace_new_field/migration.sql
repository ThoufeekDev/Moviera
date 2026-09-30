/*
  Warnings:

  - You are about to drop the column `providerOrderId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[screenId,label]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[showId,seatId]` on the table `ShowSeat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_userId_idx";

-- DropIndex
DROP INDEX "BookingSeat_bookingId_idx";

-- DropIndex
DROP INDEX "Show_screenId_idx";

-- DropIndex
DROP INDEX "Show_startTime_idx";

-- DropIndex
DROP INDEX "ShowSeat_showId_seatId_idx";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "providerOrderId";

-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "logoPublicId" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "TheatreFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheatreFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheatreFacilityAssignment" (
    "id" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TheatreFacilityAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieReview" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheatreReview" (
    "id" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheatreReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheatreImage" (
    "id" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheatreImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TheatreFacility_slug_key" ON "TheatreFacility"("slug");

-- CreateIndex
CREATE INDEX "TheatreFacility_isActive_idx" ON "TheatreFacility"("isActive");

-- CreateIndex
CREATE INDEX "TheatreFacilityAssignment_theatreId_idx" ON "TheatreFacilityAssignment"("theatreId");

-- CreateIndex
CREATE INDEX "TheatreFacilityAssignment_facilityId_idx" ON "TheatreFacilityAssignment"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "TheatreFacilityAssignment_theatreId_facilityId_key" ON "TheatreFacilityAssignment"("theatreId", "facilityId");

-- CreateIndex
CREATE INDEX "MovieReview_movieId_idx" ON "MovieReview"("movieId");

-- CreateIndex
CREATE INDEX "MovieReview_userId_idx" ON "MovieReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieReview_movieId_userId_key" ON "MovieReview"("movieId", "userId");

-- CreateIndex
CREATE INDEX "TheatreReview_theatreId_idx" ON "TheatreReview"("theatreId");

-- CreateIndex
CREATE INDEX "TheatreReview_userId_idx" ON "TheatreReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TheatreReview_theatreId_userId_key" ON "TheatreReview"("theatreId", "userId");

-- CreateIndex
CREATE INDEX "TheatreImage_theatreId_sortOrder_idx" ON "TheatreImage"("theatreId", "sortOrder");

-- CreateIndex
CREATE INDEX "Booking_userId_createdAt_idx" ON "Booking"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CinemaFormat_isActive_idx" ON "CinemaFormat"("isActive");

-- CreateIndex
CREATE INDEX "City_isActive_idx" ON "City"("isActive");

-- CreateIndex
CREATE INDEX "Genre_isActive_idx" ON "Genre"("isActive");

-- CreateIndex
CREATE INDEX "Movie_isActive_idx" ON "Movie"("isActive");

-- CreateIndex
CREATE INDEX "Movie_releaseDate_idx" ON "Movie"("releaseDate");

-- CreateIndex
CREATE INDEX "Payment_providerPaymentId_idx" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "Screen_isActive_idx" ON "Screen"("isActive");

-- CreateIndex
CREATE INDEX "Seat_screenId_idx" ON "Seat"("screenId");

-- CreateIndex
CREATE INDEX "Seat_isActive_idx" ON "Seat"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_screenId_label_key" ON "Seat"("screenId", "label");

-- CreateIndex
CREATE INDEX "Show_screenId_startTime_idx" ON "Show"("screenId", "startTime");

-- CreateIndex
CREATE INDEX "Show_startTime_isActive_idx" ON "Show"("startTime", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSeat_showId_seatId_key" ON "ShowSeat"("showId", "seatId");

-- CreateIndex
CREATE INDEX "Theatre_isActive_idx" ON "Theatre"("isActive");

-- AddForeignKey
ALTER TABLE "TheatreFacilityAssignment" ADD CONSTRAINT "TheatreFacilityAssignment_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheatreFacilityAssignment" ADD CONSTRAINT "TheatreFacilityAssignment_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "TheatreFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReview" ADD CONSTRAINT "MovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReview" ADD CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheatreReview" ADD CONSTRAINT "TheatreReview_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheatreReview" ADD CONSTRAINT "TheatreReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheatreImage" ADD CONSTRAINT "TheatreImage_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
