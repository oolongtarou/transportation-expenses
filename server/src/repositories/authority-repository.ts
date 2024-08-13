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
}