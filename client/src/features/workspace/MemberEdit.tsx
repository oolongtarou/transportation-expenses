import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Authorities, Authority, AuthorityArray } from "@/lib/auth";
import { hasAuthority, User } from "@/lib/user"
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loading";
import axios, { AxiosError } from "axios";
import MessageBox from "@/components/MessageBox";
import { scrollToTop } from "@/lib/utils";

interface MemberEditProps {
    user: User;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    setMembers: React.Dispatch<React.SetStateAction<User[]>>; // 追加
}

interface MemberEditFormData {
    hasApplicationAuthority: boolean
    hasApprovalAuthority: boolean
    hasAdminAuthority: boolean
}

const MemberEdit = (props: MemberEditProps) => {
    const { user, setDialogOpen, setMembers } = props;
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const {
        handleSubmit,
        setValue,
    } = useForm<MemberEditFormData>();

    const handleInputChange = (authorityId: number, value: boolean) => {
        switch (authorityId) {
            case Authorities.APPLICATION:
                setValue('hasApplicationAuthority', value);
                break;
            case Authorities.APPROVAL:
                setValue('hasApprovalAuthority', value);
                break;
            case Authorities.ADMIN:
                setValue('hasAdminAuthority', value);
                break;
            default:
                setMessageCode('E00024');
        }
    };

    useEffect(() => {
        setValue('hasApplicationAuthority', false);
        setValue('hasApprovalAuthority', false);
        setValue('hasAdminAuthority', false);
        for (const authority of user.authorities) {
            switch (authority.authorityId) {
                case Authorities.APPLICATION:
                    setValue('hasApplicationAuthority', true);
                    break;
                case Authorities.APPROVAL:
                    setValue('hasApprovalAuthority', true);
                    break;
                case Authorities.ADMIN:
                    setValue('hasAdminAuthority', true);
                    break;
                default:
                    setMessageCode('E00024');
            }
        }
    }, [])

    const onSubmit = handleSubmit((data: MemberEditFormData) => {
        setLoading(true);
        const targetAuthorities: Authority[] = [];
        if (data.hasApplicationAuthority) {
            const authority = AuthorityArray.find(a => a.authorityId === Authorities.APPLICATION);
            if (authority) targetAuthorities.push({ ...authority, workspaceId: currentWorkspaceId ?? 0 });
        }

        if (data.hasApprovalAuthority) {
            const authority = AuthorityArray.find(a => a.authorityId === Authorities.APPROVAL);
            if (authority) targetAuthorities.push({ ...authority, workspaceId: currentWorkspaceId ?? 0 });
        }

        if (data.hasAdminAuthority) {
            const authority = AuthorityArray.find(a => a.authorityId === Authorities.ADMIN);
            if (authority) targetAuthorities.push({ ...authority, workspaceId: currentWorkspaceId ?? 0 });
        }

        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/member/edit`, { userId: user.userId, workspaceId: currentWorkspaceId, authorities: targetAuthorities.map(a => a.authorityId) }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setDialogOpen(false);
                    setMembers(prevMembers =>
                        prevMembers.map(m =>
                            m.userId === user.userId ? { ...m, authorities: targetAuthorities } : m
                        )
                    );
                    navigate(`/w/${currentWorkspaceId}/workspace/members?m=S00012`);
                    scrollToTop();
                } else {
                    setMessageCode(response.data.messageCode);
                }
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    if (err.response?.status && err.response.data.messageCode) {
                        setMessageCode(err.response.data.messageCode);
                    } else {
                        setMessageCode('E00001');
                    }
                } else {
                    setMessageCode('E00001');
                }
            }).finally(() => {
                setLoading(false);
            });
    });

    return (
        <div>
            <MessageBox messageCode={messageCode} />
            {isLoading
                ? <Loading />
                : <>
                    <h2 className="heading-2">メンバー情報を修正する</h2>
                    <Separator />
                    <form onSubmit={onSubmit}>
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
                                    <Checkbox
                                        defaultChecked={hasAuthority(user.authorities, authority.authorityId)}
                                        onCheckedChange={(checked) => handleInputChange(authority.authorityId, Boolean(checked))}
                                    />
                                </div>
                            ))}
                        </section>
                        <section className="flex justify-evenly my-5">
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <span className="btn btn-danger">ワークスペースから削除する</span>
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
                            <Button className="btn btn-primary">設定を保存する</Button>
                        </section>
                    </form>
                </>
            }
        </div>
    )
}

export default MemberEdit