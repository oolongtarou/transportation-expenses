import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { WorkspaceInviteFormData } from "../schema/user-schema";
import { useState } from "react";
import MessageBox from "@/components/MessageBox";
import axios, { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
// import { Textarea } from "@/components/ui/textarea"

const WorkspaceInvite = () => {
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<WorkspaceInviteFormData>();

    const onSubmit = handleSubmit((data: WorkspaceInviteFormData) => {
        console.log(data);
        setLoading(true);
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/workspace/invite`, { email: data.email, workspaceId: currentWorkspaceId }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    navigate(`/w/${currentWorkspaceId}/workspace/members?m=S00011`);
                } else {
                    setMessageCode(response.data.messageCode);
                }
            })
            .catch((err) => {
                if (err instanceof AxiosError) {
                    if (err.response?.status && err.response.data.messageCode) {
                        setMessageCode(err.response.data.messageCode)
                    } else {
                        setMessageCode('E00001')
                    }
                } else {
                    setMessageCode('E00001')
                }
            }).finally(() => {
                setLoading(false);
            })
    });

    return (

        <div className="container max-w-md">
            {isLoading
                ? <Loading />
                : <>
                    <MessageBox messageCode={messageCode} />
                    <form onSubmit={onSubmit}>
                        <div>
                            <div>
                                <Label htmlFor="mailAddress">メールアドレス</Label>
                                <Badge variant="destructive" className="ml-1">必須</Badge>
                            </div>
                            <Input
                                type="mail"
                                id="mailAddress"
                                className="mt-2 mb-7"
                                placeholder="you@example.com"
                                {...register('email')}
                            />
                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                        </div>

                        {/* <div>
                <Label htmlFor="message">メッセージ</Label>
                <Textarea id="message" className="mt-2 mb-7" />
            </div> */}

                        <div className="flex justify-evenly">
                            {/* <span className="btn btn-light">キャンセル</span> */}
                            <Button type="submit" className="btn btn-primary">招待する</Button>
                        </div>
                    </form>
                </>
            }
        </div>
    )
}

export default WorkspaceInvite