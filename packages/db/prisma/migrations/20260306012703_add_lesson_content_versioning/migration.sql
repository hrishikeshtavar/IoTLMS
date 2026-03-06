-- CreateTable
CREATE TABLE "LessonContent" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "content_json" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "approved_by" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentVersion" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "version_no" INTEGER NOT NULL,
    "content_json" JSONB NOT NULL,
    "diff_json" JSONB,
    "created_by" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonContent_lesson_id_locale_key" ON "LessonContent"("lesson_id", "locale");

-- AddForeignKey
ALTER TABLE "LessonContent" ADD CONSTRAINT "LessonContent_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "LessonContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
