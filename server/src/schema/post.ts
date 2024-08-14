
export interface SearchOption {
    applicationIdMin?: number;
    applicationIdMax?: number;
    totalAmountMin?: number;
    totalAmountMax?: number;
    status?: number[];
    startDate?: string;
    endDate?: string;
    userName?: string;
}