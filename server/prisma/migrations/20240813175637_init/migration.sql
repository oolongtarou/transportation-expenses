/*
  Warnings:

  - Made the column `transportation_name` on table `transportations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "application_details" ALTER COLUMN "one_way_amount" SET DEFAULT 0,
ALTER COLUMN "detail_amount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "total_amount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "railway_lines" ALTER COLUMN "line_id" DROP DEFAULT;
DROP SEQUENCE "railway_lines_line_id_seq";

-- AlterTable
ALTER TABLE "stations" ALTER COLUMN "station_id" DROP DEFAULT;
DROP SEQUENCE "stations_station_id_seq";

-- AlterTable
ALTER TABLE "transportations" ALTER COLUMN "transportation_name" SET NOT NULL;
