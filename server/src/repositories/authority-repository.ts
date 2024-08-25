import { UserAuthority, WorkspaceApprovers } from "@prisma/client";
import prisma from "../infra/db";

export class AuthorityRepository {
    static async findByUserId(userId: number): Promise<UserAuthority[] | null> {
        try {
            const userAuthorities: UserAuthority[] | null = await prisma.userAuthority.findMany({
                where: {
                    userId: userId
                }
            });
            return userAuthorities;
        } catch (err) {
            console.trace(err);
            return null;
        }
    }


    /**
     * 対象のユーザーの特定のワークスペースの権限を更新する(デリーとインサートしている)
     * @static
     * @param {number} userId
     * @param {number} workspaceId
     * @param {number[]} authorityIds
     * @memberof AuthorityRepository
     */
    static async replaceAuthorities(userId: number, workspaceId: number, authorityIds: number[]) {
        try {
            await prisma.$transaction(async (prisma) => {
                await prisma.userAuthority.deleteMany({
                    where: {
                        userId: userId,
                        workspaceId: workspaceId,
                    },
                });

                for (const authorityId of authorityIds) {
                    await prisma.userAuthority.create({
                        data: {
                            userId: userId,
                            workspaceId: workspaceId,
                            authorityId: authorityId,
                        },
                    });
                }
            });
        } catch (error) {
            console.error(`user_id:${userId},workspace_id:${workspaceId}の権限を更新する処理に失敗しました:`, error);
            throw error;
        }
    }


    /**
     * 指定したuserIdのユーザーがcurrentStatusIdの申請書を承認するための権限を持っているかを探す
     *
     * @static
     * @param {number} userId
     * @param {number} currentStatusId
     * @return {*}  {(Promise<WorkspaceApprovers | null>)}
     * @memberof AuthorityRepository
     */
    static async findApprovalAuthority(userId: number, workspaceId: number, currentStatusId: number): Promise<WorkspaceApprovers | null> {
        const statusApprovalMapping: { [key: number]: number } = {
            11: 1,
            12: 2,
            13: 3,
            14: 4,
            15: 5,
        };

        const approvalStep = statusApprovalMapping[currentStatusId];

        if (!approvalStep)
            return null;

        const approver = await prisma.workspaceApprovers.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId,
                approvalStep: approvalStep,
            },
        });

        return approver;
    }
}