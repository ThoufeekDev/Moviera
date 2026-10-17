/*
  Warnings:

  - A unique constraint covering the columns `[googlePlaceId]` on the table `Theatre` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "googlePlaceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Theatre_googlePlaceId_key" ON "Theatre"("googlePlaceId");
