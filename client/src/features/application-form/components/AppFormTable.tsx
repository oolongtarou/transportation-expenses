import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import RouteInput from "./RouteInput"
import { formatWithCommas } from "@/lib/math"
import { AppFormDetail, appFormDetailInitialData } from "../app-form"

interface AppFormTableProps {
    tableRows: AppFormDetail[]
}

const AppFormTable = (props: AppFormTableProps) => {
    const { tableRows } = props;
    const [rows, setRows] = useState<AppFormDetail[]>(tableRows);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const calculateTotalAmount = (rows: AppFormDetail[]) => {
        const total = rows.reduce((sum, row) => {
            if (Number.isNaN(row.oneWayAmount))
                return sum;

            const rowAmount = row.isRoundTrip ? row.oneWayAmount * 2 : row.oneWayAmount;
            return sum + rowAmount;
        }, 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount(rows);
    }, [rows]);

    const handleInputChange = (id: number, field: keyof AppFormDetail, value: unknown) => {
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

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

    const deleteRow = (id: number) => {
        setRows((prevRows) => {
            // 行を削除
            const newRows = prevRows.filter(row => row.id !== id);

            // IDを再採番
            return newRows.map((row, index) => ({
                ...row,
                id: index + 1,  // 1から始まるIDを再割り当て
            }));
        });
    };

    const copyRow = (id: number) => {
        setRows((prevRows) => {
            const rowToCopy = prevRows.find(row => row.id === id);
            if (rowToCopy) {
                const newRow: AppFormDetail = {
                    ...rowToCopy,
                    id: prevRows.length + 1,  // 新しいIDを設定
                    date: new Date(rowToCopy.date.getTime()),  // Dateオブジェクトを新しくコピー
                    routes: [...rowToCopy.routes],  // routesの配列をコピー
                    // 必要に応じて他のネストされたオブジェクトや配列もコピー
                };
                return [...prevRows, newRow];
            }
            return prevRows;
        });
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
                        <TableHead className="text-right w-40">片道金額</TableHead>
                        <TableHead className="text-center">往復</TableHead>
                        <TableHead className="text-right max-w-32">金額</TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Input
                                    type="date"
                                    defaultValue={row.date.toISOString().substring(0, 10)}
                                    onChange={(e) => handleInputChange(row.id, 'date', new Date(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="text"
                                    value={row.description}
                                    maxLength={20}
                                    onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={row.transportation.toString()}
                                    onValueChange={(value) => handleInputChange(row.id, 'transportation', parseInt(value))}
                                >
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
                                                    {route.departureName} - {route.arrivalName} ({route.lineName})
                                                </div>
                                            ))
                                        )}
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <RouteInput inputRoutes={row.routes} />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell className="w-40">
                                <Input
                                    type="text"
                                    defaultValue={row.oneWayAmount.toString()}
                                    className="text-right"
                                    onChange={(e) => handleInputChange(row.id, 'oneWayAmount', parseFloat(e.target.value))}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Checkbox
                                    defaultChecked={row.isRoundTrip}
                                    onCheckedChange={(checked) => handleInputChange(row.id, 'isRoundTrip', checked)}
                                />
                            </TableCell>
                            <TableCell className="text-right max-w-32">
                                {row.isRoundTrip ? formatWithCommas(row.oneWayAmount * 2) : formatWithCommas(row.oneWayAmount)}
                            </TableCell>
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
                        <TableCell colSpan={6} className="font-bold text-lg">合計金額</TableCell>
                        <TableCell colSpan={1} className="text-right font-bold text-lg">¥{totalAmount.toLocaleString()}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default AppFormTable