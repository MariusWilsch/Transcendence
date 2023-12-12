/*
  Warnings:

  - You are about to drop the column `TwoFASecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAuth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isTwoFAEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "TwoFASecret",
DROP COLUMN "isAuth",
DROP COLUMN "isTwoFAEnabled",
DROP COLUMN "name",
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "login" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_fullname_key" ON "User"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
