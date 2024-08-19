import { UserAuthority } from "@prisma/client";
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
}