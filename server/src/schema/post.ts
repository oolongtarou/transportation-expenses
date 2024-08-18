
export interface SearchOption {
    applicationIdMin?: number;
    applicationIdMax?: number;
    totalAmountMin?: number;
    totalAmountMax?: number;
    status?: number[];
    startDate?: string;
    endDate?: string;
    userName?: string;
    page: number;
    numberOfItems: number;
}


export interface ApplicationForm {
    applicationId: number;
    workspaceId: number;
    applicationDate: string;
    userId: number;
    totalAmount: number;
    title: string;
    statusId: number;
    user: User;
    status: Status;
    details: AppFormDetail[]
}

interface User {
    userName: string;
}

interface Status {
    statusName: string;
}

export interface AppFormDetail {
    id: number
    date: string
    description: string
    transportation: number
    transportationName: string
    routes: Route[]
    oneWayAmount: number
    isRoundTrip: boolean
    detailAmount: number
    isDialogOpen?: boolean;  // 各行ごとのDialog開閉状態 TODO:ここにこのデータを持たせるのはすごく嫌だ。別案を探す。
}

export interface Route {
    id: number
    departureId: string
    departureName: string
    arrivalId: string
    arrivalName: string
    lineId: string
    lineName: string
}