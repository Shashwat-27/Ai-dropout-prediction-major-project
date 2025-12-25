/*
  Warnings:

  - You are about to drop the `AiResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiResult" DROP CONSTRAINT "AiResult_admission_id_fkey";

-- AlterTable
ALTER TABLE "StudentAnalysis" ADD COLUMN     "video_emotion" TEXT;

-- DropTable
DROP TABLE "AiResult";

-- AddForeignKey
ALTER TABLE "StudentAnalysis" ADD CONSTRAINT "StudentAnalysis_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
