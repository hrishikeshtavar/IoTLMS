/*
  Warnings:

  - You are about to drop the column `plan_id` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_plan_id_fkey";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "plan_id";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Plan";

-- DropEnum
DROP TYPE "PaymentStatus";
