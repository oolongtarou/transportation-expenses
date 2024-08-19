-- AlterTable
ALTER TABLE "application_statuses" ALTER COLUMN "status_id" DROP DEFAULT;
DROP SEQUENCE "application_statuses_status_id_seq";

-- AlterTable
ALTER TABLE "authorities" ALTER COLUMN "authority_id" DROP DEFAULT;
DROP SEQUENCE "authorities_authority_id_seq";
