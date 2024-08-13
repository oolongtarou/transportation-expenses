import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberTable from "./MemberTable"
import { User } from "@/lib/user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const users: User[] = [
    {
        userId: 1,
        userName: "Alice",
        mailAddress: "alice@example.com",
        password: "password1",
        roles: [1, 2], // Member, Approver
        authorities: [],
        workspaces: [],
    },
    {
        userId: 2,
        userName: "Bob",
        mailAddress: "bob@example.com",
        password: "password2",
        roles: [100], // Admin
        authorities: [],
        workspaces: [],
    },
    {
        userId: 3,
        userName: "Charlie",
        mailAddress: "charlie@example.com",
        password: "password3",
        roles: [1], // Member
        authorities: [],
        workspaces: [],
    },
    {
        userId: 4,
        userName: "David",
        mailAddress: "david@example.com",
        password: "password4",
        roles: [2], // Approver
        authorities: [],
        workspaces: [],
    },
    {
        userId: 5,
        userName: "Eve",
        mailAddress: "eve@example.com",
        password: "password5",
        roles: [1, 100], // Member, Admin
        authorities: [],
        workspaces: [],
    }
];

const MemberList = () => {
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
                    {/* TODO:↓権限のリストをハードコーディングしている。DBの値を参照するようにしたい。 */}
                    <ToggleGroup type="multiple" className="flex flex-row justify-start gap-4">
                        <ToggleGroupItem value="1" aria-label="Toggle 申請権限" className="toggle-primary w-32">
                            申請権限
                        </ToggleGroupItem>
                        <ToggleGroupItem value="2" aria-label="Toggle 承認権限" className="toggle-primary w-32">
                            承認権限
                        </ToggleGroupItem>
                        <ToggleGroupItem value="100" aria-label="Toggle 管理者権限" className="toggle-primary w-32">
                            管理者権限
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Button className="btn btn-primary w-full">検索</Button>
                </section>
                <MemberTable members={users} />
                <section className="flex justify-end mt-5">
                    <Button className="btn btn-primary">変更を保存する</Button>
                </section>
            </main>
        </div>
    )
}

export default MemberList