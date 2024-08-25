import { UserWorkspace } from "@prisma/client";
import prisma from "../infra/db";
import { Authorities } from "../lib/auth";
import { Workspace, WorkspaceMember } from "../lib/workspace";
import { Approver } from "../schema/post";

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
                userAuthorities: {
                    where: {
                        workspaceId: workspaceId,
                        authorityId: Authorities.APPROVAL,
                    },
                    select: {
                        user: {
                            select: {
                                userId: true,
                                userName: true,
                            },
                        },
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
            allApprovers: workspace.userAuthorities.map((authority) => ({
                userId: authority.user.userId,
                userName: authority.user.userName,
            })),
        }));

        return formattedResult[0];
    }

    static async findWorkspaceInfoBy(workspaceId: number) {
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

    static async findWorkspaceByName(workspaceName: string): Promise<Workspace | null> {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: {
                    workspaceName: workspaceName
                },
            });

            return workspace;
        } catch (error) {
            console.error('ワークスペース名をキーにしてワークスペース情報を取得する処理でエラーが発生しました。:', error);
            throw error;
        }
    }

    static async updateWorkspace(workspaceId: number, newWorkspaceName: string, newDescription: string) {
        try {
            const updatedWorkspace = await prisma.workspace.update({
                where: {
                    workspaceId: workspaceId,
                },
                data: {
                    workspaceName: newWorkspaceName,
                    description: newDescription,
                },
            });

            return updatedWorkspace;
        } catch (error) {
            console.error('ワークスペース情報を更新する処理でエラーが発生しました。:', error);
            throw error;
        }
    }

    static async updateApprovalStep(workspaceId: number, newApprovalStep: number) {
        try {
            const updatedWorkspace = await prisma.workspace.update({
                where: {
                    workspaceId: workspaceId,
                },
                data: {
                    approvalStep: newApprovalStep,
                },
            });

            return updatedWorkspace;
        } catch (error) {
            console.error('approvalStepを更新する処理でエラーが発生しました。:', error);
            throw error;
        }
    }

    static async updateWorkspaceApprovalStepAndApprovers(workspaceId: number, newApprovalStep: number, approvers: Approver[]) {
        try {
            await prisma.$transaction(async (tx) => {
                // WorkspaceテーブルのapprovalStepを更新
                await tx.workspace.update({
                    where: { workspaceId },
                    data: { approvalStep: newApprovalStep },
                });

                // WorkspaceApproversテーブルの既存レコードを削除
                await tx.workspaceApprovers.deleteMany({
                    where: { workspaceId },
                });

                // 新しいApproverデータを挿入
                const approverInserts = approvers.map(approver => ({
                    workspaceId: workspaceId,
                    userId: approver.userId,
                    approvalStep: approver.approvalStep,
                }));

                await tx.workspaceApprovers.createMany({
                    data: approverInserts,
                });
            });

        } catch (error) {
            console.error('承認ルートを更新する処理でエラーが発生しました：', error);
            throw error;
        }
    }

    static async deleteWorkspace(workspaceId: number) {
        try {
            await prisma.workspace.delete({
                where: { workspaceId },
            });
        } catch (error) {
            console.error('ワークスペースを削除する処理でエラーが発生しました:', error);
            throw error;
        }
    }

    static async createWorkspace(userId: number, workspaceName: string, description: string): Promise<Workspace | null> {
        try {
            const createdWorkspace = await prisma.$transaction(async (prisma) => {
                // 1. workspace_idとdescriptionをもとにworkspacesにレコードを追加
                const newWorkspace = await prisma.workspace.create({
                    data: {
                        workspaceName: workspaceName,
                        description,
                    },
                });

                // 2. user_idとworkspace_idをもとにuser_workspacesにレコードを追加
                await prisma.userWorkspace.create({
                    data: {
                        userId,
                        workspaceId: newWorkspace.workspaceId,
                    },
                });

                // 3. user_idとworkspace_idをもとにuser_authoritiesにレコードを追加。
                const authorityIds = [Authorities.APPLICATION, Authorities.APPROVAL, Authorities.ADMIN];
                for (const authorityId of authorityIds) {
                    await prisma.userAuthority.create({
                        data: {
                            userId,
                            workspaceId: newWorkspace.workspaceId,
                            authorityId,
                        },
                    });
                }

                // 4. user_idとworkspace_idをもとにworkspace_approversにレコードを追加。approval_stepには1を入れる。
                await prisma.workspaceApprovers.create({
                    data: {
                        userId,
                        workspaceId: newWorkspace.workspaceId,
                        approvalStep: 1,
                    },
                });

                return newWorkspace;
            });

            return createdWorkspace;
        } catch (error) {
            console.error('ワークスペースを作成する処理でエラーが発生しました:', error);
            throw error;
        }
    }
}
