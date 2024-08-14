import { Application } from "@prisma/client";
import prisma from "../infra/db";
import { SearchOption } from "../schema/post";

export class AppFormRepository {
    static async findByUserIdAndWorkspaceId(userId: number, workspaceId: number): Promise<Application[] | null> {
        try {
            const applications = await prisma.application.findMany({
                include: {
                    user: {
                        select: {
                            userName: true,
                        },
                    },
                    status: {
                        select: {
                            statusName: true,
                        },
                    },
                },
            });

            return applications;
        } catch (err) {
            console.trace(err);
            return null;
        }
    }

    static async findBySearchOption(userId: number, workspaceId: number, options: SearchOption): Promise<Application[] | null> {
        try {
            const applications = await prisma.application.findMany({
                where: {
                    userId: userId,
                    workspaceId: workspaceId,
                    applicationId: {
                        gte: options.applicationIdMin ?? undefined, // applicationIdMinがNOT NULLのときのみ適用
                        lte: options.applicationIdMax ?? undefined, // applicationIdMaxがNOT NULLのときのみ適用
                    },
                    totalAmount: {
                        gte: options.totalAmountMin ?? undefined, // totalAmountMinがNOT NULLのときのみ適用
                        lte: options.totalAmountMax ?? undefined, // totalAmountMaxがNOT NULLのときのみ適用
                    },
                    statusId: options.status && options.status.length > 0 ? { in: options.status } : undefined, // statusがNOT NULLかつ要素数1以上のときのみ適用
                    applicationDate: {
                        gte: options.startDate ? new Date(options.startDate) : undefined,
                        lte: options.endDate ? new Date(options.endDate) : undefined,
                    },
                },
                include: {
                    user: {
                        select: {
                            userName: true, // userNameフィールドを含める
                        },
                    },
                    status: {
                        select: {
                            statusName: true,
                        },
                    },
                },
                skip: (options.page - 1) * Number(process.env.ITEMS_PER_PAGE), // 最初の20件をスキップ
                take: Number(process.env.ITEMS_PER_PAGE), // 次の20件を取得
            });
            return applications;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async fetchCountBySearchOption(userId: number, workspaceId: number, options: SearchOption): Promise<number> {
        try {
            const count = await prisma.application.count({
                where: {
                    userId: userId,
                    workspaceId: workspaceId,
                    applicationId: {
                        gte: options.applicationIdMin ?? undefined, // applicationIdMinがNOT NULLのときのみ適用
                        lte: options.applicationIdMax ?? undefined, // applicationIdMaxがNOT NULLのときのみ適用
                    },
                    totalAmount: {
                        gte: options.totalAmountMin ?? undefined, // totalAmountMinがNOT NULLのときのみ適用
                        lte: options.totalAmountMax ?? undefined, // totalAmountMaxがNOT NULLのときのみ適用
                    },
                    statusId: options.status && options.status.length > 0 ? { in: options.status } : undefined, // statusがNOT NULLかつ要素数1以上のときのみ適用
                    applicationDate: {
                        gte: options.startDate ? new Date(options.startDate) : undefined,
                        lte: options.endDate ? new Date(options.endDate) : undefined,
                    },
                },
            });
            return count;
        } catch (err) {
            console.error(err);
            return 0;
        }
    }
}