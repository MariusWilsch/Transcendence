/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `Tfa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tfa_otp_key" ON "Tfa"("otp");
