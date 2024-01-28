-- CreateEnum
CREATE TYPE "MatchOutcome" AS ENUM ('FINSIHED', 'UNDEFINED');

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" SERIAL NOT NULL,
    "winnerId" TEXT,
    "loserId" TEXT,
    "score" JSONB NOT NULL,
    "outcome" "MatchOutcome" NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchHistory_winnerId_loserId_matchDate_key" ON "MatchHistory"("winnerId", "loserId", "matchDate");

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("intraId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("intraId") ON DELETE SET NULL ON UPDATE CASCADE;
