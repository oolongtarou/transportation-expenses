export interface ApplicationForm {
    applicationId: number
    applicationDate: Date
    userId: number
    userName: string
    totalAmount: number
    applicationStatus: number
    applicationStatusName: string
    details: AppFormDetail[]
}

export interface AppFormDetail {
    id: number
    date: Date
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
    id: 1,
    date: new Date(),
    description: '',
    transportation: 1,
    transportationName: '電車',
    routes: [],
    oneWayAmount: 0,
    isRoundTrip: true,
    detailAmount: 0,
}

export const appFormInitialData: ApplicationForm = {
    applicationId: 1,
    applicationDate: new Date(),
    applicationStatus: 0,
    applicationStatusName: "",
    totalAmount: 0,
    userId: 0,
    userName: "",
    details: [appFormDetailInitialData]
}

export interface AppFormTableProps {
    tableRows: AppFormDetail[]
    editing: boolean
}

export const calculateTotalAmount = (rows: AppFormDetail[]): number => {
    const total = rows.reduce((sum, row) => {
        if (Number.isNaN(row.oneWayAmount)) return sum;

        const rowAmount = row.isRoundTrip ? row.oneWayAmount * 2 : row.oneWayAmount;
        return sum + rowAmount;
    }, 0);

    return total;
};














export const dummyAppFormDetails: AppFormDetail[] = [
    {
        id: 1,
        date: new Date('2024-08-01'),
        description: "出張交通費",
        transportation: 1,
        transportationName: '電車',
        routes: [
            {
                id: 1,
                departureId: "1",
                departureName: "東京",
                arrivalId: "2",
                arrivalName: "横浜",
                lineId: "1",
                lineName: "東海道本線"
            }
        ],
        oneWayAmount: 550,
        isRoundTrip: true,
        detailAmount: 1100,
    },
    {
        id: 2,
        date: new Date('2024-08-02'),
        description: "顧客訪問",
        transportation: 2,
        transportationName: 'バス',
        routes: [
            {
                id: 2,
                departureId: "3",
                departureName: "新宿",
                arrivalId: "4",
                arrivalName: "品川",
                lineId: "2",
                lineName: "山手線"
            },
            {
                id: 3,
                departureId: "4",
                departureName: "品川",
                arrivalId: "5",
                arrivalName: "渋谷",
                lineId: "2",
                lineName: "山手線"
            }
        ],
        oneWayAmount: 300,
        isRoundTrip: false,
        detailAmount: 300,
    },
    {
        id: 3,
        date: new Date('2024-08-03'),
        description: "会議参加",
        transportation: 1,
        transportationName: '電車',
        routes: [
            {
                id: 4,
                departureId: "6",
                departureName: "大阪",
                arrivalId: "7",
                arrivalName: "京都",
                lineId: "3",
                lineName: "京都線"
            }
        ],
        oneWayAmount: 1200,
        isRoundTrip: true,
        detailAmount: 2400,
    },
    {
        id: 4,
        date: new Date('2024-08-04'),
        description: "",
        transportation: 1,
        transportationName: '電車',
        routes: [
            {
                id: 5,
                departureId: "8",
                departureName: "名古屋",
                arrivalId: "9",
                arrivalName: "岐阜",
                lineId: "4",
                lineName: "名鉄線"
            }
        ],
        oneWayAmount: 800,
        isRoundTrip: false,
        detailAmount: 800,
    },
    {
        id: 5,
        date: new Date('2024-08-05'),
        description: "営業活動",
        transportation: 1,
        transportationName: '電車',
        routes: [
            {
                id: 6,
                departureId: "10",
                departureName: "博多",
                arrivalId: "11",
                arrivalName: "小倉",
                lineId: "5",
                lineName: "鹿児島本線"
            },
            {
                id: 7,
                departureId: "11",
                departureName: "小倉",
                arrivalId: "12",
                arrivalName: "門司",
                lineId: "5",
                lineName: "鹿児島本線"
            }
        ],
        oneWayAmount: 1500,
        isRoundTrip: true,
        detailAmount: 3000,
    },
];

export const appFormDummyData: ApplicationForm = {
    applicationId: 1,
    applicationDate: new Date(),
    applicationStatus: 0,
    applicationStatusName: "",
    totalAmount: 0,
    userId: 0,
    userName: "",
    details: dummyAppFormDetails,
}