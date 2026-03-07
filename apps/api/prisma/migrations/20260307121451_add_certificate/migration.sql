-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "cert_code" TEXT NOT NULL,
    "score_pct" INTEGER NOT NULL DEFAULT 100,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_cert_code_key" ON "Certificate"("cert_code");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_user_id_course_id_key" ON "Certificate"("user_id", "course_id");
