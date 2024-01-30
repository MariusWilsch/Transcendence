/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_PrivateRoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PrivateRoomToUser" DROP CONSTRAINT "_PrivateRoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrivateRoomToUser" DROP CONSTRAINT "_PrivateRoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "userIntraId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "privateRoomId" INTEGER;

-- DropTable
DROP TABLE "_PrivateRoomToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_privateRoomId_fkey" FOREIGN KEY ("privateRoomId") REFERENCES "PrivateRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userIntraId_fkey" FOREIGN KEY ("userIntraId") REFERENCES "User"("intraId") ON DELETE SET NULL ON UPDATE CASCADE;
