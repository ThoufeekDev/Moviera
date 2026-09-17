-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCast" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "character" TEXT,

    CONSTRAINT "MovieCast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCrew" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "job" TEXT NOT NULL,

    CONSTRAINT "MovieCrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieCast_movieId_idx" ON "MovieCast"("movieId");

-- CreateIndex
CREATE INDEX "MovieCast_personId_idx" ON "MovieCast"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieCast_movieId_personId_character_key" ON "MovieCast"("movieId", "personId", "character");

-- CreateIndex
CREATE INDEX "MovieCrew_movieId_idx" ON "MovieCrew"("movieId");

-- CreateIndex
CREATE INDEX "MovieCrew_personId_idx" ON "MovieCrew"("personId");

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCast" ADD CONSTRAINT "MovieCast_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCrew" ADD CONSTRAINT "MovieCrew_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCrew" ADD CONSTRAINT "MovieCrew_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
