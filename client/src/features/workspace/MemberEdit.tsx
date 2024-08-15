import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Authorities, AuthorityArray } from "@/lib/auth";
import { hasAuthority, User } from "@/lib/user"
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

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
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button className="btn btn-danger">ワークスペースから削除する</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                                この操作は元に戻せません。
                                このユーザーの所属情報は永久に削除され、データはサーバーから削除されます。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction className="btn btn-danger">削除</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <span className="btn btn-primary">設定を保存する</span>
            </section>
        </div>
    )
}

export default MemberEdit