/*
  Warnings:

  - You are about to drop the column `hospitalImage` on the `Hospital` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "hospitalImage",
ADD COLUMN     "imageUrl" TEXT;
