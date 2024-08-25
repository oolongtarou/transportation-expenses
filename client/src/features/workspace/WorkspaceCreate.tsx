import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { WorkspaceCreateFormData, workspaceSchema } from "../schema/workspace-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import FormErrorMessage from "@/components/FormErrorMessage"
import MessageBox from "@/components/MessageBox"
import axios, { AxiosError } from "axios"
import Loading from "@/components/Loading"

interface WorkspaceCreateProps {
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const WorkspaceCreate = (props: WorkspaceCreateProps) => {
    const { setDialogOpen } = props;
    const navigate = useNavigate();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<WorkspaceCreateFormData>({
        mode: "onSubmit",
        resolver: zodResolver(workspaceSchema)
    });

    const onCancelClicked = () => {
        setDialogOpen(false);
    }

    const onSubmit = handleSubmit((data: WorkspaceCreateFormData) => {
        setLoading(true);
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/create`, { data }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    const createdWorkspace = response.data;
                    const workspaceId = createdWorkspace.workspaceId;
                    navigate(`/w/${workspaceId}/app-form/create?m=S00019`)
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
        <div className="container max-w-md">
            <h2 className="heading-2">ワークスペースを作成する</h2>
            <MessageBox messageCode={messageCode} />

            {isLoading ? <Loading />
                : <form>
                    <div className="mb-7">
                        <div>
                            <Label htmlFor="workspaceName">ワークスペース名</Label>
                            <Badge variant="destructive" className="ml-1">必須</Badge>
                        </div>
                        <Input
                            type="text"
                            id="workspaceName"
                            className="mt-2"
                            {...register('workspaceName')}
                        />
                        <FormErrorMessage error={errors.workspaceName} />
                    </div>

                    <div className="mb-7">
                        <Label htmlFor="description">説明</Label>
                        <Textarea
                            id="description"
                            className="mt-2"
                            {...register('description')}
                        />
                        <FormErrorMessage error={errors.description} />
                    </div>

                    <div className="flex justify-evenly">
                        <Button type="button" onClick={onCancelClicked} className="btn btn-light">キャンセル</Button>
                        <Button onClick={onSubmit} className="btn btn-primary">ワークスペースを作成する</Button>
                    </div>
                </form>
            }
        </div>
    )
}

export default WorkspaceCreate