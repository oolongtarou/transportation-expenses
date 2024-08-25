import { SelectOption } from "@/components/SelectBox"

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


export const appFormDetailInitialData: AppFormDetail =
{
    id: 0,
    date: new Date().toISOString().split('T')[0],
    // date: new Date(),
    description: '',
    transportation: 1,
    transportationName: '電車',
    routes: [],
    oneWayAmount: 0,
    isRoundTrip: true,
    detailAmount: 0,
}

export const appFormInitialData: ApplicationForm = {
    applicationId: 0,
    workspaceId: 0,
    applicationDate: new Date().toISOString(), // 現在の日付と時刻をISO 8601形式の文字列に変換
    userId: 0,
    totalAmount: 0,
    title: '',
    statusId: 0,
    user: {
        userName: "",
    },
    status: {
        statusName: "",
    },
    details: [appFormDetailInitialData]
};



export const calculateTotalAmount = (rows: AppFormDetail[]): number => {
    const total = rows.reduce((sum, row) => {
        if (Number.isNaN(row.oneWayAmount)) return sum;

        const rowAmount = row.isRoundTrip ? Number(row.oneWayAmount) * 2 : Number(row.oneWayAmount);
        return sum + rowAmount;
    }, 0);

    return total;
};

export const ApplicationStatuses = {
    DRAFT: 0,
    APPROVING1: 11,
    APPROVING2: 12,
    APPROVING3: 13,
    APPROVING4: 14,
    APPROVING5: 15,
    RECEIVING: 30,
    RECEIVED: 31,
    REJECTED: 50,
} as const;

export const ApplicationStatusLabels: { [key in keyof typeof ApplicationStatuses]: string } = {
    DRAFT: "下書き",
    APPROVING1: "承認中1",
    APPROVING2: "承認中2",
    APPROVING3: "承認中3",
    APPROVING4: "承認中4",
    APPROVING5: "承認中5",
    RECEIVING: "受領待ち",
    RECEIVED: "受領済み",
    REJECTED: "却下"
};

export const isApproving = (currentStatusId: number): boolean => {
    switch (currentStatusId) {
        case ApplicationStatuses.APPROVING1:
            return true;
        case ApplicationStatuses.APPROVING2:
            return true;
        case ApplicationStatuses.APPROVING3:
            return true;
        case ApplicationStatuses.APPROVING4:
            return true;
        case ApplicationStatuses.APPROVING5:
            return true;
        default:
            return false;
    }
}

export const statusSelectOptions: SelectOption[] = Object.keys(ApplicationStatuses).map(key => ({
    label: ApplicationStatusLabels[key as keyof typeof ApplicationStatuses],
    value: String(ApplicationStatuses[key as keyof typeof ApplicationStatuses]),
}));
