import { Input } from "@/components/ui/input"
import MemberTable from "./MemberTable"
import { RawUserData, ToWorkspaceMembers, User } from "@/lib/user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AuthorityArray, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import WorkspaceInviteDialog from "./WorkspaceInviteDialog";
import { useLocation, useSearchParams } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import MessageBox from "@/components/MessageBox";

const MemberList = () => {
    const { currentWorkspace, myAuthorities } = useAuth();
    const location = useLocation();
    const [members, setMembers] = useState<User[]>([]);
    const [originalMembers, setOriginalMembers] = useState<User[]>([]);
    const [filterText, setFilterText] = useState<string>("");
    const [selectedAuthorities, setSelectedAuthorities] = useState<number[]>([]); // 選択された権限IDを管理する状態
    const [isLoading, setLoading] = useState(true);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setLoading(true);
        axios.get<RawUserData[]>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/member-list`, { params: { workspaceId: getWorkspaceIdFrom(location.pathname) } })
            .then(response => {
                const workspaceMembers = ToWorkspaceMembers(response.data);
                setMembers(workspaceMembers);
                setOriginalMembers(workspaceMembers);  // オリジナルのリストを保存しておく
            })
            .catch(error => {
                console.error(error);
            }).finally(() => {
                setMessageCode(searchParams.get('m'));
                setLoading(false);
            });
    }, [currentWorkspace?.workspaceId, location.pathname, searchParams]);

    useEffect(() => {
        const filteredMembers = originalMembers.filter(member =>
            (!filterText || member.userName.includes(filterText)) &&
            (selectedAuthorities.length === 0 || selectedAuthorities.some(authId =>
                member.authorities.some(authority => authority.authorityId === authId)
            ))
        );
        setMembers(filteredMembers);
    }, [filterText, selectedAuthorities, originalMembers]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    };

    const handleToggleChange = (authorityId: number) => {
        setSelectedAuthorities(prev =>
            prev.includes(authorityId)
                ? prev.filter(id => id !== authorityId)
                : [...prev, authorityId]
        );
    };

    return (
        <div className="container">
            <MessageBox messageCode={messageCode} />
            <header className="flex justify-between items-center">
                <h2 className="heading-2">メンバー一覧</h2>
                <WorkspaceInviteDialog />
            </header>
            <main>
                <section className="lg:w-5/12 flex flex-col gap-4 mb-5">
                    <Input type="text" placeholder="ユーザー名で絞り込む" onChange={handleInputChange} />
                    <ToggleGroup type="multiple" className="flex flex-row justify-start gap-4">
                        {AuthorityArray.map(authority => (
                            <ToggleGroupItem
                                key={authority.authorityId}
                                value={authority.authorityId.toString()}
                                aria-label={`Toggle ${authority.label}`}
                                className="toggle-primary min-w-32"
                                onClick={() => handleToggleChange(authority.authorityId)}
                            >
                                {authority.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </section>
                <MemberTable members={members} myAuthorities={myAuthorities} isLoading={isLoading} setMembers={setMembers} />
                <Separator className="mb-5 max-w-[1200px]" />
            </main>
        </div>
    )
}

export default MemberList