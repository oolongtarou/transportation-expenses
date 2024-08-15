import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Authorities, Authority, AuthorityArray } from '@/lib/auth';
import { hasAuthority, User } from '@/lib/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MemberEdit from './MemberEdit';
import { useLocation } from 'react-router-dom';
import { getWorkspaceIdFrom } from '@/lib/user-workspace';

interface MemberTableProps {
    members: User[]
    myAuthorities: Authority[]
}

const MemberTable = (props: MemberTableProps) => {
    const location = useLocation();

    const { members, myAuthorities } = props;
    return (
        <Table className="max-w-[1200px] table-auto text-pale-blue">
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-40">ユーザー名</TableHead>
                    <TableHead className='min-w-[200px]'>メールアドレス</TableHead>
                    {AuthorityArray.map(authority => (
                        <TableHead
                            key={authority.authorityId}
                            className='text-center w-[150px]'>
                            {authority.label}
                        </TableHead>
                    ))}
                    {hasAuthority(myAuthorities, Authorities.ADMIN) ? <TableHead className='min-w-28'></TableHead> : <></>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map(member => (
                    <TableRow
                        key={member.userId}
                        style={{ textAlign: 'left' }}
                    >
                        <TableCell className='font-bold text-lg'>{member.userName}</TableCell>
                        <TableCell>{member.mailAddress}</TableCell>
                        {AuthorityArray.map(authority => (
                            <TableCell key={authority.authorityId} className='text-center px-0'>
                                <Checkbox checked={hasAuthority(member.authorities, authority.authorityId)} />
                            </TableCell>
                        ))}
                        {hasAuthority(myAuthorities.filter(authority => authority.workspaceId === getWorkspaceIdFrom(location.pathname)), Authorities.ADMIN)
                            ?
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger className="text-right">
                                        <span className='btn btn-link'>編集</span>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-xl" aria-describedby="ワークスペースに招待するためのダイアログです">
                                        <DialogHeader>
                                            <DialogTitle>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <MemberEdit user={member} />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            : <></>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default MemberTable