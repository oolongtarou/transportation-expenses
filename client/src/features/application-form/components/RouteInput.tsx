
import Combobox from "@/components/Combobox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"

interface Route {
    id: number
    departure: string
    arrival: string
    line: string
}

const RouteInput = () => {
    const [departureSelectedOption, setDepartureSelectedOption] = useState("");
    const [arrivalSelectedOption, setArrivalSelectedOption] = useState("");
    const [lineSelectedOption, setLineSelectedOption] = useState("");

    const complete = () => {
        console.log(departureSelectedOption);
        console.log(arrivalSelectedOption);
        console.log(lineSelectedOption);
    }

    return (
        <div className="">
            <h2 className="font-bold text-3xl mb-5">経路を入力する</h2>
            <section className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <Label>出発駅</Label>
                    <Combobox onChange={setDepartureSelectedOption} />
                </div>
                <div>
                    <Label>到着駅</Label>
                    <Combobox onChange={setArrivalSelectedOption} />
                </div>
                <div>
                    <Label>路線</Label>
                    <Combobox onChange={setLineSelectedOption} />
                </div>
            </section>
            <div className="flex justify-end">
                <Button className="btn btn-light w-56 mb-3">経路を追加する</Button>
            </div>
            <Table className=" table-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>出発駅</TableHead>
                        <TableHead>到着駅</TableHead>
                        <TableHead>路線</TableHead>
                        <TableHead className="max-w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {routes.map(route => (
                        <TableRow key={route.id}>
                            <TableCell>{route.id}</TableCell>
                            <TableCell>{route.departure}</TableCell>
                            <TableCell>{route.arrival}</TableCell>
                            <TableCell>{route.line}</TableCell>
                            <TableCell className="max-w-10"><Button>削除</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end gap-5">
                <Button className="btn btn-outline-primary">料金を調べる</Button>
                <Button onClick={() => complete()} className="btn btn-primary">入力を完了する</Button>
            </div>
        </div>
    )
}

export default RouteInput



const routes: Route[] = [
    {
        id: 1,
        departure: "東京",
        arrival: "品川",
        line: "山手線"
    },
    {
        id: 2,
        departure: "新宿",
        arrival: "渋谷",
        line: "埼京線"
    },
    {
        id: 3,
        departure: "池袋",
        arrival: "上野",
        line: "山手線"
    }
];
