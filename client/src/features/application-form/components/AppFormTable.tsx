import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import RouteInput from "./RouteInput"
import { formatWithCommas } from "@/lib/math"
import { AppFormDetail, appFormDetailInitialData, ApplicationForm, calculateTotalAmount, Route } from "../app-form"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useFieldArray, useFormContext, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"
import MustBadge from "@/components/MustBadge"

export interface AppFormTableProps {
    tableRows: AppFormDetail[]
    editing: boolean
    watch: UseFormWatch<ApplicationForm>
    setValue: UseFormSetValue<ApplicationForm>
    isLoading: boolean
}

const AppFormTable = (props: AppFormTableProps) => {
    const { tableRows, editing, setValue, isLoading } = props;
    const [rows, setRows] = useState<AppFormDetail[]>(tableRows);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const { control, register, formState: { errors }, reset } = useFormContext<ApplicationForm>();
    const { append, remove } = useFieldArray({
        control,
        name: "details"
    });

    const DetailAmountCell = ({ index }: { index: number }) => {
        const { setValue } = useFormContext<ApplicationForm>();

        // フォーム内のoneWayAmountとisRoundTripを監視
        const oneWayAmount = rows[index].oneWayAmount;
        const isRoundTrip = rows[index].isRoundTrip;

        useEffect(() => {
            // detailAmountを自動計算
            const calculatedAmount = isRoundTrip ? oneWayAmount * 2 : oneWayAmount;

            // 計算結果をフォームの値として保持
            setValue(`details.${index}.detailAmount`, calculatedAmount);
        }, [oneWayAmount, isRoundTrip, setValue, index]);

        return (
            <TableCell className="text-right max-w-32">
                {isLoading
                    ? <Skeleton className="h-10 w-full" />
                    : formatWithCommas(isRoundTrip ? oneWayAmount * 2 : oneWayAmount)
                }
            </TableCell>
        );
    };


    const handleDialogOpenChange = (id: number, isOpen: boolean) => {
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === id ? { ...row, isDialogOpen: isOpen } : row
            )
        );
    };

    useEffect(() => {
        setRows(tableRows);
    }, [tableRows]);

    useEffect(() => {
        reset({ details: rows });
    }, [reset, rows]);


    useEffect(() => {
        setTotalAmount(calculateTotalAmount(rows));
    }, [rows])

    const handleInputChange = (index: number, field: keyof AppFormDetail, value: string | number | boolean | Route[]) => {
        const updatedRows = [...rows];
        updatedRows[index] = {
            ...updatedRows[index],
            [field]: value,
        };
        setRows(updatedRows);
        setValue(`details.${index}.${field}`, value);
    };


    const handleRoutesUpdate = (rowId: number, updatedRoutes: Route[]) => {
        // 行のroutesを更新
        const updatedRows = rows.map(row =>
            row.id === rowId ? { ...row, routes: updatedRoutes } : row
        );
        setRows(updatedRows);

        // react-hook-formの状態を更新
        const index = rows.findIndex(row => row.id === rowId);
        setValue(`details.${index}.routes`, updatedRoutes);
    };

    const addRow = () => {

        if (isAddingRow) {
            return;
        }

        setIsAddingRow(true);

        // 現在のrowsの中で最も大きいIDを取得
        const maxId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) : 0;

        // 新しいIDを設定
        const newRow: AppFormDetail = {
            ...appFormDetailInitialData,
            id: maxId + 1,  // 最も大きいIDに+1した新しいIDを設定
            date: new Date().toISOString().split('T')[0],  // 必要に応じて初期化
            // 他のフィールドも必要に応じて設定
        };

        append(newRow);
        setRows((prevRows) => [...prevRows, newRow]);
        setIsAddingRow(false);
    };
    const deleteRow = (id: number) => {
        const indexToRemove = rows.findIndex(row => row.id === id);

        // インデックスを使用して行を削除
        remove(indexToRemove);

        // 状態を更新して行を削除
        setRows((prevRows) => {
            const newRows = prevRows.filter(row => row.id !== id);

            // IDを再採番
            return newRows.map((row, index) => ({
                ...row,
                id: index,  // 1から始まるIDを再割り当て
            }));
        });
    };

    const copyRow = (index: number) => {
        // rowsステートからコピー元の行を取得
        const rowToCopy = rows[index];

        if (!rowToCopy) return;

        // 現在のrowsの中で最も大きいIDを取得
        const maxId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) : 0;

        const newRow = {
            ...rowToCopy,
            id: maxId + 1,  // 最も大きいIDに+1した新しいIDを設定
        };

        // フィールドに新しい行を追加
        append(newRow);
        // rowsステートを更新
        setRows((prevRows) => [...prevRows, newRow]);
    };

    return (
        <div className="overflow-x-auto">
            {errors.details ? <p className="text-red-500">{errors.details.message}</p> : <></>}
            <Table className="min-w-[1200px] table-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">日付{editing ? <MustBadge /> : null}</TableHead>
                        <TableHead>説明</TableHead>
                        <TableHead>移動手段</TableHead>
                        <TableHead>経路{editing ? <MustBadge /> : null}</TableHead>
                        <TableHead className="text-right w-40">片道金額{editing ? <MustBadge /> : null}</TableHead>
                        <TableHead className="text-center">往復</TableHead>
                        <TableHead className="text-right max-w-32">金額</TableHead>
                        {editing ?
                            <>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                            </>
                            : <></>
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    : <Input
                                        type="date"
                                        disabled={!editing}
                                        defaultValue={row.date}
                                        {...register(`details.${index}.date`, {
                                            onChange: (e) => handleInputChange(index, 'date', e.target.value)
                                        })}
                                    />
                                }
                                {errors.details && errors.details[index]?.date?.message ? <p className="text-red-500">{errors.details[index]?.date?.message}</p> : <></>}
                            </TableCell>
                            <TableCell>
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    : <Input
                                        type="text"
                                        disabled={!editing}
                                        defaultValue={row.description}
                                        maxLength={20}
                                        {...register(`details.${index}.description`, {
                                            onChange: (e) => handleInputChange(index, 'description', e.target.value)
                                        })}
                                    />
                                }
                                {errors.details && errors.details[index]?.description?.message ? <p className="text-red-500">{errors.details[index]?.description?.message}</p> : <></>}
                            </TableCell>
                            <TableCell>
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    : <Select
                                        defaultValue={row.transportation.toString()}
                                        disabled={!editing}
                                        onValueChange={(value) => {
                                            setValue(`details.${index}.transportation`, parseInt(value))
                                            handleInputChange(index, 'transportation', parseInt(value))
                                        }}
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
                                }

                                {errors.details && errors.details[index]?.transportation?.message ? <p className="text-red-500">{errors.details[index]?.transportation?.message}</p> : <></>}
                            </TableCell>
                            <TableCell className="min-w-100">
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    :
                                    editing ?
                                        <Dialog
                                            open={row.isDialogOpen || false}
                                            onOpenChange={(isOpen) => handleDialogOpenChange(row.id, isOpen)}
                                        >
                                            <DialogTrigger className="w-full text-left" onClick={() => setEditingRowId(row.id)}>
                                                {row.routes.length === 0 ? (
                                                    <div className="btn btn-sub font-normal w-full">経路を入力する</div>
                                                ) : (
                                                    row.routes.map((route, index) => (
                                                        <div key={index}>
                                                            {route.departureName} - {route.arrivalName} ({route.lineName})
                                                        </div>
                                                    ))
                                                )}
                                            </DialogTrigger>
                                            {errors.details && errors.details[index]?.routes?.message ? <p className="text-red-500">{errors.details[index]?.routes?.message}</p> : <></>}
                                            <DialogContent className="max-w-4xl" aria-describedby="申請書明細行の経路を入力する画面です">
                                                <DialogHeader>
                                                    <DialogTitle className="font-bold text-3xl mb-5">
                                                        経路を入力する
                                                    </DialogTitle>
                                                    <DialogDescription hidden>
                                                        申請書明細の経路を入力するための画面です。
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {editingRowId === row.id && (
                                                    <RouteInput inputRoutes={row.routes} onComplete={(updatedRoutes) => {
                                                        handleRoutesUpdate(row.id, updatedRoutes)
                                                        handleInputChange(index, 'routes', updatedRoutes)
                                                        handleDialogOpenChange(row.id, false);
                                                    }
                                                    } />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        : row.routes.map((route, index) => (
                                            <div key={index} >
                                                {route.departureName} - {route.arrivalName} ({route.lineName})
                                            </div>
                                        ))
                                }
                            </TableCell>
                            <TableCell className="w-40">
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    : <Input
                                        type="number"
                                        disabled={!editing}
                                        defaultValue={row.oneWayAmount}
                                        className="text-right no-spin"
                                        {...register(`details.${index}.oneWayAmount`, {
                                            onChange: (e) => handleInputChange(index, 'oneWayAmount', e.target.value)
                                        })}
                                    />
                                }

                                {errors.details && errors.details[index]?.oneWayAmount?.message ? <p className="text-red-500">{errors.details[index]?.oneWayAmount?.message}</p> : <></>}
                            </TableCell>
                            <TableCell className="text-center">
                                {isLoading
                                    ? <Skeleton className="h-10 w-full" />
                                    : <Checkbox
                                        onCheckedChange={(checked) => handleInputChange(index, 'isRoundTrip', checked)}
                                        defaultChecked={row.isRoundTrip}
                                        disabled={!editing}
                                    />
                                }

                            </TableCell>
                            <DetailAmountCell index={index} />
                            {editing ?
                                <>
                                    <TableCell>
                                        <div className="btn btn-link" onClick={() => deleteRow(index)}>削除</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="btn btn-link" onClick={() => copyRow(index)}>コピー</div>
                                    </TableCell>
                                </>
                                : <></>
                            }
                        </TableRow>
                    ))}
                    {editing ?
                        <TableRow>
                            <TableCell colSpan={9} className="text-center btn btn-link" onClick={addRow}>
                                <img src="/icons/add.svg" className="w-14 h-14 mx-auto" />
                            </TableCell>
                        </TableRow>
                        : <></>
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className="font-bold text-lg">合計金額</TableCell>
                        <TableCell colSpan={1} className="text-right font-bold text-lg">
                            {isLoading
                                ? <Skeleton className="h-10 w-full" />
                                : `¥${totalAmount.toLocaleString()}`
                            }
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div >
    )
}

export default AppFormTable