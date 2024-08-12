import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'メールアドレスを入力してください。' })
        .email({ message: '有効なメールアドレスを入力してください' })
        .max(250, { message: '250字以内で入力してください' }),
    password: z
        .string()
        .min(1, { message: 'パスワードを入力してください。' })
        .max(50, { message: '50桁以内で入力してください' })
});