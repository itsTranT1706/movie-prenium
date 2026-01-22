-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "trailerUrl" TEXT,
ALTER COLUMN "provider" SET DEFAULT 'tmdb';
