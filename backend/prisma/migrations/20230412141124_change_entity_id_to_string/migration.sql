/*
  Warnings:

  - The primary key for the `Pair` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TaskStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Pair_User" DROP CONSTRAINT "Pair_User_pairId_fkey";

-- DropForeignKey
ALTER TABLE "Pair_User" DROP CONSTRAINT "Pair_User_participantId_fkey";

-- DropForeignKey
ALTER TABLE "TaskStatus" DROP CONSTRAINT "TaskStatus_participantId_fkey";

-- DropForeignKey
ALTER TABLE "TaskStatus" DROP CONSTRAINT "TaskStatus_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Team_Pair" DROP CONSTRAINT "Team_Pair_pairId_fkey";

-- DropForeignKey
ALTER TABLE "Team_Pair" DROP CONSTRAINT "Team_Pair_teamId_fkey";

-- AlterTable
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pair_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pair_id_seq";

-- AlterTable
ALTER TABLE "Pair_User" ALTER COLUMN "pairId" SET DATA TYPE TEXT,
ALTER COLUMN "participantId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Participant_id_seq";

-- AlterTable
ALTER TABLE "Task" DROP CONSTRAINT "Task_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Task_id_seq";

-- AlterTable
ALTER TABLE "TaskStatus" DROP CONSTRAINT "TaskStatus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "taskId" SET DATA TYPE TEXT,
ALTER COLUMN "participantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TaskStatus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TaskStatus_id_seq";

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Team_id_seq";

-- AlterTable
ALTER TABLE "Team_Pair" ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ALTER COLUMN "pairId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_User" ADD CONSTRAINT "Pair_User_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_User" ADD CONSTRAINT "Pair_User_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
