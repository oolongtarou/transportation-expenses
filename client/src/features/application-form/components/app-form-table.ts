export interface AppFormTableProps {
    tableRows: AppFormDetail[]
}

export interface AppFormDetail {
    id: number
    date: Date
    description: string
    transportation: string
    route: Route[]
    oneWayAmount: number
    isRoundTrip: boolean
    detailAmount: number
}

interface Route {
    departureStation: string
    arrivalStation: string
    line: string
}