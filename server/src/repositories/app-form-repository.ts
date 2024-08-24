import { Application } from "@prisma/client";
import prisma from "../infra/db";
import { AppFormDetail, ApplicationForm, Route, SearchOption } from "../schema/post";
import { ApplicationStatus } from "../enum/app-form";

export class AppFormRepository {
    static async findBy(applicationId: number): Promise<ApplicationForm | null> {
        try {
            const applicationData = await prisma.application.findUnique({
                where: {
                    applicationId: applicationId,
                },
                include: {
                    user: true, // User情報を取得
                    workspace: true, // Workspace情報を取得
                    status: true, // ApplicationStatus情報を取得
                    details: {
                        include: {
                            transportation: true, // Transportation情報を取得
                            routes: true, // ApplicationDetailRoute情報を取得
                        },
                    },
                },
            });

            if (!applicationData) {
                return null;
            }

            // ApplicationFormにマッピング
            const applicationForm: ApplicationForm = {
                applicationId: applicationData.applicationId,
                workspaceId: applicationData.workspaceId,
                applicationDate: applicationData.applicationDate?.toISOString() || '',
                userId: applicationData.userId,
                totalAmount: applicationData.totalAmount,
                title: applicationData.title,
                statusId: applicationData.statusId,
                user: {
                    userName: applicationData.user.userName,
                },
                status: {
                    statusName: applicationData.status.statusName,
                },
                details: applicationData.details.map(detail => {
                    const appFormDetail: AppFormDetail = {
                        id: detail.applicationDetailId,
                        date: detail.detailDate.toISOString().split('T')[0],
                        description: detail.description || '',
                        transportation: detail.transportationId,
                        transportationName: detail.transportation.transportationName,
                        routes: detail.routes.map(route => {
                            const routeDetail: Route = {
                                id: route.routeId,
                                departureId: route.departure,
                                departureName: route.departure, // 必要に応じて変換
                                arrivalId: route.arrival,
                                arrivalName: route.arrival, // 必要に応じて変換
                                lineId: route.line,
                                lineName: route.line, // 必要に応じて変換
                            };
                            return routeDetail;
                        }),
                        oneWayAmount: detail.oneWayAmount,
                        isRoundTrip: detail.isRoundtrip,
                        detailAmount: detail.detailAmount,
                        // `isDialogOpen` は外部で管理するのが望ましいが、暫定的にfalseで初期化
                        isDialogOpen: false,
                    };
                    return appFormDetail;
                }),
            };

            return applicationForm;
        } catch (error) {
            console.error("Failed to retrieve application data:", error);
            throw new Error("Failed to retrieve application data");
        }
    }

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

    static async findBySearchOption(workspaceId: number, options: SearchOption, userId?: number,): Promise<Application[] | null> {
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
                    user: options.userName ? {
                        userName: {
                            contains: options.userName,
                        },
                    } : undefined,
                    title: options.title ? {
                        contains: options.title,
                    } : undefined,
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
                skip: (options.page - 1) * options.numberOfItems,
                take: options.numberOfItems,
            });
            return applications;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async fetchCountBySearchOption(workspaceId: number, options: SearchOption, userId?: number): Promise<number> {
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
                    user: options.userName ? {
                        userName: {
                            contains: options.userName,
                        },
                    } : undefined,
                    title: options.title ? {
                        contains: options.title,
                    } : undefined,
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
                        title: form.title,
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

    static async saveDraft(form: ApplicationForm) {
        try {
            const application = await prisma.application.create({
                data: {
                    workspaceId: form.workspaceId,
                    userId: form.userId,
                    applicationDate: new Date(form.applicationDate),
                    statusId: form.statusId,
                    totalAmount: form.totalAmount,
                    title: form.title,
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

            return application;
        } catch (err) {
            console.error(err);
            throw new Error("下書き保存に失敗しました。");
        }
    }

    static async updateDraft(form: ApplicationForm) {
        try {
            const application = await prisma.application.update({
                where: { applicationId: form.applicationId },  // 一致する application_id で検索
                data: {
                    workspaceId: form.workspaceId,
                    userId: form.userId,
                    applicationDate: new Date(form.applicationDate),
                    statusId: form.statusId,
                    totalAmount: form.totalAmount,
                    title: form.title,
                    details: {
                        deleteMany: {}, // 既存のdetailsを削除
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

            return application;
        } catch (err) {
            console.error(err);
            throw new Error("下書き更新に失敗しました。");
        }
    }

    static async deleteAppForm(applicationId: number) {
        try {
            const deletedApplication = await prisma.application.delete({
                where: { applicationId: applicationId },  // 一致する application_id で検索して削除
                include: {
                    details: {
                        include: {
                            routes: true,
                        },
                    },
                },
            });

            return deletedApplication;
        } catch (err) {
            console.error(err);
            throw new Error("申請書の削除に失敗しました。");
        }
    }

    static async findApplicationsByWorkspaceAndStatus(workspaceId: number, statusId: number): Promise<Application[]> {
        try {
            const applications = await prisma.application.findMany({
                where: {
                    workspaceId: workspaceId,
                    statusId: statusId,
                },
            });

            return applications;
        } catch (error) {
            console.error('workspaceIdとstatusIdが一致するレコードを抽出する処理でエラーが発生しました。:', error);
            throw error;
        }
    }

    /**
     * 申請書を承認する(ステータスを受領待ちに変える)
     *
     * @static
     * @param {number} applicationId
     * @return {*}  {Promise<number>}
     * @memberof AppFormRepository
     */
    static async approve(applicationId: number): Promise<number> {
        return await this.updateStatus(applicationId, ApplicationStatus.Receiving);
    }

    /**
     * 申請書を受領登録する(ステータスを受領済みに変える)
     *
     * @static
     * @param {number} applicationId
     * @return {*}  {Promise<number>}
     * @memberof AppFormRepository
     */
    static async receive(applicationId: number): Promise<number> {
        return await this.updateStatus(applicationId, ApplicationStatus.Received);
    }

    /**
     * 申請書を却下する(ステータスを却下に変える)
     *
     * @static
     * @param {number} applicationId
     * @return {*}  {Promise<number>}
     * @memberof AppFormRepository
     */
    static async reject(applicationId: number): Promise<number> {
        return await this.updateStatus(applicationId, ApplicationStatus.Rejected);
    }

    /**
     * 指定されたapplicationIdのレコードのstatusIdを更新し、更新後のstatusIdを返す関数
     *
     * @private
     * @static
     * @param {number} applicationId - 更新対象のアプリケーションID
     * @param {number} statusId - 更新するステータスID
     * @return {Promise<number>} - 更新後のステータスIDを返すPromise
     * @memberof AppFormRepository
     */
    private static async updateStatus(applicationId: number, statusId: number): Promise<number> {
        try {
            const updatedApplication = await prisma.application.update({
                where: { applicationId: applicationId },
                data: { statusId: statusId },
                select: { statusId: true }, // 更新後のstatusIdのみを取得
            });

            return updatedApplication.statusId;
        } catch (error) {
            console.error(error);
            throw new Error(`Application ID ${applicationId} のステータス更新に失敗しました:`);
        }
    }
}