import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApplicationForm, ApplicationStatuses } from '../app-form'
import { formatWithCommas } from '@/lib/math';
import { useLocation } from 'react-router-dom';
import { getWorkspaceIdFrom } from '@/lib/user-workspace';
import { Link } from 'react-router-dom';
import AppFormStatus from './AppFormStatus';


interface AppListTableProps {
    appForms: ApplicationForm[]
    className?: string;
}

const AppListTable = (props: AppListTableProps) => {
    const { appForms, className } = props;
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    return (
        <div className={className}>
            <Table className="table-mini">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-right">申請書ID</TableHead>
                        <TableHead>申請日</TableHead>
                        <TableHead>申請者名</TableHead>
                        <TableHead className='text-right'>金額</TableHead>
                        <TableHead className='text-center'>申請書ステータス</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appForms.map(appForm => (
                        <TableRow key={appForm.applicationId}>
                            <TableCell className='font-bold text-lg text-right py-0'>
                                <Link
                                    to={appForm.statusId === ApplicationStatuses.DRAFT
                                        ? `/w/${currentWorkspaceId}/app-form/create?applicationId=${appForm.applicationId}`
                                        : `/w/${currentWorkspaceId}/app-form/review?applicationId=${appForm.applicationId}`
                                    }
                                    className='block btn btn-link' style={{ textAlign: 'right' }}
                                >
                                    {appForm.applicationId}
                                </Link>
                            </TableCell>
                            <TableCell>{new Date(appForm.applicationDate).toLocaleDateString()}</TableCell>
                            <TableCell>{appForm.user.userName}</TableCell>
                            <TableCell className='font-bold text-right'>{formatWithCommas(appForm.totalAmount)}</TableCell>
                            <TableCell className='flex flex-row justify-center'>
                                <AppFormStatus statusId={appForm.statusId} statusName={appForm.status.statusName} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}

export default AppListTable