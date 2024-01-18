/*
  Warnings:

  - Added the required column `desplayName` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "desplayName" TEXT NOT NULL;
