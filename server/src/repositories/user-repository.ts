import { User, UserAuthority } from "@prisma/client";
import prisma from "../infra/db";
import { SignupFormData } from "../schema/post";
import { toHashed } from "../lib/cipher";


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

    static async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
                include: {
                    userWorkspaces: true,
                    userAuthorities: true,
                    applications: true,
                    WorkspaceApprovers: true,
                    AuditLog: true,
                },
            });

            return user;
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw error;
        }
    }

    static async createUser(data: SignupFormData): Promise<User | null> {
        try {
            const hashedPassword = toHashed(data.password);

            const newUser = await prisma.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userName: data.userName,
                    email: data.email,
                    password: hashedPassword,
                },
            });

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

