import { useEffect, useState } from "react";
import WorkspaceInviteDialog from "./WorkspaceInviteDialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useLocation } from "react-router-dom";
import { getWorkspaceIdFrom, Workspace } from "@/lib/user-workspace";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const WorkspaceSetting = () => {
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const [isLoading, setLoading] = useState(false);
    const [workspace, setWorkspace] = useState<Workspace | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get<Workspace>(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/settings`, { params: { workspaceId: getWorkspaceIdFrom(location.pathname) } })
            .then(response => {
                setWorkspace(response.data);
            })
            .catch(error => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            });
    }, [currentWorkspaceId, location.pathname]);

    return (
        <div className="container max-w-6xl">
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
                                    <img src="/icons/edit.svg" className="btn-img btn-link" />
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
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <span className="btn btn-danger">ワークスペースを削除する</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    この操作は元に戻せません。
                                    ワークスペースは永久に削除され、データはサーバーから削除されます。
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction className="btn btn-danger">削除</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        </ div>
    )
}

export default WorkspaceSetting