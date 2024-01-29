/*
  Warnings:

  - You are about to drop the `_MessageToPrivateRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MessageToPrivateRoom" DROP CONSTRAINT "_MessageToPrivateRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToPrivateRoom" DROP CONSTRAINT "_MessageToPrivateRoom_B_fkey";

-- DropTable
DROP TABLE "_MessageToPrivateRoom";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_PrivateRoomName_fkey" FOREIGN KEY ("PrivateRoomName") REFERENCES "PrivateRoom"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
