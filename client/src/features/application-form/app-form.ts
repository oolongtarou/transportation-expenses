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


// export const appFormDetailsDemo: AppFormDetail[] = [
//     {
//         id: 1,
//         date: new Date('2024-08-11'),
//         description: 'Business trip to Osaka',
//         transportation: 1,
//         routes: [
//             { id: 1, departure: 'Tokyo', arrival: 'Osaka', line: 'Shinkansen' },
//             { id: 2, departure: 'Osaka', arrival: 'Kyoto', line: 'JR Kyoto Line' }
//         ],
//         oneWayAmount: 15000,
//         isRoundTrip: true,
//         detailAmount: 30000,
//     },
//     {
//         id: 2,
//         date: new Date('2024-08-10'),
//         description: 'Meeting in Nagoya',
//         transportation: 1,
//         routes: [
//             { id: 1, departure: 'Tokyo', arrival: 'Nagoya', line: 'Shinkansen' }
//         ],
//         oneWayAmount: 11000,
//         isRoundTrip: false,
//         detailAmount: 11000,
//     },
//     {
//         id: 3,
//         date: new Date('2024-08-09'),
//         description: 'Client visit in Yokohama',
//         transportation: 1,
//         routes: [
//             { id: 1, departure: 'Tokyo', arrival: 'Yokohama', line: 'Expressway' }
//         ],
//         oneWayAmount: 2000,
//         isRoundTrip: true,
//         detailAmount: 4000,
//     },
//     {
//         id: 4,
//         date: new Date('2024-08-09'),
//         description: 'Client visit in Yokohama',
//         transportation: 1,
//         routes: [],
//         oneWayAmount: 2000,
//         isRoundTrip: true,
//         detailAmount: 4000,
//     }
// ];