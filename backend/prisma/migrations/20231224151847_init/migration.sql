/*
  Warnings:

  - Added the required column `name` to the `PrivateRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrivateRoom" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "participantsIds" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("intraId");

-- CreateTable
CREATE TABLE "_MessageToPrivateRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PrivateRoomToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessageToPrivateRoom_AB_unique" ON "_MessageToPrivateRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageToPrivateRoom_B_index" ON "_MessageToPrivateRoom"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PrivateRoomToUser_AB_unique" ON "_PrivateRoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PrivateRoomToUser_B_index" ON "_PrivateRoomToUser"("B");

-- AddForeignKey
ALTER TABLE "_MessageToPrivateRoom" ADD CONSTRAINT "_MessageToPrivateRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToPrivateRoom" ADD CONSTRAINT "_MessageToPrivateRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "PrivateRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateRoomToUser" ADD CONSTRAINT "_PrivateRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PrivateRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateRoomToUser" ADD CONSTRAINT "_PrivateRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;
