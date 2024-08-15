import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

export interface Approver {
    step: number
    userName: string
}

interface ApproverRouteProps {
    maxStep: number
    approvers: Approver[]
}

const ApprovalRoute = (props: ApproverRouteProps) => {
    const groupedByStep = groupUserNamesByStep(props);
    const sortedResult = sortGroupedUserNamesByStep(groupedByStep);
    return (
        <div className="container">
            <header className="mb-10">
                <h2 className="heading-2">承認ルート</h2>
                <div className="max-w-52">
                    <Label>必要な承認回数</Label>
                    <Select >
                        <SelectTrigger id="applicationStatus" className="min-w-[80px] mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">1段階</SelectItem>
                                <SelectItem value="2">2段階</SelectItem>
                                <SelectItem value="3">3段階</SelectItem>
                                <SelectItem value="4">4段階</SelectItem>
                                <SelectItem value="5">5段階</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            <main>
                <h3 className="font-bold text-lg mb-2">承認者</h3>
                <Table className="table-mini bg-white">
                    <TableBody>
                        {Object.entries(sortedResult).map(([step, userNames]) => (
                            < TableRow key={step} >
                                <TableCell className="w-20">
                                    <img src="/icons/person.svg" style={{ backgroundColor: '#F0F2F5', borderRadius: '0.75rem' }} />
                                </TableCell>
                                <TableCell>
                                    <p className="font-bold text-black">{step}段階目</p>
                                    <p>{userNames.join(', ')}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    {userNames.length === 0
                                        ? <Button className="btn btn-action">承認者を設定する</Button>
                                        : <Button className="btn btn-light">承認者を変更する</Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-3 flex justify-end mr-4">
                    <Button className="btn btn-primary">設定を保存する</Button>
                </div>
            </main>
        </div >
    )
}

export default ApprovalRoute


function groupUserNamesByStep(props: ApproverRouteProps): Record<number, string[]> {
    const grouped: Record<number, string[]> = {};

    // 1からmaxStepまでの初期化
    for (let i = 1; i <= 5; i++) {
        grouped[i] = [];
    }

    props.approvers.forEach(approver => {
        if (grouped[approver.step]) {
            grouped[approver.step].push(approver.userName);
        }
    });

    return grouped;
}

function sortGroupedUserNamesByStep(grouped: Record<number, string[]>): Record<number, string[]> {
    const sortedKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);

    const sortedGrouped: Record<number, string[]> = {};
    sortedKeys.forEach(key => {
        sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
}