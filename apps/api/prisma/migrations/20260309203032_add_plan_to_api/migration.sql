-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "max_students" INTEGER NOT NULL DEFAULT 30,
    "max_courses" INTEGER NOT NULL DEFAULT 5,
    "monthly_price" INTEGER NOT NULL DEFAULT 0,
    "features_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");
