/*
  Warnings:

  - The primary key for the `MemberShip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MemberShip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MemberShip" DROP CONSTRAINT "MemberShip_pkey",
DROP COLUMN "id",
ALTER COLUMN "mutedTime" DROP NOT NULL,
ADD CONSTRAINT "MemberShip_pkey" PRIMARY KEY ("memberId");
