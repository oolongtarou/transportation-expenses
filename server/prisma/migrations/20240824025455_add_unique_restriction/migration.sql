/*
  Warnings:

  - A unique constraint covering the columns `[status_name]` on the table `application_statuses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authority_name]` on the table `authorities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transportation_name]` on the table `transportations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspace_name]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "application_statuses_status_name_key" ON "application_statuses"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "authorities_authority_name_key" ON "authorities"("authority_name");

-- CreateIndex
CREATE UNIQUE INDEX "transportations_transportation_name_key" ON "transportations"("transportation_name");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_workspace_name_key" ON "workspaces"("workspace_name");
