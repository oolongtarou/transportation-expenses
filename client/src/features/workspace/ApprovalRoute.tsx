import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { WorkspaceApprovers } from "@/lib/approver"
import { useAuth } from "@/lib/auth"
import { getWorkspaceIdFrom } from "@/lib/user-workspace"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const ApprovalRoute = () => {
    const { currentWorkspace } = useAuth();
    const location = useLocation();

    const [approvalStep, setApprovalStep] = useState<number | null>(null);
    const [workspaceApprovers, setWorkspaceApprovers] = useState<WorkspaceApprovers | null>(null);

    useEffect(() => {
        axios.get<WorkspaceApprovers>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/approvers`, { params: { workspaceId: getWorkspaceIdFrom(location.pathname) ?? 0 }, withCredentials: true })
            .then(response => {
                setWorkspaceApprovers(response.data);
                setApprovalStep(response.data.approvalStep)
            })
            .catch((err: AxiosError) => {
                console.error(err.code);
            })
    }, [currentWorkspace, location.pathname]);

    const renderRows = () => {
        const rows = [];
        for (let step = 1; step <= 5; step++) {
            const userNames = workspaceApprovers?.approvers
                .filter(approver => approver.approvalStep === step)
                .map(approver => approver.userName) || [];

            rows.push(
                <TableRow key={step} className={`${step > (approvalStep ?? 0) ? 'bg-gray-200' : ''}`}>
                    <TableCell className="w-20">
                        <img src="/icons/person.svg" style={{ backgroundColor: '#F0F2F5', borderRadius: '0.75rem' }} />
                    </TableCell>
                    <TableCell className="min-w-48">
                        <p className="font-bold text-black">{step}段階目</p>
                        <p>{userNames.join(', ')}</p>
                    </TableCell>
                    <TableCell className="text-right">
                        {step > (approvalStep ?? 0)
                            ? <></>
                            : userNames.length === 0
                                ? <Button className="btn btn-action">承認者を設定する</Button>
                                : <Button className="btn btn-light">承認者を変更する</Button>
                        }
                    </TableCell>
                </TableRow>
            );
        }
        return rows;
    }

    return (
        <div className="container">
            <header className="mb-10">
                <h2 className="heading-2">承認ルート</h2>
                <div className="max-w-52">
                    <Label>必要な承認回数</Label>
                    {approvalStep !== null && (
                        <Select defaultValue={approvalStep.toString()}>
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
                    )}
                </div>
            </header>
            <main>
                <h3 className="font-bold text-lg mb-2">承認者</h3>
                <Table className="bg-white">
                    <TableBody>
                        {renderRows()}
                    </TableBody>
                </Table>
                <div className="mt-3 flex justify-end mr-4">
                    <Button className="btn btn-primary">設定を保存する</Button>
                </div>
            </main>
        </div >
    )
}

export default ApprovalRoute;
