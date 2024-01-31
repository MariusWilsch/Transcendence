/*
  Warnings:

  - Added the required column `channelName` to the `ChannelMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelName` to the `MemberShip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChannelMessage" DROP CONSTRAINT "ChannelMessage_channelId_fkey";

-- DropForeignKey
ALTER TABLE "MemberShip" DROP CONSTRAINT "MemberShip_channelId_fkey";

-- AlterTable
ALTER TABLE "ChannelMessage" ADD COLUMN     "channelName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MemberShip" ADD COLUMN     "channelName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMessage" ADD CONSTRAINT "ChannelMessage_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
