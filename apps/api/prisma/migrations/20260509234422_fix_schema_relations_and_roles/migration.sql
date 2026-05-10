/*
  Warnings:

  - The `status` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `LabSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `student` on the `Payment` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `brand_config` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_hash` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'student');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "LabStatus" AS ENUM ('active', 'completed', 'abandoned');

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "BrandKit" DROP CONSTRAINT "BrandKit_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "ContentVersion" DROP CONSTRAINT "ContentVersion_content_id_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "LabSession" DROP CONSTRAINT "LabSession_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_course_id_fkey";

-- DropForeignKey
ALTER TABLE "LessonContent" DROP CONSTRAINT "LessonContent_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "status",
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN "tenant_id" TEXT;
UPDATE "Enrollment" SET "tenant_id" = (SELECT "tenant_id" FROM "Course" WHERE "Course"."id" = "Enrollment"."course_id");
ALTER TABLE "Enrollment" ALTER COLUMN "tenant_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "LabSession" DROP COLUMN "status",
ADD COLUMN     "status" "LabStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "student",
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'paid',
ADD COLUMN     "student_id" TEXT;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "brand_config";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refresh_token_hash",
ALTER COLUMN "tenant_id" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'student';

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_user_id_course_id_key" ON "Enrollment"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandKit" ADD CONSTRAINT "BrandKit_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonContent" ADD CONSTRAINT "LessonContent_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentVersion" ADD CONSTRAINT "ContentVersion_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "LessonContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSession" ADD CONSTRAINT "LabSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSession" ADD CONSTRAINT "LabSession_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
