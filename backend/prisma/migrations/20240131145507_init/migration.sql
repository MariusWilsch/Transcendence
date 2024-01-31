/*
  Warnings:

  - You are about to drop the column `userIntraId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `Achievements` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lost` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `privateRoomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `winrate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `won` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userIntraId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_privateRoomId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userIntraId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Achievements",
DROP COLUMN "lost",
DROP COLUMN "privateRoomId",
DROP COLUMN "winrate",
DROP COLUMN "won",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("intraId");

-- CreateTable
CREATE TABLE "_PrivateRoomToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PrivateRoomToUser_AB_unique" ON "_PrivateRoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PrivateRoomToUser_B_index" ON "_PrivateRoomToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_fullname_key" ON "User"("fullname");

-- AddForeignKey
ALTER TABLE "_PrivateRoomToUser" ADD CONSTRAINT "_PrivateRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PrivateRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateRoomToUser" ADD CONSTRAINT "_PrivateRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;
