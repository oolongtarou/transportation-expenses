import { z } from "zod";

export const routeSchema = z.object({
    id: z.number().int(),
    departureId: z.string(),
    departureName: z.string(),
    arrivalId: z.string(),
    arrivalName: z.string(),
    lineId: z.string(),
    lineName: z.string(),
});

// 必要な項目のみを含むAppFormDetailのスキーマ
export const appFormDetailSchema = z.object({
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "日付を入力してください"),
    description: z.string().max(50, "説明は50文字以内で入力してください"),
    transportation: z.number()
        .min(1, "移動手段を選択してください")
        .nonnegative("移動手段を正しく入力してください"),
    oneWayAmount: z.preprocess((value) => {
        if (typeof value === "string") {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? value : parsed;
        }
        return value;
    }, z.number({
        invalid_type_error: "数字を入力してください"
    })
        .min(1, "片道金額は1以上でなければなりません")
        .max(1000000, "片道金額は100万以下でなければなりません")),
    routes: z.array(routeSchema).min(1, "経路は少なくとも1つ必要です"),
});

// ApplicationFormのスキーマ
export const applicationFormSchema = z.object({
    details: z.array(appFormDetailSchema).min(1, '明細は少なくとも1行必要です'),
});

