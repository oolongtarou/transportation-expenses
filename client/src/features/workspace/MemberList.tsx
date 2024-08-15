import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberTable from "./MemberTable"
import { hasAuthority, RawUserData, ToWorkspaceMembers, User } from "@/lib/user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Authorities, AuthorityArray, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import axios from "axios";

const MemberList = () => {
    const { currentWorkspace, myAuthorities } = useAuth();

    const [members, setMembers] = useState<User[]>([]);

    useEffect(() => {
        axios.get<RawUserData[]>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/member-list`, { params: { workspaceId: currentWorkspace?.workspaceId } })
            .then(response => {
                const workspaceMembers = ToWorkspaceMembers(response.data);
                console.log(workspaceMembers);
                setMembers(workspaceMembers);
            })
            .catch(error => {
                console.error(error);
            });
    }, [currentWorkspace?.workspaceId]);
    // currentWorkspaceのメンバー一覧を取得する。

    return (
        <div className="container">
            <header className="flex justify-between items-center">
                <h2 className="heading-2">メンバー一覧</h2>
                <Button className="btn btn-primary">
                    <img src="/icons/add_person.svg" />
                    <span className="ml-2">ワークスペースに招待する</span>
                </Button>
            </header>
            <main>
                <section className="w-5/12 flex flex-col gap-4 mb-5">
                    <Input type="text" placeholder="ユーザー名で検索する" />
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
                    <Button className="btn btn-primary w-full">検索</Button>
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