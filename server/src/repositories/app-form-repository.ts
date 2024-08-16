import { Application } from "@prisma/client";
import prisma from "../infra/db";
import { ApplicationForm, SearchOption } from "../schema/post";

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
                        gte: options.applicationIdMin ? Number(options.applicationIdMin) : undefined, // applicationIdMinがNOT NULLのときのみ適用
                        lte: options.applicationIdMax ? Number(options.applicationIdMax) : undefined, // applicationIdMaxがNOT NULLのときのみ適用
                    },
                    totalAmount: {
                        gte: options.totalAmountMin ? Number(options.totalAmountMin) : undefined, // totalAmountMinがNOT NULLのときのみ適用
                        lte: options.totalAmountMax ? Number(options.totalAmountMax) : undefined, // totalAmountMaxがNOT NULLのときのみ適用
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
                        gte: options.applicationIdMin ? Number(options.applicationIdMin) : undefined, // applicationIdMinがNOT NULLのときのみ適用
                        lte: options.applicationIdMax ? Number(options.applicationIdMax) : undefined, // applicationIdMaxがNOT NULLのときのみ適用
                    },
                    totalAmount: {
                        gte: options.totalAmountMin ? Number(options.totalAmountMin) : undefined, // totalAmountMinがNOT NULLのときのみ適用
                        lte: options.totalAmountMax ? Number(options.totalAmountMax) : undefined, // totalAmountMaxがNOT NULLのときのみ適用
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

    static async createNewAppForm(form: ApplicationForm) {
        try {
            // トランザクションを開始
            const result = await prisma.$transaction(async (prisma) => {
                // applicationsテーブルにデータをインサート
                const application = await prisma.application.create({
                    data: {
                        workspaceId: form.workspaceId,
                        userId: form.userId,
                        applicationDate: new Date(form.applicationDate),
                        statusId: form.statusId,
                        totalAmount: form.totalAmount,
                        details: {
                            create: form.details.map(detail => ({
                                applicationDetailId: detail.id,
                                detailDate: new Date(detail.date),
                                description: detail.description,
                                transportationId: detail.transportation,
                                oneWayAmount: detail.oneWayAmount,
                                isRoundtrip: detail.isRoundTrip,
                                detailAmount: detail.isRoundTrip ? detail.oneWayAmount * 2 : detail.oneWayAmount,
                                routes: {
                                    create: detail.routes.map(route => ({
                                        departure: route.departureName,
                                        arrival: route.arrivalName,
                                        line: route.lineName,
                                    })),
                                },
                            })),
                        },
                    },
                    include: {
                        details: {
                            include: {
                                routes: true,
                            },
                        },
                    },
                });

                // audit_logテーブルにデータをインサート
                await prisma.auditLog.create({
                    data: {
                        applicationId: application.applicationId,
                        beforeStatus: null,
                        afterStatus: form.statusId,
                        userId: form.userId,
                        userName: '山田 太郎',
                    },
                });

                return application;
            });

            return result;
        } catch (err) {
            console.error(err);
            throw new Error("申請書作成処理に失敗しました。");
        }
    }
}