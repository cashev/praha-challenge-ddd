/*
  Warnings:

  - You are about to drop the `Pair_User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[participantId,taskId]` on the table `TaskStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Pair_User" DROP CONSTRAINT "Pair_User_pairId_fkey";

-- DropForeignKey
ALTER TABLE "Pair_User" DROP CONSTRAINT "Pair_User_participantId_fkey";

-- DropTable
DROP TABLE "Pair_User";

-- CreateTable
CREATE TABLE "Pair_Participant" (
    "pairId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Team_Participant" (
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pair_Participant_participantId_key" ON "Pair_Participant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_Participant_pairId_participantId_key" ON "Pair_Participant"("pairId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Participant_participantId_key" ON "Team_Participant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Participant_teamId_participantId_key" ON "Team_Participant"("teamId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_participantId_taskId_key" ON "TaskStatus"("participantId", "taskId");

-- AddForeignKey
ALTER TABLE "Pair_Participant" ADD CONSTRAINT "Pair_Participant_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_Participant" ADD CONSTRAINT "Pair_Participant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Participant" ADD CONSTRAINT "Team_Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Participant" ADD CONSTRAINT "Team_Participant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
