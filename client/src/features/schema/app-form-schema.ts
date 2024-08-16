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
    // date: z.string()
    //     .regex(/^\d{4}-\d{2}-\d{2}$/, "日付を入力してください"),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "日付を入力してください")
        .refine((value) => {
            const dateValue = new Date(value);
            const currentDate = new Date();

            // 3か月前と3か月後の日付を計算
            const threeMonthsBefore = new Date();
            threeMonthsBefore.setMonth(currentDate.getMonth() - 3);
            const threeMonthsAfter = new Date();
            threeMonthsAfter.setMonth(currentDate.getMonth() + 3);

            return dateValue >= threeMonthsBefore && dateValue <= threeMonthsAfter;
        }, {
            message: "3か月以上離れた日付の申請はできません"
        }),
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
        .min(1, "片道金額は1円以上でなければなりません")
        .max(1000000, "片道金額は100万円以下でなければなりません")),
    routes: z.array(routeSchema).min(1, "経路は少なくとも1つ必要です"),
});

// ApplicationFormのスキーマ
export const applicationFormSchema = z.object({
    details: z.array(appFormDetailSchema).min(1, '明細は少なくとも1行必要です'),
});

