/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_PrivateRoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PrivateRoomToUser" DROP CONSTRAINT "_PrivateRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrivateRoomToUser" DROP CONSTRAINT "_PrivateRoomToUser_B_fkey";

-- DropIndex
DROP INDEX "User_fullname_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "Achievements" TEXT[],
ADD COLUMN     "lost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "privateRoomId" INTEGER,
ADD COLUMN     "winrate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "won" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_PrivateRoomToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_privateRoomId_fkey" FOREIGN KEY ("privateRoomId") REFERENCES "PrivateRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
