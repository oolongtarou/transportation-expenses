import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Authorities, AuthorityArray } from "@/lib/auth";
import { hasAuthority, User } from "@/lib/user"
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"

interface MemberEditProps {
    user: User;
}

const MemberEdit = (props: MemberEditProps) => {
    const { user } = props;

    return (
        <div>
            <h2 className="heading-2">メンバー情報を修正する</h2>
            <Separator />
            <section className="flex flex-col gap-3">
                <div className="flex items-center">
                    <Label className="text-lg w-[125px]">ユーザー名：</Label>
                    <p>{user.userName}</p>
                </div>
                <div className="flex items-center">
                    <Label className="text-lg w-[125px]">メールアドレス：</Label>
                    <p>{user.mailAddress}</p>
                </div>
                {AuthorityArray.map(authority => (
                    <div
                        key={authority.authorityId}
                        className="flex items-center"
                    >
                        <Label className="text-lg w-[125px]">{authority.label}：</Label>
                        {authority.authorityId == Authorities.APPLICATION
                            ?
                            <Checkbox
                                checked={hasAuthority(user.authorities, authority.authorityId)}
                                disabled
                            />
                            :
                            <Checkbox
                                defaultChecked={hasAuthority(user.authorities, authority.authorityId)}
                            />
                        }
                    </div>
                ))}
            </section>
            <section className="flex justify-evenly my-5">
                <Button className="btn btn-danger">ワークスペースから削除する</Button>
                <Button className="btn btn-primary">設定を保存する</Button>
            </section>
        </div>
    )
}

export default MemberEdit