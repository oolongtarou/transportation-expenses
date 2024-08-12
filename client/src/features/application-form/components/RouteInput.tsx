
import { CreatableSelectBox, SelectOption } from "@/components/SelectBox"
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
import { Route } from "../app-form"
import { Input } from "@/components/ui/input"

interface RouteInputProps {
    inputRoutes: Route[]
}

const RouteInput = (props: RouteInputProps) => {
    const { inputRoutes } = props;

    const [routes, setRoutes] = useState<Route[]>(inputRoutes);

    const [departureSelectedOption, setDepartureSelectedOption] = useState<SelectOption>({ label: '', value: '' });
    const [arrivalSelectedOption, setArrivalSelectedOption] = useState<SelectOption>({ label: '', value: '' });
    const [lineSelectedOption, setLineSelectedOption] = useState<SelectOption>({ label: '', value: '' });

    const complete = () => {
        console.log(departureSelectedOption);
        console.log(arrivalSelectedOption);
        console.log(lineSelectedOption);
    }

    const addRow = () => {
        setRoutes((prevRoutes) => {
            if (departureSelectedOption.value && arrivalSelectedOption.value && lineSelectedOption.value) {
                const newRoute: Route = {
                    id: prevRoutes.length + 1,
                    departureId: departureSelectedOption.value,
                    departureName: departureSelectedOption.label,
                    arrivalId: arrivalSelectedOption.value,
                    arrivalName: arrivalSelectedOption.label,
                    lineId: lineSelectedOption.value,
                    lineName: lineSelectedOption.label,
                };

                return [...prevRoutes, newRoute];
            } else {
                // TODO:zodでバリデーションする。
                window.alert('選択されていないものがあります。');
                return prevRoutes;
            }
        });
    };

    const deleteRoute = (id: number) => {
        setRoutes((prevRoutes) => {
            // 行を削除
            const newRoutes = prevRoutes.filter(route => route.id !== id);

            // IDを再採番
            return newRoutes.map((route, index) => ({
                ...route,
                id: index + 1,  // 1から始まるIDを再割り当て
            }));
        });
    };

    return (
        <div className="">
            <h2 className="font-bold text-3xl mb-5">経路を入力する</h2>
            <section className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <Label>出発駅</Label>
                    <CreatableSelectBox options={stationOptions} onChange={(e) => setDepartureSelectedOption(e)} />
                </div>
                <div>
                    <Label>到着駅</Label>
                    <CreatableSelectBox options={stationOptions} onChange={setArrivalSelectedOption} />
                </div>
                <div>
                    <Label>路線</Label>
                    <CreatableSelectBox options={lineOptions} onChange={setLineSelectedOption} />
                </div>
            </section>
            <div className="flex justify-end">
                <Button onClick={addRow} className="btn btn-light w-56 mb-3">経路を追加する</Button>
            </div>
            <Table className=" table-auto mb-5">
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
                            <TableCell>
                                {route.departureName}
                                <Input type="hidden" value={route.departureId} />
                            </TableCell>
                            <TableCell>
                                {route.arrivalName}
                                <Input type="hidden" value={route.arrivalId} />
                            </TableCell>
                            <TableCell>
                                {route.lineName}
                                <Input type="hidden" value={route.lineId} />
                            </TableCell>
                            <TableCell className="max-w-10">
                                <Button className="btn btn-link" onClick={() => deleteRoute(route.id)}>削除</Button>
                            </TableCell>
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

const stationOptions: SelectOption[] = [
    {
        label: '池袋',
        value: '1'
    },
    {
        label: '東池袋',
        value: '2'
    },
    {
        label: '新宿',
        value: '3'
    },
]

const lineOptions: SelectOption[] = [
    {
        label: 'JR山手線',
        value: '1'
    },
    {
        label: '東京メトロ有楽町線',
        value: '2'
    },
    {
        label: 'JR埼京線',
        value: '3'
    },
]