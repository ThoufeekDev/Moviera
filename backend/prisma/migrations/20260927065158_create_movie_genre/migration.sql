/*
  Warnings:

  - The values [COUPLE] on the enum `SeatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PAYMENT_FAILED';

-- AlterEnum
BEGIN;
CREATE TYPE "SeatType_new" AS ENUM ('REGULAR', 'PREMIUM', 'RECLINER', 'WHEELCHAIR', 'SOFA');
ALTER TABLE "Seat" ALTER COLUMN "type" TYPE "SeatType_new" USING ("type"::text::"SeatType_new");
ALTER TYPE "SeatType" RENAME TO "SeatType_old";
ALTER TYPE "SeatType_new" RENAME TO "SeatType";
DROP TYPE "public"."SeatType_old";
COMMIT;

-- DropIndex
DROP INDEX "Seat_screenId_idx";

-- DropIndex
DROP INDEX "Seat_screenId_label_key";

-- DropIndex
DROP INDEX "ShowSeat_showId_idx";

-- DropIndex
DROP INDEX "ShowSeat_showId_seatId_key";

-- CreateTable
CREATE TABLE "TheatreAdminAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TheatreAdminAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TheatreAdminAssignment_userId_idx" ON "TheatreAdminAssignment"("userId");

-- CreateIndex
CREATE INDEX "TheatreAdminAssignment_theatreId_idx" ON "TheatreAdminAssignment"("theatreId");

-- CreateIndex
CREATE UNIQUE INDEX "TheatreAdminAssignment_userId_theatreId_key" ON "TheatreAdminAssignment"("userId", "theatreId");

-- CreateIndex
CREATE INDEX "MovieGenre_movieId_idx" ON "MovieGenre"("movieId");

-- CreateIndex
CREATE INDEX "MovieGenre_genreId_idx" ON "MovieGenre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieGenre_movieId_genreId_key" ON "MovieGenre"("movieId", "genreId");

-- CreateIndex
CREATE INDEX "ShowSeat_showId_seatId_idx" ON "ShowSeat"("showId", "seatId");

-- CreateIndex
CREATE INDEX "Theatre_latitude_longitude_idx" ON "Theatre"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "TheatreAdminAssignment" ADD CONSTRAINT "TheatreAdminAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheatreAdminAssignment" ADD CONSTRAINT "TheatreAdminAssignment_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
