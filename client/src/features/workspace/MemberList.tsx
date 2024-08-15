import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberTable from "./MemberTable"
import { hasAuthority, RawUserData, ToWorkspaceMembers, User } from "@/lib/user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Authorities, AuthorityArray, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WorkspaceInvite from "./WorkspaceInvite";

const MemberList = () => {
    const { currentWorkspace, myAuthorities } = useAuth();

    const [members, setMembers] = useState<User[]>([]);
    const [originalMembers, setOriginalMembers] = useState<User[]>([]);
    const [filterText, setFilterText] = useState<string>("");

    useEffect(() => {
        axios.get<RawUserData[]>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/member-list`, { params: { workspaceId: currentWorkspace?.workspaceId } })
            .then(response => {
                const workspaceMembers = ToWorkspaceMembers(response.data);
                setMembers(workspaceMembers);
                setOriginalMembers(workspaceMembers);  // オリジナルのリストを保存しておく
            })
            .catch(error => {
                console.error(error);
            });
    }, [currentWorkspace?.workspaceId]);

    useEffect(() => {
        if (filterText) {
            const filteredMembers = originalMembers.filter(member =>
                member.userName.includes(filterText)
            );
            setMembers(filteredMembers);
        } else {
            setMembers(originalMembers);
        }
    }, [filterText, originalMembers]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    };

    return (
        <div className="container">
            <header className="flex justify-between items-center">
                <h2 className="heading-2">メンバー一覧</h2>
                <Dialog>
                    <DialogTrigger className="text-right">
                        <Button className="btn btn-primary">
                            <img src="/icons/add_person.svg" />
                            <span className="ml-2">ワークスペースに招待する</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl" aria-describedby="ワークスペースに招待するためのダイアログです">
                        <DialogHeader>
                            <DialogTitle>
                            </DialogTitle>
                        </DialogHeader>
                        <WorkspaceInvite />
                    </DialogContent>
                </Dialog>

            </header>
            <main>
                <section className="w-5/12 flex flex-col gap-4 mb-5">
                    <Input type="text" placeholder="ユーザー名で絞り込む" onChange={handleInputChange} />
                    <ToggleGroup type="multiple" className="flex flex-row justify-start gap-4">
                        {AuthorityArray.map(authority => (
                            <ToggleGroupItem
                                key={authority.authorityId}
                                value={authority.authorityId.toString()}
                                aria-label={`Toggle ${authority.label}`}
                                className="toggle-primary w-32"
                            >
                                {authority.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    {/* <Button className="btn btn-primary w-full">検索</Button> */}
                </section>
                <MemberTable members={members} myAuthorities={myAuthorities} />
                <section className="flex justify-end my-5">
                    {hasAuthority(myAuthorities, Authorities.ADMIN)
                        ?
                        <Button className="btn btn-primary">変更を保存する</Button>
                        : <></>}
                </section>
            </main>
        </div>
    )
}

export default MemberList