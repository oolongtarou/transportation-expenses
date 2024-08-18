import { z } from 'zod';

export const searchSchema = z.object({
    applicationIdMin: z
        .string()
        .nullable()
        .transform((val) => (val === null || val === '' ? null : parseInt(val, 10)))
        .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 10000000000), {
            message: '0から10,000,000,000の間で入力してください',
        }),
    applicationIdMax: z
        .string()
        .nullable()
        .transform((val) => (val === null || val === '' ? null : parseInt(val, 10)))
        .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 10000000000), {
            message: '0から10,000,000,000の間で入力してください',
        }),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    userName: z.string().optional(),
    title: z.string().optional(),
    numberOfItems: z.number().optional(),
    totalAmountMin: z
        .string()
        .nullable()
        .transform((val) => (val === null || val === '' ? null : parseInt(val, 10)))
        .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 1000000), {
            message: '0円から1,000,000円の間で入力してください',
        }),
    totalAmountMax: z
        .string()
        .nullable()
        .transform((val) => (val === null || val === '' ? null : parseInt(val, 10)))
        .refine((val) => val === null || (typeof val === 'number' && val >= 0 && val <= 1000000), {
            message: '0円から1,000,000円の間で入力してください',
        }),
    status: z.array(z.number()).optional(), // statusは配列として扱う
}).superRefine((data, ctx) => {
    if (data.totalAmountMin !== null && data.totalAmountMax !== null && data.totalAmountMin > data.totalAmountMax) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '最小金額は最大金額以下である必要があります',
            path: ['totalAmountMin'], // エラーが発生したフィールドを指定
        });
    }
    if (data.applicationIdMin !== null && data.applicationIdMax !== null && data.applicationIdMin > data.applicationIdMax) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '最小申請IDは最大申請ID以下である必要があります',
            path: ['applicationIdMin'], // エラーが発生したフィールドを指定
        });
    }
});

export type SearchFormInputs = z.infer<typeof searchSchema>;