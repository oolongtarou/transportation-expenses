-- DropForeignKey
ALTER TABLE "application_detail_routes" DROP CONSTRAINT "application_detail_routes_application_id_application_detai_fkey";

-- DropForeignKey
ALTER TABLE "application_details" DROP CONSTRAINT "application_details_application_id_fkey";

-- AddForeignKey
ALTER TABLE "application_details" ADD CONSTRAINT "application_details_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("application_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_detail_routes" ADD CONSTRAINT "application_detail_routes_application_id_application_detai_fkey" FOREIGN KEY ("application_id", "application_detail_id") REFERENCES "application_details"("application_id", "application_detail_id") ON DELETE CASCADE ON UPDATE CASCADE;
