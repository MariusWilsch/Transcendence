-- CreateTable
CREATE TABLE "User" (
    "intraId" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "Avatar" TEXT,
    "isTfa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Tfa" (
    "intraId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_intraId_key" ON "User"("intraId");

-- CreateIndex
CREATE UNIQUE INDEX "User_fullname_key" ON "User"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tfa_intraId_key" ON "Tfa"("intraId");

-- AddForeignKey
ALTER TABLE "Tfa" ADD CONSTRAINT "Tfa_intraId_fkey" FOREIGN KEY ("intraId") REFERENCES "User"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;
