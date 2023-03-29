/*
  Warnings:

  - You are about to drop the column `userId` on the `Pair_User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TaskStatus` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[participantId]` on the table `Pair_User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pairId,participantId]` on the table `Pair_User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participantId` to the `Pair_User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `TaskStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pair_User" DROP CONSTRAINT "Pair_User_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskStatus" DROP CONSTRAINT "TaskStatus_userId_fkey";

-- DropIndex
DROP INDEX "Pair_User_pairId_userId_key";

-- DropIndex
DROP INDEX "Pair_User_userId_key";

-- AlterTable
ALTER TABLE "Pair_User" DROP COLUMN "userId",
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TaskStatus" DROP COLUMN "userId",
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_User_participantId_key" ON "Pair_User"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_User_pairId_participantId_key" ON "Pair_User"("pairId", "participantId");

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_User" ADD CONSTRAINT "Pair_User_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
