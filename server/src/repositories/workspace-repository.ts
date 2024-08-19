import { UserWorkspace } from "@prisma/client";
import prisma from "../infra/db";
import { Authorities } from "../lib/auth";
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

    static async findApproversBy(workspaceId: number) {
        const workspaces = await prisma.workspace.findMany({
            where: {
                workspaceId: workspaceId,
            },
            select: {
                workspaceId: true,
                approvalStep: true,
                WorkspaceApprovers: {
                    select: {
                        user: {
                            select: {
                                userId: true,
                                userName: true,
                            },
                        },
                        approvalStep: true,
                    },
                },
            },
        });

        const formattedResult = workspaces.map((workspace) => ({
            workspaceId: workspace.workspaceId,
            approvalStep: workspace.approvalStep,
            approvers: workspace.WorkspaceApprovers.map((approver) => ({
                userId: approver.user.userId,
                userName: approver.user.userName,
                approvalStep: approver.approvalStep,
            })),
        }));

        return formattedResult[0];
    }

    static async findWorkspaceInfoBy(workspaceId: number): Promise<Workspace | null> {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: {
                    workspaceId: workspaceId,
                },
            });

            return workspace;
        } catch (error) {
            console.error('ワークスペース情報を取得する処理でエラーが発生しました。:', error);
            throw error;
        }
    }

    static async inviteUser(userId: number, workspaceId: number) {
        try {
            await prisma.$transaction(async (prisma) => {
                // 1. user_workspaces テーブルにデータをインサート
                await prisma.userWorkspace.create({
                    data: {
                        userId: userId,
                        workspaceId: workspaceId,
                    },
                });

                // 2. user_authorities テーブルにデータをインサート
                await prisma.userAuthority.create({
                    data: {
                        userId: userId,
                        workspaceId: workspaceId,
                        authorityId: Authorities.APPLICATION,
                    },
                });
            });

        } catch (error) {
            console.error('ユーザーをワークスペースに招待する処理でエラーが発生しました:', error);
            throw error; // エラーが発生した場合、トランザクションはロールバックされます
        }
    }

    static async findUserWorkspace(userId: number, workspaceId: number): Promise<UserWorkspace | null> {
        try {
            const userWorkspace = await prisma.userWorkspace.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: userId,
                        workspaceId: workspaceId,
                    },
                },
            });

            return userWorkspace;
        } catch (error) {
            console.error('ユーザーワークスペースを取得する処理でエラーが発生しました:', error);
            throw error;
        }
    }
}
