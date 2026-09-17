/*
  Warnings:

  - You are about to drop the column `language` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "language";

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieLanguage" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "MovieLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "MovieLanguage_movieId_idx" ON "MovieLanguage"("movieId");

-- CreateIndex
CREATE INDEX "MovieLanguage_languageId_idx" ON "MovieLanguage"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieLanguage_movieId_languageId_key" ON "MovieLanguage"("movieId", "languageId");

-- AddForeignKey
ALTER TABLE "MovieLanguage" ADD CONSTRAINT "MovieLanguage_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieLanguage" ADD CONSTRAINT "MovieLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
