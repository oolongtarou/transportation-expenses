import { Button } from "@/components/ui/button"
import AppFormTable from "./components/AppFormTable"
import { AppFormDetail } from "./app-form";

const appFormDetails: AppFormDetail[] = [
    {
        id: 1,
        date: new Date('2024-08-11'),
        description: 'Business trip to Osaka',
        transportation: 'Train',
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
        transportation: 'Train',
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
        transportation: 'Car',
        routes: [
            { departureStation: 'Tokyo', arrivalStation: 'Yokohama', line: 'Expressway' }
        ],
        oneWayAmount: 2000,
        isRoundTrip: true,
        detailAmount: 4000,
    },
    {
        id: 3,
        date: new Date('2024-08-09'),
        description: 'Client visit in Yokohama',
        transportation: 'Car',
        routes: [],
        oneWayAmount: 2000,
        isRoundTrip: true,
        detailAmount: 4000,
    }
];

const AppFormCreate = () => {
    return (
        <div className="container">
            <h2 className="font-bold text-xl mx-5 my-3">申請書を作成する</h2>
            <AppFormTable tableRows={appFormDetails} />
            <div className="flex justify-end gap-5 mt-5">
                <Button className="btn btn-outline-primary" >下書き保存する</Button>
                <Button className="btn btn-primary" >申請する</Button>
            </div>
        </div>
    )
}

export default AppFormCreate