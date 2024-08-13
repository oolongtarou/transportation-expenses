import { isWithinMonths } from '@/lib/date';
import { z } from 'zod';

const routeSchema = z.object({
    id: z.number().int(),
    departureId: z.string(),
    departureName: z.string(),
    arrivalId: z.string(),
    arrivalName: z.string(),
    lineId: z.string(),
    lineName: z.string(),
});

export const appFormDetailSchema = z.object({
    date: z
        // .date()
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
            message: "日付に変換できる形式ではありません",
        })
        .transform((value) => new Date(value))
        .refine(date => isWithinMonths(date, 3), {
            message: "3か月以内の日付を入力してください",
        }),
    description: z
        .string()
        .max(50, "50字以内で入力してください")
        .nullable(), // NULLを許容
    routes: z
        .array(routeSchema)
        .min(1, "少なくとも1つのルートを指定してください"),
    oneWayAmount: z
        .string()
        .refine((value) => {
            const numberValue = Number(value);
            return !isNaN(numberValue) && Number.isInteger(numberValue) && 1 <= numberValue && numberValue <= 1000000;
        }, {
            message: "1以上、100万以内の整数を入力してください",
        })
        .transform((value) => Number(value)),
});


// ApplicationFormのスキーマ
export const applicationFormSchema = z.object({
    // applicationId: z.number(),
    // applicationDate: z.date(),
    // userId: z.number(),
    // userName: z.string().max(50), // 50字以内など、必要に応じて設定
    // totalAmount: z.number().min(0), // 0以上の金額を想定
    // applicationStatus: z.number(),
    // applicationStatusName: z.string().max(50), // 必要に応じて設定
    details: z.array(appFormDetailSchema) // AppFormDetailの配列
});