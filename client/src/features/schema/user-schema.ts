import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'メールアドレスを入力してください' })
        .email({ message: '有効なメールアドレスを入力してください' })
        .max(250, { message: '250字以内で入力してください' }),
    password: z
        .string()
        .min(1, { message: 'パスワードを入力してください' })
        .max(50, { message: '50桁以内で入力してください' })
});

export const signupSchema = z.object({
    firstName: z.string().min(1, '入力してください').max(50, '50字以内で入力してください'),
    lastName: z.string().min(1, '入力してください').max(50, '50字以内で入力してください'),
    userName: z.string().min(1, '入力してください').max(50, '50字以内で入力してください'),
    email: z.string().email({ message: '有効なメールアドレスを入力してください' }).max(255, '255字以内で入力してください'),
    password: z.string()
        .min(10, 'パスワードは10文字以上にしてください')
        .max(50, 'パスワードは50文字以内にしてください')
        .regex(/[A-Z]/, 'パスワードには英大文字を含めてください')
        .regex(/[a-z]/, 'パスワードには英小文字を含めてください')
        .regex(/\d/, 'パスワードには半角数字を含めてください')
        .regex(/[!@#$%^&*()_+\-=[]|;:,.<>?]/, 'パスワードには指定の記号を含めてください'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'パスワードが一致していません',
});


// TypeScript type inferred from the schema
export type SignupFormData = z.infer<typeof signupSchema>;