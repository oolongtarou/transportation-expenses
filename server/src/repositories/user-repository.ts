import { User } from "@prisma/client";
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
}