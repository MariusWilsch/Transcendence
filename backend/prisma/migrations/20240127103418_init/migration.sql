/*
  Warnings:

  - Changed the type of `outcome` on the `MatchHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "outcome",
ADD COLUMN     "outcome" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "MatchOutcome";
