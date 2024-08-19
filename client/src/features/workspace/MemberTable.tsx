import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Authorities, Authority, AuthorityArray } from '@/lib/auth';
import { hasAuthority, User } from '@/lib/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MemberEdit from './MemberEdit';
import { useLocation } from 'react-router-dom';
import { getWorkspaceIdFrom } from '@/lib/user-workspace';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface MemberTableProps {
    members: User[]
    myAuthorities: Authority[]
    isLoading: boolean
    setMembers: React.Dispatch<React.SetStateAction<User[]>>; // 追加
}

const MemberTable = (props: MemberTableProps) => {
    const location = useLocation();
    const [selectedMember, setSelectedMember] = useState<User | null>(null);

    const { members, myAuthorities, isLoading, setMembers } = props;
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
                {isLoading
                    ? <SkeletonTableRows rowCount={5} />
                    : members.map(member => (
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
                                    <Dialog open={selectedMember?.userId === member.userId} onOpenChange={(open) => open ? setSelectedMember(member) : setSelectedMember(null)}>
                                        <DialogTrigger className="text-right">
                                            <span className='btn btn-link'>編集</span>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl" aria-describedby="ワークスペースに招待するためのダイアログです">
                                            <DialogHeader>
                                                <DialogTitle>
                                                </DialogTitle>
                                            </DialogHeader>
                                            {selectedMember && <MemberEdit user={selectedMember} setDialogOpen={() => setSelectedMember(null)} setMembers={setMembers} />}
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


const SkeletonTableRows: React.FC<{ rowCount: number }> = ({ rowCount }) => {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    {AuthorityArray.map(authority => (
                        <TableCell key={authority.authorityId}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
            ))}
        </>
    );
};