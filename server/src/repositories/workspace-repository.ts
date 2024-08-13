import { UserWorkspace } from "@prisma/client";
import prisma from "../infra/db";
import { Workspace } from "../lib/workspace";

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
}