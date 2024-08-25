import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getLabelByAuthorityId } from "@/lib/auth";
import { User } from "@/lib/user";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AccountInfoChange from "./AccountInfoChange";
import MessageBox from "@/components/MessageBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    setUser(response.data);
                } else {
                    navigate('/');
                }
            })
            .catch((err: AxiosError) => {
                console.error(`サーバーエラーが発生しました：${err.code}`);
                navigate("/");
            }).
            finally(() => {
                setMessageCode(searchParams.get('m'));
                setLoading(false);
            })
    }, [navigate, searchParams]);


    const handleDeleteAlertOpenChange = (open: boolean) => {
        setDeleteAlertOpen(open);
        if (!open) {
            setDeleteConfirmText('');
        }
    };

    const handleDeleteClicked = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/account/delete`, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/?m=S00017')
                } else {
                    setMessageCode('E00001')
                }
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    if (err.response?.status && err.response.data.messageCode) {
                        setMessageCode(err.response.data.messageCode)
                    } else {
                        setMessageCode('E00001')
                    }
                }
            }).
            finally(() => {
                setLoading(false);
            })
    };

    return (
        <div className="container max-w-3xl">
            <MessageBox messageCode={messageCode} />
            <h2 className="heading-2">マイページ</h2>
            <div className="flex mb-5">
                {isLoading
                    ? <Skeleton className="h-32 w-32" />
                    : <img src="/icons/default_user_icon.svg" className="w-32 h-32 btn-img btn-link" />
                }

                <div className="ml-3 pr-5 max-w-2xl">
                    <div className="flex flex-row items-center">
                        <h3 className="font-bold text-xl mr-5">
                            {isLoading
                                ? <Skeleton className="h-12 w-32" />
                                : user?.userName
                            }
                        </h3>
                        {!isLoading && user
                            ? <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger className="text-right">
                                    <div className="flex">
                                        <img src="/icons/edit.svg" className="btn-img btn-link" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl" aria-describedby="アカウント情報を変更するための確認ダイアログです">
                                    <DialogHeader>
                                        <DialogTitle className="heading-2 text-center">
                                            アカウント情報を変更する
                                        </DialogTitle>
                                        <DialogDescription hidden>
                                            アカウント情報を変更するための確認ダイアログです
                                        </DialogDescription>
                                    </DialogHeader>
                                    <AccountInfoChange user={user} className="container" setUser={setUser} setDialogOpen={setDialogOpen} />
                                </DialogContent>
                            </Dialog>
                            : null
                        }
                    </div>
                    {isLoading
                        ? <Skeleton className="h-8 w-52 mt-3" />
                        : <p className="text-pale-blue">{user?.mailAddress}</p>
                    }
                </div>
            </div>

            <div className="mb-5">
                <h3 className="font-bold text-2xl mb-2 ml-4">ワークスペース</h3>
                <Table className="bg-white mb-5">
                    <TableBody>
                        {isLoading
                            ? <>
                                <TableRow>
                                    <TableCell className="flex flex-row gap-3">
                                        <Skeleton className="h-12 w-12" />
                                        <Skeleton className="h-12 w-96" />
                                    </TableCell>
                                </TableRow>
                            </>
                            : user
                                ? user.workspaces.map(workspace => (
                                    <TableRow key={workspace.workspaceId} className="flex justify-between items-center">
                                        <TableCell className="flex flex-row gap-3">
                                            <img src="/icons/default_workspace_icon.svg" className="btn-img btn-light" style={{ cursor: 'auto' }} />
                                            <div>
                                                <p className="text-black font-bold">{workspace.workspaceName}</p>
                                                <p>{user.authorities
                                                    .filter(authority => authority.workspaceId === workspace.workspaceId)
                                                    .map(authority => getLabelByAuthorityId(authority.authorityId)).join(', ')}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>))
                                : null
                        }

                    </TableBody>
                </Table>
            </div>
            {isLoading
                ? <></>
                : <div className="flex justify-end gap-5 mb-5">
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={handleDeleteAlertOpenChange}>
                        <AlertDialogTrigger>
                            <span className="btn btn-danger">アカウントを削除する</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    この操作は元に戻せません。申請書データは消えませんが、ワークスペース所属情報と権限情報はサーバーから削除されます。<br />
                                    {`削除するためには"${user?.mailAddress}"と入力してください。`}
                                    <Input
                                        type="text"
                                        className="my-3"
                                        onChange={(data) => setDeleteConfirmText(data.target.value)}
                                    />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                    className="btn btn-danger"
                                    disabled={deleteConfirmText !== user?.mailAddress}
                                    onClick={handleDeleteClicked}
                                >
                                    削除
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Link to={`/w/${getWorkspaceIdFrom(location.pathname)}/account/password/change`} className="btn btn-light">パスワードを変更する</Link>
                    <Button className="btn btn-primary">ワークスペースを作成する</Button>
                </div>
            }
        </div >
    )
}

export default MyPage