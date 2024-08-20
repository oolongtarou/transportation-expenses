import { z } from 'zod';

const nameSchema = z.string()
    .min(1, '入力してください')
    .max(50, '50字以内で入力してください');

export const emailSchema = z.string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '有効なメールアドレスを入力してください' })
    .max(255, { message: '255字以内で入力してください' });

export const passwordSchema = z.string()
    .min(10, 'パスワードは10文字以上にしてください')
    .max(50, 'パスワードは50文字以内にしてください')
    .regex(/[A-Z]/, 'パスワードには英大文字を含めてください')
    .regex(/[a-z]/, 'パスワードには英小文字を含めてください')
    .regex(/\d/, 'パスワードには半角数字を含めてください')
    .regex(/[!@#$%^&*()_+\-=[]|;:,.<>?]/, 'パスワードには指定の記号を含めてください');

export const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string()
        .min(1, { message: 'パスワードを入力してください' })
        .max(50, { message: '50桁以内で入力してください' })
});


export const signupSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    userName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'パスワードが一致していません',
});

export type SignupFormData = z.infer<typeof signupSchema>;


export const workspaceInviteSchema = z.object({
    email: emailSchema
});

export type WorkspaceInviteFormData = z.infer<typeof workspaceInviteSchema>;

export const passwordChangeSchema = z.object({
    currentPassword: z.string()
        .min(1, { message: 'パスワードを入力してください' })
        .max(50, { message: '50桁以内で入力してください' }),
    newPassword: passwordSchema,
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '新しいパスワードが一致していません',
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const accountInfoChangeSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    userName: nameSchema,
    email: emailSchema,
})

export type AccountInfoChangeFormData = z.infer<typeof accountInfoChangeSchema>