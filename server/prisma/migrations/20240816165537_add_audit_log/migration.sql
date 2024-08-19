-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "approval_step" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "audit_log" (
    "audit_log_id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "before_status" INTEGER,
    "after_status" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("audit_log_id")
);

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_after_status_fkey" FOREIGN KEY ("after_status") REFERENCES "application_statuses"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
