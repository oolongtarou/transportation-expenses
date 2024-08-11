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
    transportation: string
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