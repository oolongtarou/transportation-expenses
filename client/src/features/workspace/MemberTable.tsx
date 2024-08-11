import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { isAdmin, isApprover, isMember, User } from '@/lib/user'

interface MemberTableProps {
    members: User[]
}

const MemberTable = (props: MemberTableProps) => {
    const { members } = props;
    return (
        <Table className="min-w-[1200px] table-auto text-pale-blue">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ユーザー名</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead className='text-center'>申請権限</TableHead>
                    <TableHead className='text-center'>承認権限</TableHead>
                    <TableHead className='text-center'>管理者権限権限</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map(member => (
                    <TableRow key={member.userId}>
                        <TableCell className='font-bold text-lg'>{member.userName}</TableCell>
                        <TableCell>{member.mailAddress}</TableCell>
                        <TableCell className='text-center px-0'>
                            <Checkbox checked={isMember(member)} />
                        </TableCell>
                        <TableCell className='text-center px-0'>
                            <Checkbox checked={isApprover(member)} />
                        </TableCell>
                        <TableCell className='text-center px-0'>
                            <Checkbox checked={isAdmin(member)} />
                        </TableCell>
                        <TableCell>
                            <Button className='btn btn-link'>削除</Button>
                        </TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}

export default MemberTable