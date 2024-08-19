/*
  Warnings:

  - You are about to alter the column `departure` on the `application_detail_routes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `arrival` on the `application_detail_routes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `line` on the `application_detail_routes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `status_name` on the `application_statuses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `authority_name` on the `authorities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `line_name` on the `railway_lines` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `station_name` on the `stations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `transportation_name` on the `transportations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `user_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `workspace_name` on the `workspaces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `description` on the `workspaces` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "application_detail_routes" ALTER COLUMN "departure" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "arrival" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "line" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "application_statuses" ALTER COLUMN "status_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "authorities" ALTER COLUMN "authority_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "railway_lines" ALTER COLUMN "line_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "stations" ALTER COLUMN "station_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "transportations" ALTER COLUMN "transportation_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "user_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "workspace_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(50);
