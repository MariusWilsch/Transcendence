/*
  Warnings:

  - You are about to drop the column `isTfa` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isTfa",
ADD COLUMN     "isTfaEnabled" BOOLEAN NOT NULL DEFAULT true;
