/*
  Warnings:

  - You are about to drop the column `lostgames` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wongames` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lostgames",
DROP COLUMN "wongames";
