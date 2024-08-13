import { Application } from "@prisma/client";
import prisma from "../infra/db";

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
}