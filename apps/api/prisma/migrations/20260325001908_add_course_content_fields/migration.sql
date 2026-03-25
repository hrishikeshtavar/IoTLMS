-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "description_hi" TEXT,
ADD COLUMN     "description_mr" TEXT,
ADD COLUMN     "duration_hours" INTEGER,
ADD COLUMN     "level" TEXT DEFAULT 'beginner',
ADD COLUMN     "playlist_url" TEXT,
ADD COLUMN     "price" INTEGER DEFAULT 0,
ADD COLUMN     "stream" TEXT DEFAULT 'GENERAL',
ADD COLUMN     "tags_json" JSONB,
ADD COLUMN     "target_grade" TEXT,
ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration_min" INTEGER DEFAULT 10,
ADD COLUMN     "is_preview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title_hi" TEXT,
ADD COLUMN     "title_mr" TEXT;
