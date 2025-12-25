/*
  Warnings:

  - You are about to drop the column `ai_confidence` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `ai_risk_score` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `assignment_score` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `facial_emotion` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `follow_up_date` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `mentor_action` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `mentor_observation` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `psychologist_suggestion` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_by_psychologist` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `risk_explanation` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `social_sentiment` on the `MentorInsight` table. All the data in the column will be lost.
  - You are about to drop the column `text_sentiment` on the `MentorInsight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MentorInsight" DROP COLUMN "ai_confidence",
DROP COLUMN "ai_risk_score",
DROP COLUMN "assignment_score",
DROP COLUMN "facial_emotion",
DROP COLUMN "follow_up_date",
DROP COLUMN "mentor_action",
DROP COLUMN "mentor_observation",
DROP COLUMN "psychologist_suggestion",
DROP COLUMN "reviewed_by_psychologist",
DROP COLUMN "risk_explanation",
DROP COLUMN "social_sentiment",
DROP COLUMN "text_sentiment",
ADD COLUMN     "mentor_custom_action_plan" TEXT,
ADD COLUMN     "mentor_recommendation_action" TEXT,
ADD COLUMN     "mentor_review_notes" TEXT;
