-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "approval_step" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "workspace_approvers" (
    "workspace_approver_id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "approval_step" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_approvers_pkey" PRIMARY KEY ("workspace_approver_id")
);

-- AddForeignKey
ALTER TABLE "workspace_approvers" ADD CONSTRAINT "workspace_approvers_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_approvers" ADD CONSTRAINT "workspace_approvers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_approvers" ADD CONSTRAINT "workspace_approvers_workspace_id_user_id_fkey" FOREIGN KEY ("workspace_id", "user_id") REFERENCES "user_workspaces"("workspace_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
