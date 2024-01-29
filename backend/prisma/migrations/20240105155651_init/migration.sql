-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PUBLIC',
    "ownerId" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "description" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberShip" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "intraId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "isModerator" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedTime" TIMESTAMP(3) NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberShip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_ownerId_key" ON "Channel"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberShip_memberId_key" ON "MemberShip"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberShip_intraId_key" ON "MemberShip"("intraId");

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_intraId_fkey" FOREIGN KEY ("intraId") REFERENCES "User"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;
