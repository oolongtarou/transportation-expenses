import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Authorities, Authority, AuthorityArray } from '@/lib/auth';
import { hasAuthority, User } from '@/lib/user'

interface MemberTableProps {
    members: User[]
    myAuthorities: Authority[]
}

const MemberTable = (props: MemberTableProps) => {
    const { members, myAuthorities } = props;
    return (
        <Table className="max-w-[1200px] table-auto text-pale-blue">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ユーザー名</TableHead>
                    <TableHead className='min-w-[200px]'>メールアドレス</TableHead>
                    {AuthorityArray.map(authority => (
                        <TableHead
                            key={authority.authorityId}
                            className='text-center w-[150px]'>
                            {authority.label}
                        </TableHead>
                    ))}
                    {hasAuthority(myAuthorities, Authorities.ADMIN) ? <TableHead></TableHead> : <></>}
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map(member => (
                    <TableRow key={member.userId}>
                        <TableCell className='font-bold text-lg'>{member.userName}</TableCell>
                        <TableCell>{member.mailAddress}</TableCell>
                        {AuthorityArray.map(authority => (
                            <TableCell key={authority.authorityId} className='text-center px-0'>
                                <Checkbox checked={hasAuthority(member.authorities, authority.authorityId)} />
                            </TableCell>
                        ))}
                        {hasAuthority(myAuthorities, Authorities.ADMIN)
                            ?
                            <TableCell>
                                <Button className='btn btn-link'>削除</Button>
                            </TableCell>
                            : <></>}
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}

export default MemberTable