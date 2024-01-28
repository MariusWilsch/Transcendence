/*
  Warnings:

  - You are about to drop the column `outcome` on the `MatchHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "outcome",
ADD COLUMN     "user1Avatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "user1Login" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "user2Avatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "user2Login" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "score" SET DEFAULT '0-0',
ALTER COLUMN "score" SET DATA TYPE TEXT;
