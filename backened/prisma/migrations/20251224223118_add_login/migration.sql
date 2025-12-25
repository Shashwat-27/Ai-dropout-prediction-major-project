-- CreateTable
CREATE TABLE "Mentor" (
    "id" SERIAL NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Psychologist" (
    "id" SERIAL NOT NULL,
    "psych_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Psychologist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_mentor_id_key" ON "Mentor"("mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Psychologist_psych_id_key" ON "Psychologist"("psych_id");
