/*
  Warnings:

  - You are about to drop the column `recipient` on the `ChannelMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChannelMessage" DROP COLUMN "recipient",
ADD COLUMN     "Avatar" TEXT;
