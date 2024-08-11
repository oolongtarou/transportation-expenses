import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApplicationForm } from '../app-form'


interface AppListTableProps {
    appForms: ApplicationForm[]
    className?: string;
}

const AppListTable = (props: AppListTableProps) => {
    const { appForms, className } = props;
    return (
        <div className={className}>
            <Table className="table-basic">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">申請書ID</TableHead>
                        <TableHead>申請日</TableHead>
                        <TableHead>申請者名</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>申請書ステータス</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appForms.map(appForm => (
                        <TableRow key={appForm.applicationId}>
                            <TableCell className='font-bold text-lg'>{appForm.applicationId}</TableCell>
                            <TableCell>{appForm.applicationDate.toLocaleDateString()}</TableCell>
                            <TableCell>{appForm.userName}</TableCell>
                            <TableCell>{appForm.totalAmount}</TableCell>
                            <TableCell>{appForm.applicationStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppListTable