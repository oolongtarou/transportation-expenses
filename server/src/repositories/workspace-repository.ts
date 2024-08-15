import { UserWorkspace } from "@prisma/client";
import prisma from "../infra/db";
import { Workspace, WorkspaceMember } from "../lib/workspace";

export class WorkspaceRepository {
    static async findByUserId(userId: number): Promise<Workspace[] | null> {
        try {
            const userWorkspaces = await prisma.userWorkspace.findMany({
                where: {
                    userId: userId
                },
                select: {
                    workspace: {
                        select: {
                            workspaceId: true,
                            workspaceName: true
                        }
                    }
                }
            });

            const workspaces: Workspace[] = userWorkspaces.map(uw => uw.workspace);
            return workspaces;
        } catch (err) {
            console.trace(err);
            return null;
        }
    }

    static async findWorkspaceMembers(workspaceId: number): Promise<WorkspaceMember[]> {
        try {
            const workspaceMembers: WorkspaceMember[] = await prisma.$queryRaw`
            SELECT 
                user_id AS "userId",
                last_name AS "lastName",
                first_name AS "firstName",
                user_name AS "userName",
                email,
                workspace_id AS "workspaceId",
                authority_ids AS "authorityIds"
            FROM workspace_members
            WHERE workspace_id = ${workspaceId};
        `;
            return workspaceMembers;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}