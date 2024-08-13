import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApplicationForm } from '../app-form'
import { formatWithCommas } from '@/lib/math';


interface AppListTableProps {
    appForms: ApplicationForm[]
    className?: string;
}

const AppListTable = (props: AppListTableProps) => {
    const { appForms, className } = props;
    return (
        <div className={className}>
            <Table className="table-mini">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">申請書ID</TableHead>
                        <TableHead>申請日</TableHead>
                        <TableHead>申請者名</TableHead>
                        <TableHead className='text-right'>金額</TableHead>
                        <TableHead className='text-center'>申請書ステータス</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appForms.map(appForm => (
                        <TableRow key={appForm.applicationId}>
                            <TableCell className='font-bold text-lg'>{appForm.applicationId}</TableCell>
                            <TableCell>{new Date(appForm.applicationDate).toLocaleDateString()}</TableCell>
                            <TableCell>{appForm.user.userName}</TableCell>
                            <TableCell className='font-bold text-right'>{formatWithCommas(appForm.totalAmount)}</TableCell>
                            <TableCell className='flex flex-row justify-center'>
                                {appForm.statusId === 1 || appForm.statusId === 2 ? (
                                    <span className="label-fill label-fill-action w-32">{appForm.status.statusName}</span>
                                ) : appForm.statusId === 3 ? (
                                    <span className="label-fill label-fill-success w-32">{appForm.status.statusName}</span>
                                ) : (
                                    <span className="label-fill label-fill-light w-32">{appForm.status.statusName}</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}

export default AppListTable