/*
  Warnings:

  - A unique constraint covering the columns `[licenseNumber]` on the table `Theatre` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Theatre_licenseNumber_key" ON "Theatre"("licenseNumber");

-- CreateIndex
CREATE INDEX "Theatre_name_idx" ON "Theatre"("name");

-- CreateIndex
CREATE INDEX "Theatre_deletedAt_idx" ON "Theatre"("deletedAt");
