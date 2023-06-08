/*
  Warnings:

  - You are about to drop the column `status` on the `Pair_Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pair_Participant" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "Team_Kyukai_Participant" (
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_Kyukai_Participant_participantId_key" ON "Team_Kyukai_Participant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Kyukai_Participant_teamId_participantId_key" ON "Team_Kyukai_Participant"("teamId", "participantId");

-- AddForeignKey
ALTER TABLE "Team_Kyukai_Participant" ADD CONSTRAINT "Team_Kyukai_Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Kyukai_Participant" ADD CONSTRAINT "Team_Kyukai_Participant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
