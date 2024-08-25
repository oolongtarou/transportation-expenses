-- DropForeignKey
ALTER TABLE "audit_log" DROP CONSTRAINT "audit_log_application_id_fkey";

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("application_id") ON DELETE CASCADE ON UPDATE CASCADE;
