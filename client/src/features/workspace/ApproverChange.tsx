import { Approver } from "@/lib/approver";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import MessageBox from "@/components/MessageBox";

interface ApproverChangeProps {
    step: number;
    beforeApprovers: Approver[] | undefined;
    allApprovers: Approver[];
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setApprovers: React.Dispatch<React.SetStateAction<Approver[] | undefined>>
    className?: string;
}

const ApproverChange = (props: ApproverChangeProps) => {
    const { step, beforeApprovers, allApprovers, setDialogOpen, setApprovers, className } = props;
    const [selectedApprover, setSelectedApprover] = useState<Approver | undefined>(undefined);
    const [selectedApprovers, setSelectedApprovers] = useState<Approver[] | undefined>(beforeApprovers?.filter(approver => approver.approvalStep == step));
    const unselectedApprovers: Approver[] = allApprovers.filter(eachApprover => !selectedApprovers?.some(selectedApprover => selectedApprover.userId === eachApprover.userId));
    const [messageCode, setMessageCode] = useState<string>('');

    const onAddClicked = () => {
        if (selectedApprover) {
            setSelectedApprovers(prevApprovers =>
                prevApprovers ? [...prevApprovers, selectedApprover] : [selectedApprover]
            )
            setSelectedApprover(undefined);
            setMessageCode('')
        } else {
            setMessageCode('W00001')
        }
    }

    const onSelectedChanged = (selectedValue: string) => {
        const targetApprover = allApprovers?.find(approver => approver.userId === Number(selectedValue))
        if (targetApprover) {
            // 新しいオブジェクトを作成
            const newApprover = { ...targetApprover, approvalStep: step };
            setSelectedApprover(newApprover);
        }
    };

    const onDeleteClicked = (approver: Approver) => {
        setSelectedApprovers(prevApprovers =>
            prevApprovers?.filter(selected => selected.userId !== approver.userId)
        );
    };

    const onChangeClicked = () => {
        if (beforeApprovers && beforeApprovers?.length > 0) {
            const filteredApprovers = beforeApprovers.filter(approver => approver.approvalStep !== step);
            setApprovers(filteredApprovers.concat(selectedApprovers ?? []));
        } else {
            setApprovers(selectedApprovers);
        }
        setDialogOpen(false)
    }



    return (
        <div className={className}>
            <MessageBox messageCode={messageCode} />
            <div className="flex gap-3 items-center mb-5">
                <Select
                    onValueChange={(data) => onSelectedChanged(data)}
                >
                    <SelectTrigger id="applicationStatus" className="min-w-[80px] mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {unselectedApprovers.map(approver => (
                                <SelectItem key={approver.userId} value={approver.userId.toString()}>{approver.userName}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button onClick={onAddClicked} className="btn btn-light">追加する</Button>
            </div>
            <Table className="bg-white mb-5">
                <TableBody>
                    {selectedApprovers?.map((approver, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <span className="font-bold text-lg">{approver.userName}</span>
                            </TableCell>
                            <TableCell className="text-right">
                                <span onClick={() => onDeleteClicked(approver)} className="btn btn-link">削除</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <section className="flex justify-evenly mb-5">
                <Button onClick={() => setDialogOpen(false)} className="btn btn-light">キャンセル</Button>
                <Button onClick={onChangeClicked} className="btn btn-primary">変更する</Button>
            </section>
        </div>
    )
}

export default ApproverChange