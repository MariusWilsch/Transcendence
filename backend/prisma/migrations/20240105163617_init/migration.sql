/*
  Warnings:

  - The `type` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "type",
ADD COLUMN     "type" "ChannelType" NOT NULL DEFAULT 'PUBLIC';
