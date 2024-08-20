import MessageBox from "@/components/MessageBox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { WorkspaceApprovers } from "@/lib/approver"
import { Authorities, Authority, useAuth } from "@/lib/auth"
import { hasWorkspaceAuthority, User } from "@/lib/user"
import { getWorkspaceIdFrom } from "@/lib/user-workspace"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const ApprovalRoute = () => {
    const { currentWorkspace } = useAuth();
    const location = useLocation();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [authorities, setAuthorities] = useState<Authority[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [approvalStep, setApprovalStep] = useState<number | null>(null);
    const [workspaceApprovers, setWorkspaceApprovers] = useState<WorkspaceApprovers | null>(null);
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);

    useEffect(() => {
        setLoading(true);
        axios.get<WorkspaceApprovers>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/approvers`, { params: { workspaceId: getWorkspaceIdFrom(location.pathname) ?? 0 }, withCredentials: true })
            .then(response => {
                setWorkspaceApprovers(response.data);
                setApprovalStep(response.data.approvalStep)
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    if (err.response?.status && err.response.data.messageCode) {
                        setMessageCode(err.response.data.messageCode)
                    } else {
                        setMessageCode('E00001')
                    }
                }
            })

        axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
            .then(response => {
                setAuthorities(response.data.authorities);
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    if (err.response?.status && err.response.data.messageCode) {
                        setMessageCode(err.response.data.messageCode)
                    } else {
                        setMessageCode('E00001')
                    }
                }
            }).finally(() => {
                setLoading(false);
            })


    }, [currentWorkspace, location.pathname]);

    const renderRows = () => {
        const rows = [];
        for (let step = 1; step <= 5; step++) {
            const userNames = workspaceApprovers?.approvers
                .filter(approver => approver.approvalStep === step)
                .map(approver => approver.userName) || [];
            rows.push(
                isLoading
                    ? <TableRow key={step}>
                        <TableCell className="h-12 w-12">
                            <Skeleton className="h-12 w-12" />
                        </TableCell>
                        <TableCell className="text-left">
                            <Skeleton className="h-12 w-96" />
                        </TableCell>
                    </TableRow>
                    : <TableRow key={step} className={`${step > (approvalStep ?? 0) ? 'bg-gray-200' : ''}`}>
                        <TableCell className="w-20">
                            <img src="/icons/person.svg" style={{ backgroundColor: '#F0F2F5', borderRadius: '0.75rem' }} />
                        </TableCell>
                        <TableCell className="min-w-48">
                            <p className="font-bold text-black">{step}段階目</p>
                            <p>{userNames.join(', ')}</p>
                        </TableCell>
                        <TableCell className="text-right">
                            {step <= (approvalStep ?? 0) && hasWorkspaceAuthority(currentWorkspaceId ?? 0, authorities, Authorities.ADMIN) && (
                                <Button className={`btn ${userNames.length === 0 ? 'btn-action' : 'btn-light'}`}>
                                    {userNames.length === 0 ? '承認者を設定する' : '承認者を変更する'}
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
            );
        }
        return rows;
    }

    return (
        <div className="container">
            <header className="mb-10">
                <MessageBox messageCode={messageCode} />
                <h2 className="heading-2">承認ルート</h2>
                <div className="max-w-52">
                    <Label>必要な承認回数</Label>
                    {isLoading
                        ? <Skeleton className="h-12 w-52" />
                        : approvalStep !== null && (
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
                    {!isLoading && hasWorkspaceAuthority(currentWorkspaceId ?? 0, authorities, Authorities.ADMIN) && (
                        <div className="mr-4 my-3 mb-5 w-52">
                            <Button className="btn btn-primary w-full">設定を変更する</Button>
                        </div>
                    )}
                </div>
            </header>
            <main>
                <h3 className="font-bold text-lg mb-2">承認者</h3>
                <Table className="bg-white mb-5">
                    <TableBody>
                        {renderRows()}
                    </TableBody>
                </Table>
            </main>
        </div >
    )
}

export default ApprovalRoute;
