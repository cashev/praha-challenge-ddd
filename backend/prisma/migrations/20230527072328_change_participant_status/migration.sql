/*
  Warnings:

  - You are about to drop the column `status` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `status` to the `Pair_Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pair_Participant" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "status";
