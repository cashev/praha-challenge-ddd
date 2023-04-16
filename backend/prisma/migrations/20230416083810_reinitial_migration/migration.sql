-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatus" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "TaskStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair_Participant" (
    "pairId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team_Pair" (
    "teamId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Team_Participant" (
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_participantId_taskId_key" ON "TaskStatus"("participantId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_Participant_participantId_key" ON "Pair_Participant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_Participant_pairId_participantId_key" ON "Pair_Participant"("pairId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Pair_pairId_key" ON "Team_Pair"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Pair_teamId_pairId_key" ON "Team_Pair"("teamId", "pairId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Participant_participantId_key" ON "Team_Participant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Participant_teamId_participantId_key" ON "Team_Participant"("teamId", "participantId");

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_Participant" ADD CONSTRAINT "Pair_Participant_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair_Participant" ADD CONSTRAINT "Pair_Participant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Pair" ADD CONSTRAINT "Team_Pair_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Participant" ADD CONSTRAINT "Team_Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_Participant" ADD CONSTRAINT "Team_Participant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
