/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PrivateRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PrivateRoom_name_key" ON "PrivateRoom"("name");
