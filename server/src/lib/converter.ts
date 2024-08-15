import { ParsedQs } from 'qs'; // QueryString.ParsedQs のために import

export const toNumber = (value: string | unknown): number | undefined => {
    if (typeof value === 'string') {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }
    return undefined;
};