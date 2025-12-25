-- CreateTable
CREATE TABLE "StudentAnalysis" (
    "id" SERIAL NOT NULL,
    "admission_id" TEXT NOT NULL,
    "sentiment" TEXT,
    "emotion" TEXT,
    "risk_level" TEXT,
    "learning_phase" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "explanation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnalysis_admission_id_key" ON "StudentAnalysis"("admission_id");
