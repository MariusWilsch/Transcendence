/*
  Warnings:

  - Added the required column `channelId` to the `MemberShip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MemberShip" DROP CONSTRAINT "MemberShip_memberId_fkey";

-- AlterTable
ALTER TABLE "MemberShip" ADD COLUMN     "channelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
