import { User, UserAuthority } from "@prisma/client";
import prisma from "../infra/db";
import { SignupFormData } from "../schema/post";
import { toHashed } from "../lib/cipher";
import { Authorities } from "../lib/auth";


export class UserRepository {
    static async findById(userId: number): Promise<User | null> {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: {
                    userId: userId,
                    isDeleted: false,
                }
            });
            return user;
        } catch (err) {
            console.trace(err);
            return null;
        }
    }

    static async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: password,
                    isDeleted: false,
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
                    isDeleted: false,
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

    static async findByUserName(userName: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    userName: userName,
                    isDeleted: false,
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
            const transaction = await prisma.$transaction(async (prisma) => {
                // 1. ユーザーを作成する
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

                // 2. ワークスペースを作成する
                const newWorkspace = await prisma.workspace.create({
                    data: {
                        workspaceName: `${newUser.userName}さんのワークスペース`,
                        description: `${newUser.userName}さんのワークスペースです。`,
                        approvalStep: 1,
                    },
                });

                // 3. user_workspaces テーブルにデータをインサートする
                await prisma.userWorkspace.create({
                    data: {
                        userId: newUser.userId,
                        workspaceId: newWorkspace.workspaceId,
                    },
                });

                // 4. user_authorities テーブルにデータをインサートする
                const authorityIds = [Authorities.APPLICATION, Authorities.APPROVAL, Authorities.ADMIN];
                for (const authorityId of authorityIds) {
                    await prisma.userAuthority.create({
                        data: {
                            userId: newUser.userId,
                            workspaceId: newWorkspace.workspaceId,
                            authorityId: authorityId,
                        },
                    });
                }

                // 5. workspace_approvers テーブルにデータをインサートする
                await prisma.workspaceApprovers.create({
                    data: {
                        userId: newUser.userId,
                        workspaceId: newWorkspace.workspaceId,
                        approvalStep: 1,
                    },
                });

                return newUser;
            });

            return transaction;
        } catch (error) {
            console.error('ユーザー作成処理でエラーが発生しました。', error);
            throw error;
        }
    }

    static async findByUserIdAndPassword(userId: number, password: string): Promise<User | null> {
        try {
            const user: User | null = await prisma.user.findUnique({
                where: {
                    userId: userId,
                    password: toHashed(password),
                    isDeleted: false,
                }
            });
            return user;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async udpatePassword(userId: number, password: string): Promise<User | null> {
        try {
            const user = await prisma.user.update({
                where: {
                    userId: userId,
                    isDeleted: false,
                },
                data: { password: toHashed(password) },
            });

            return user;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async udpateUserInfo(user: User): Promise<User | null> {
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    userId: user.userId,
                    isDeleted: false,
                },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                },
            });

            return updatedUser;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async deleteUser(userId: number) {
        try {
            await prisma.$transaction(async (prisma) => {
                // 1. users.is_deletedをtrueにする
                await prisma.user.update({
                    where: {
                        userId,
                        isDeleted: false,
                    },
                    data: { isDeleted: true },
                });

                // 2. user_workspacesのuser_idが一致するレコードを削除
                await prisma.userWorkspace.deleteMany({
                    where: { userId },
                });

                // 3. user_authoritiesのuser_idが一致するレコードを削除
                await prisma.userAuthority.deleteMany({
                    where: { userId },
                });
            });
        } catch (error) {
            console.error('Error occurred while deleting user and related records:', error);
            throw error;
        }
    }
}

