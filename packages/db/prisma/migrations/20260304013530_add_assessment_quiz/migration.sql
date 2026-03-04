-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'quiz',
    "max_score" INTEGER NOT NULL DEFAULT 100,
    "pass_score" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'mcq',
    "question_text" TEXT NOT NULL,
    "options_json" JSONB,
    "correct_answer" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "answers_json" JSONB NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "graded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
