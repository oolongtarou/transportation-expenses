-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "user_authorities" DROP CONSTRAINT "user_authorities_workspace_id_fkey";

-- AddForeignKey
ALTER TABLE "user_authorities" ADD CONSTRAINT "user_authorities_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE CASCADE ON UPDATE CASCADE;
