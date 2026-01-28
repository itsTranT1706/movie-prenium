/*
  Warnings:

  - You are about to drop the column `progress` on the `watch_history` table. All the data in the column will be lost.
  - You are about to drop the column `watchedAt` on the `watch_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,movieId,episodeNumber]` on the table `watch_history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "watch_history" DROP COLUMN "progress",
DROP COLUMN "watchedAt",
ADD COLUMN     "episodeNumber" INTEGER,
ADD COLUMN     "firstWatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastWatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "watch_history_userId_movieId_episodeNumber_key" ON "watch_history"("userId", "movieId", "episodeNumber");
