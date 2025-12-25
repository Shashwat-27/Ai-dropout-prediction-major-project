-- CreateTable
CREATE TABLE "Student" (
    "admission_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "emergency" TEXT,
    "department" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "course" TEXT,
    "gpa" DOUBLE PRECISION,
    "attendance" INTEGER,
    "enrollmentDate" TIMESTAMP(3),
    "notes" TEXT,
    "extracurricular" TEXT,
    "disciplinary" TEXT,
    "risk" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("admission_id")
);

-- CreateTable
CREATE TABLE "MentorInsight" (
    "id" SERIAL NOT NULL,
    "admission_id" TEXT NOT NULL,
    "assignment_score" DOUBLE PRECISION,
    "facial_emotion" TEXT,
    "text_sentiment" TEXT,
    "social_sentiment" TEXT,
    "ai_risk_score" TEXT,
    "ai_confidence" DOUBLE PRECISION,
    "risk_explanation" TEXT,
    "mentor_observation" TEXT,
    "mentor_action" TEXT,
    "psychologist_suggestion" TEXT,
    "follow_up_date" TIMESTAMP(3),
    "reviewed_by_mentor" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by_psychologist" BOOLEAN NOT NULL DEFAULT false,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiResult" (
    "id" SERIAL NOT NULL,
    "admission_id" TEXT NOT NULL,
    "ai_confidence" DOUBLE PRECISION,
    "engagement_score" DOUBLE PRECISION,
    "facial_emotion" TEXT,
    "text_sentiment" TEXT,
    "clarity_score" DOUBLE PRECISION,
    "social_sentiment" DOUBLE PRECISION,
    "ai_risk_score" DOUBLE PRECISION,
    "system_comments" TEXT,
    "ai_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsychologistReview" (
    "review_id" SERIAL NOT NULL,
    "admission_id" TEXT NOT NULL,
    "stability" TEXT,
    "anxiety_level" TEXT,
    "coping_mechanisms" TEXT,
    "academic_impact" TEXT,
    "observation" TEXT,
    "psychologist_recommendation_action" TEXT,
    "psychologist_name" TEXT,
    "review_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PsychologistReview_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "StudentShortResponse" (
    "admission_id" TEXT NOT NULL,
    "instagram_id" TEXT,
    "snapchat_id" TEXT,
    "study_source" TEXT,
    "time_preference" TEXT,
    "personality_word" TEXT,
    "friend_circle" TEXT,
    "has_best_friend" TEXT,
    "problem_sharing" TEXT,
    "support_seeking" TEXT,
    "group_vibe" TEXT,
    "favorite_social_app" TEXT,
    "drink_preference" TEXT,
    "today_mood" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentShortResponse_pkey" PRIMARY KEY ("admission_id")
);

-- CreateTable
CREATE TABLE "StudentTextAnswer" (
    "admission_id" TEXT NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,
    "question4" TEXT,
    "question5" TEXT,
    "question6" TEXT,
    "question7" TEXT,
    "question8" TEXT,
    "ai_sentiment" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTextAnswer_pkey" PRIMARY KEY ("admission_id")
);

-- CreateTable
CREATE TABLE "StudentVideoResponse" (
    "admission_id" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "video_duration" INTEGER,
    "ai_emotion" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentVideoResponse_pkey" PRIMARY KEY ("admission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorInsight_admission_id_key" ON "MentorInsight"("admission_id");

-- CreateIndex
CREATE UNIQUE INDEX "AiResult_admission_id_key" ON "AiResult"("admission_id");

-- CreateIndex
CREATE UNIQUE INDEX "PsychologistReview_admission_id_key" ON "PsychologistReview"("admission_id");

-- AddForeignKey
ALTER TABLE "MentorInsight" ADD CONSTRAINT "MentorInsight_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiResult" ADD CONSTRAINT "AiResult_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychologistReview" ADD CONSTRAINT "PsychologistReview_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentShortResponse" ADD CONSTRAINT "StudentShortResponse_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTextAnswer" ADD CONSTRAINT "StudentTextAnswer_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentVideoResponse" ADD CONSTRAINT "StudentVideoResponse_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Student"("admission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
