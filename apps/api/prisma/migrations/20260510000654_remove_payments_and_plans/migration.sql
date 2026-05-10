-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_student_id_fkey";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
