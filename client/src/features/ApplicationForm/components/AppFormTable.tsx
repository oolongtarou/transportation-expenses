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
import { AppFormTableProps } from "./app-form-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AppFormTable = (props: AppFormTableProps) => {
    const { tableRows } = props;
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
                    {tableRows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Input type="date" value={row.date.toISOString().substring(0, 10)} />
                            </TableCell>
                            <TableCell>
                                <Input type="text" value={row.description} maxLength={20} />
                            </TableCell>
                            <TableCell>
                                <Select>
                                    <SelectTrigger className="min-w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">電車</SelectItem>
                                            <SelectItem value="2">バス</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="min-w-100">
                                {row.route.length === 0 ? (
                                    <Button className="btn btn-sub font-normal w-full">経路を入力する</Button>
                                ) : (
                                    row.route.map((r, index) => (
                                        <div key={index}>
                                            {r.departureStation} - {r.arrivalStation} ({r.line})
                                        </div>
                                    ))
                                )}
                            </TableCell>
                            <TableCell>
                                <Input type="text" id="one_way_amount" placeholder="524" className="text-right" value={row.oneWayAmount} />
                            </TableCell>
                            <TableCell>
                                <Checkbox checked={row.isRoundTrip} />
                            </TableCell>
                            <TableCell className="text-right">{row.isRoundTrip ? row.oneWayAmount * 2 : row.oneWayAmount}</TableCell>
                            <TableCell>
                                <Button className="btn btn-link">削除</Button>
                            </TableCell>
                            <TableCell>
                                <Button className="btn btn-link">コピー</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={9} className="btn btn-link">
                            <img src="./icons/add.svg" className="w-14 h-14 mx-auto" onClick={() => { }} />
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