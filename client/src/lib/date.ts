export function formatJapaneseDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}年${month}月${day}日`;
}


// 3か月以内のチェック関数
export const isWithinMonths = (date: Date, n: number): boolean => {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - n);

    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(now.getMonth() + n);

    return date >= threeMonthsAgo && date <= threeMonthsFromNow;
};