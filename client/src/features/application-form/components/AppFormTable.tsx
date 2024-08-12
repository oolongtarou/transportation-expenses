import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppFormDetail, appFormDetailInitialData } from "../app-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import RouteInput from "./RouteInput"
import { useState } from "react"


interface AppFormTableProps {
    tableRows: AppFormDetail[]
}

const AppFormTable = (props: AppFormTableProps) => {
    const { tableRows } = props;
    const [rows, setRows] = useState<AppFormDetail[]>(tableRows);
    const [isAddingRow, setIsAddingRow] = useState(false);

    const addRow = () => {
        console.log('行を追加します。')

        if (isAddingRow) {
            return;
        }

        setIsAddingRow(true);

        const newRow: AppFormDetail = {
            ...appFormDetailInitialData,
            id: rows.length + 1,  // 新しいIDを設定
            date: new Date(),  // 必要に応じて初期化
            // 他のフィールドも必要に応じて設定
        };

        setRows((prevRows) => [...prevRows, newRow]);
        setIsAddingRow(false);
    };

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[1200px] table-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">日付</TableHead>
                        <TableHead>説明</TableHead>
                        <TableHead>移動手段</TableHead>
                        <TableHead>経路</TableHead>
                        <TableHead className="text-right">片道金額</TableHead>
                        <TableHead>往復</TableHead>
                        <TableHead className="text-right">金額</TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Input type="date" defaultValue={row.date.toISOString().substring(0, 10)} />
                            </TableCell>
                            <TableCell>
                                <Input type="text" defaultValue={row.description} maxLength={20} />
                            </TableCell>
                            <TableCell>
                                <Select defaultValue="1">
                                    <SelectTrigger className="min-w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectGroup >
                                            <SelectItem value="1">電車</SelectItem>
                                            <SelectItem value="2">バス</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="min-w-100">
                                <Dialog>
                                    <DialogTrigger className="w-full text-left">
                                        {row.routes.length === 0 ? (
                                            <Button className="btn btn-sub font-normal w-full">経路を入力する</Button>
                                        ) : (
                                            row.routes.map((route, index) => (
                                                <div key={index} >
                                                    {route.departureStation} - {route.arrivalStation} ({route.line})
                                                </div>
                                            ))
                                        )}
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <RouteInput />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>
                                <Input type="text" id="one_way_amount" placeholder="524" className="text-right" defaultValue={row.oneWayAmount} />
                            </TableCell>
                            <TableCell>
                                <Checkbox defaultChecked={row.isRoundTrip} />
                            </TableCell>
                            <TableCell className="text-right">{row.isRoundTrip ? row.oneWayAmount * 2 : row.oneWayAmount}</TableCell>
                            <TableCell>
                                <Button className="btn btn-link" onClick={() => deleteRow(row.id)}>削除</Button>
                            </TableCell>
                            <TableCell>
                                <Button className="btn btn-link" onClick={() => copyRow(row.id)}>コピー</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={9} className="text-center btn btn-link" onClick={addRow}>
                            <img src="./icons/add.svg" className="w-14 h-14 mx-auto" />
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className="font-bold text-lg">合計</TableCell>
                        <TableCell colSpan={1} className="text-right font-bold text-lg">¥53,000</TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default AppFormTable