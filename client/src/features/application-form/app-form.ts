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
}

export interface Route {
    departureStation: string
    arrivalStation: string
    line: string
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


export const appFormDetailsDemo: AppFormDetail[] = [
    {
        id: 1,
        date: new Date('2024-08-11'),
        description: 'Business trip to Osaka',
        transportation: 1,
        routes: [
            { departureStation: 'Tokyo', arrivalStation: 'Osaka', line: 'Shinkansen' },
            { departureStation: 'Osaka', arrivalStation: 'Kyoto', line: 'JR Kyoto Line' }
        ],
        oneWayAmount: 15000,
        isRoundTrip: true,
        detailAmount: 30000,
    },
    {
        id: 2,
        date: new Date('2024-08-10'),
        description: 'Meeting in Nagoya',
        transportation: 1,
        routes: [
            { departureStation: 'Tokyo', arrivalStation: 'Nagoya', line: 'Shinkansen' }
        ],
        oneWayAmount: 11000,
        isRoundTrip: false,
        detailAmount: 11000,
    },
    {
        id: 3,
        date: new Date('2024-08-09'),
        description: 'Client visit in Yokohama',
        transportation: 1,
        routes: [
            { departureStation: 'Tokyo', arrivalStation: 'Yokohama', line: 'Expressway' }
        ],
        oneWayAmount: 2000,
        isRoundTrip: true,
        detailAmount: 4000,
    },
    {
        id: 4,
        date: new Date('2024-08-09'),
        description: 'Client visit in Yokohama',
        transportation: 1,
        routes: [],
        oneWayAmount: 2000,
        isRoundTrip: true,
        detailAmount: 4000,
    }
];