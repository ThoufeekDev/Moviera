/*
  Warnings:

  - You are about to drop the column `certificate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `certification` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryGenreId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cinemaFormatId` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Certification" AS ENUM ('U', 'UA', 'A', 'S');

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "certificate",
DROP COLUMN "genre",
ADD COLUMN     "certification" "Certification" NOT NULL,
ADD COLUMN     "primaryGenreId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "cinemaFormatId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCinemaFormat" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "cinemaFormatId" TEXT NOT NULL,

    CONSTRAINT "MovieCinemaFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CinemaFormat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CinemaFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenCinemaFormat" (
    "id" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "cinemaFormatId" TEXT NOT NULL,

    CONSTRAINT "ScreenCinemaFormat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "MovieCinemaFormat_movieId_idx" ON "MovieCinemaFormat"("movieId");

-- CreateIndex
CREATE INDEX "MovieCinemaFormat_cinemaFormatId_idx" ON "MovieCinemaFormat"("cinemaFormatId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieCinemaFormat_movieId_cinemaFormatId_key" ON "MovieCinemaFormat"("movieId", "cinemaFormatId");

-- CreateIndex
CREATE UNIQUE INDEX "CinemaFormat_name_key" ON "CinemaFormat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CinemaFormat_slug_key" ON "CinemaFormat"("slug");

-- CreateIndex
CREATE INDEX "ScreenCinemaFormat_screenId_idx" ON "ScreenCinemaFormat"("screenId");

-- CreateIndex
CREATE INDEX "ScreenCinemaFormat_cinemaFormatId_idx" ON "ScreenCinemaFormat"("cinemaFormatId");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenCinemaFormat_screenId_cinemaFormatId_key" ON "ScreenCinemaFormat"("screenId", "cinemaFormatId");

-- CreateIndex
CREATE INDEX "Movie_primaryGenreId_idx" ON "Movie"("primaryGenreId");

-- CreateIndex
CREATE INDEX "Show_cinemaFormatId_idx" ON "Show"("cinemaFormatId");

-- AddForeignKey
ALTER TABLE "MovieCinemaFormat" ADD CONSTRAINT "MovieCinemaFormat_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCinemaFormat" ADD CONSTRAINT "MovieCinemaFormat_cinemaFormatId_fkey" FOREIGN KEY ("cinemaFormatId") REFERENCES "CinemaFormat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_primaryGenreId_fkey" FOREIGN KEY ("primaryGenreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenCinemaFormat" ADD CONSTRAINT "ScreenCinemaFormat_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenCinemaFormat" ADD CONSTRAINT "ScreenCinemaFormat_cinemaFormatId_fkey" FOREIGN KEY ("cinemaFormatId") REFERENCES "CinemaFormat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_cinemaFormatId_fkey" FOREIGN KEY ("cinemaFormatId") REFERENCES "CinemaFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
