/*
  Warnings:

  - You are about to drop the column `teamId` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `pairId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pairId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Pair" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pairId",
DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "Pair_User" (
    "pairId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Team_Pair" (
    "teamId" INTEGER NOT NULL,
    "pairId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pair_User_userId_key" ON "Pair_User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_User_pairId_userId_key" ON "Pair_User"("pairId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Pair_pairId_key" ON "Team_Pair"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Pair_teamId_pairId_key" ON "Team_Pair"("teamId", "pairId");

-- AddForeignKey
ALTER TABLE "Pair_User" ADD CONSTRAINT "Pair_User_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_User" ADD CONSTRAINT "Pair_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
