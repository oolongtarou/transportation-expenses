import { User, UserAuthority } from "@prisma/client";
import prisma from "../infra/db";


export class UserRepository {
    static async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: password
                }
            });
            return user;
        } catch (err) {
            console.trace(err);
            return null;
        }
    }

    static async findByWorkspaceId(workspaceId: number): Promise<UserAuthority[]> {
        try {
            const usersWithAuthorities = await prisma.userAuthority.findMany({
                where: {
                    workspaceId: workspaceId,
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            firstName: true,
                            lastName: true,
                            userName: true,
                        },
                    },
                },
                orderBy: [
                    {
                        userId: 'asc',
                    },
                    {
                        workspaceId: 'asc',
                    },
                    {
                        authorityId: 'asc',
                    },
                ],
            });

            return usersWithAuthorities;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

