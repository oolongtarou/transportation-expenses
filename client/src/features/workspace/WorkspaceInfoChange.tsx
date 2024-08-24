import Loading from "@/components/Loading"
import { Workspace } from "@/lib/user-workspace"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { WorkspaceInfoChangeFormData, workspaceInfoChangeSchema } from "../schema/user-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import FormErrorMessage from "@/components/FormErrorMessage"
import MessageBox from "@/components/MessageBox"
import axios, { AxiosError } from "axios"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"

interface WorkspaceInfoChangeProps {
    workspace: Workspace | null
    setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}


const WorkspaceInfoChange = (props: WorkspaceInfoChangeProps) => {
    const { setMyWorkspaces } = useAuth();
    const { workspace, setWorkspace, setDialogOpen } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<WorkspaceInfoChangeFormData>({
        mode: "onSubmit",
        resolver: zodResolver(workspaceInfoChangeSchema)
    });

    const onSubmit = handleSubmit((data: WorkspaceInfoChangeFormData) => {
        if (data.workspaceName == workspace?.workspaceName && data.description == workspace.description) {
            setMessageCode('E00028');
            return;
        }
        setLoading(true);
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/settings/change`, { workspaceId: workspace?.workspaceId, workspaceName: data.workspaceName, description: data.description }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    const userWorkspaces: Workspace[] = response.data.workspaces;
                    setMyWorkspaces(userWorkspaces);
                    const currentWorkspace = userWorkspaces.find(workspace => workspace.workspaceId === workspace.workspaceId);
                    if (currentWorkspace) {
                        setWorkspace(currentWorkspace)
                        navigate(`${location.pathname}?m=S00015`)
                    } else {
                        setMessageCode('E00001')
                    }
                    setDialogOpen(false);
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
            }).finally(() => {
                setLoading(false);
            })
    });

    return (
        <>
            {isLoading ? <Loading />
                :
                <>
                    <MessageBox messageCode={messageCode} />
                    <form onSubmit={onSubmit}>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="workspaceName" className="w-40">ワークスペース名：</Label>
                                <Input
                                    type="text"
                                    id="workspaceName"
                                    defaultValue={workspace?.workspaceName}
                                    {...register('workspaceName')}
                                />
                            </div>
                            <FormErrorMessage error={errors?.workspaceName} className="ml-32 mt-1" />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="description" className="w-40">説明：</Label>
                                <Input
                                    type="text"
                                    id="description"
                                    defaultValue={workspace?.description}
                                    {...register('description')}
                                />
                            </div>
                            <FormErrorMessage error={errors?.description} className="ml-32 mt-1" />
                        </div>

                        <section className="flex justify-evenly">
                            <span onClick={() => setDialogOpen(false)} className="btn btn-light">キャンセル</span>
                            <Button className="btn btn-primary">変更を保存する</Button>
                        </section>
                    </form>
                </>
            }
        </>
    )
}

export default WorkspaceInfoChange