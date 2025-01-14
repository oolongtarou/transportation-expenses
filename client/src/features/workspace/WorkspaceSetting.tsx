import { useEffect, useState } from "react";
import WorkspaceInviteDialog from "./WorkspaceInviteDialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getWorkspaceIdFrom, getWorkspaceWithSmallestId, Workspace } from "@/lib/user-workspace";
import axios, { AxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WorkspaceInfoChange from "./WorkspaceInfoChange";
import MessageBox from "@/components/MessageBox";
import { Input } from "@/components/ui/input";

const WorkspaceSetting = () => {
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const [isLoading, setLoading] = useState(false);
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get<Workspace>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/settings`, { params: { workspaceId: getWorkspaceIdFrom(location.pathname) } })
            .then(response => {
                setWorkspace(response.data);
            })
            .catch(error => {
                console.error(error);
            }).finally(() => {
                setMessageCode(searchParams.get('m'));
                setLoading(false);
            });
    }, [currentWorkspaceId, location.pathname, searchParams]);

    const handleDeleteAlertOpenChange = (open: boolean) => {
        setDeleteAlertOpen(open);
        if (!open) {
            setDeleteConfirmText('');
        }
    };

    const handleDeleteClicked = () => {
        setLoading(true);
        axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/delete`, { data: { workspaceId: currentWorkspaceId }, withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    const smallestWorkspaceId = getWorkspaceWithSmallestId(response.data.workspaces)?.workspaceId;
                    if (smallestWorkspaceId) {
                        navigate(`/w/${smallestWorkspaceId}/app-form/create?m=S00018`);
                    } else {
                        navigate('/account/my-page?m=S00018')
                    }
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
        <div className="container max-w-6xl">
            <MessageBox messageCode={messageCode} />
            <header className="flex justify-between items-center">
                <h2 className="heading-2">ワークスペース設定</h2>
                {isLoading ? <Skeleton className="h-10 w-56" /> : <WorkspaceInviteDialog />}
            </header>
            <div className="flex flex-row justify-between">
                <div className="flex">
                    {isLoading
                        ? <div className="flex items-center space-x-4">
                            <Skeleton className="h-32 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-40" />
                                <Skeleton className="h-24 w-96" />
                            </div>
                        </div>
                        : <>
                            <img src="/icons/default_workspace_icon.svg" className="w-32 h-32 btn-img btn-link" />
                            <div className="ml-3 pr-5 max-w-2xl">
                                <div className="flex flex-row items-center">
                                    <h3 className="font-bold text-xl mr-5">{workspace?.workspaceName}</h3>
                                    {!isLoading
                                        ? <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogTrigger className="text-right">
                                                <div className="flex">
                                                    <img src="/icons/edit.svg" className="btn-img btn-link" />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl" aria-describedby="ワークスペース情報を変更するための確認ダイアログです">
                                                <DialogHeader>
                                                    <DialogTitle className="heading-2 text-center">
                                                        ワークスペース情報を変更する
                                                    </DialogTitle>
                                                    <DialogDescription hidden>
                                                        ワークスペース情報を変更するための確認ダイアログです
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <WorkspaceInfoChange workspace={workspace} setDialogOpen={setDialogOpen} setWorkspace={setWorkspace} />
                                            </DialogContent>
                                        </Dialog>
                                        : null
                                    }
                                </div>
                                <p className="text-pale-blue">{workspace?.description}</p>
                            </div>
                        </>
                    }

                </div>
            </div>
            {isLoading
                ? <></>
                : <div className="mt-5">
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={handleDeleteAlertOpenChange}>
                        <AlertDialogTrigger>
                            <span className="btn btn-danger">ワークスペースを削除する</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    この操作は元に戻せません。ワークスペースを削除した場合、申請書データもすべて削除されます。<br />
                                    {`削除するためには"${workspace?.workspaceName}"と入力してください。`}
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
                                    disabled={deleteConfirmText !== workspace?.workspaceName}
                                    onClick={handleDeleteClicked}
                                >
                                    削除
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        </ div>
    )
}

export default WorkspaceSetting