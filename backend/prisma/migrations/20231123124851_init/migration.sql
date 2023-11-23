-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "intraId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "Avatar" TEXT,
    "isAuth" BOOLEAN NOT NULL DEFAULT true,
    "TwoFASecret" TEXT,
    "isTwoFAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_intraId_key" ON "User"("intraId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
