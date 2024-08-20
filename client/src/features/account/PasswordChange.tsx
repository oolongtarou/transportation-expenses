import { Label } from "@/components/ui/label"
import PasswordRulesDescription from "./PasswordRulesDescription"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { PasswordChangeFormData, passwordChangeSchema } from "../schema/user-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Loading from "@/components/Loading"
import FormErrorMessage from "@/components/FormErrorMessage"
import MessageBox from "@/components/MessageBox"
import axios, { AxiosError } from "axios"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

type SubmitType = 'confirm' | 'complete';

const PasswordChange = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<PasswordChangeFormData>({
        mode: "onSubmit",
        resolver: zodResolver(passwordChangeSchema)
    });

    const onCancel = () => navigate(location.pathname.replace('account/password/change', 'my-page'));

    const onSubmit = (data: PasswordChangeFormData, submitType: SubmitType) => {
        switch (submitType) {
            case "confirm":
                setDialogOpen(true);
                break;
            case "complete":
                setLoading(true);
                axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/password/change`, data, { withCredentials: true })
                    .then((response) => {
                        if (response.status === 200) {
                            setMessageCode('S00013')
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
                        setDialogOpen(false);
                    })
                break;
            default:
                break;
        }
    };

    return (
        <>
            {isLoading ? <Loading />
                :
                <>
                    <form>
                        <div className="container max-w-xl">
                            <MessageBox messageCode={messageCode} />
                            <h2 className="heading-2">パスワードを変更する</h2>
                            <PasswordRulesDescription />

                            <div className="grid w-full items-center gap-1.5 mb-7">
                                <Label htmlFor="currentPassword">現在のパスワード</Label>
                                <Input
                                    type="password"
                                    id="currentPassword"
                                    className="mt-2"
                                    {...register('currentPassword')}
                                />
                                <FormErrorMessage error={errors.currentPassword} />
                            </div>

                            <div className="grid w-full items-center gap-1.5 mb-7">
                                <Label htmlFor="newPassword">新しいパスワード</Label>
                                <Input
                                    type="password"
                                    id="newPassword"
                                    className="mt-2"
                                    {...register('newPassword')}
                                />
                                <FormErrorMessage error={errors.newPassword} />
                            </div>

                            <div className="grid w-full items-center gap-1.5 mb-7">
                                <Label htmlFor="confirmPassword">新しいパスワード(確認用)</Label>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    className="mt-2"
                                    {...register('confirmPassword')}
                                />
                                <FormErrorMessage error={errors.confirmPassword} />
                            </div>

                            <div className="flex justify-evenly mb-5">
                                <Button type="button" onClick={onCancel} className="btn btn-light" >キャンセル</Button>
                                <Button type="button" onClick={handleSubmit((data) => onSubmit(data, 'confirm'))} className="btn btn-primary">パスワードを変更する</Button>
                                <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                                    <AlertDialogTrigger>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>パスワードを変更しますか？</AlertDialogTitle>
                                            <AlertDialogDescription hidden>
                                                パスワードを変更するための確認ダイアログです。
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleSubmit((data) => onSubmit(data, 'complete'))} className="btn btn-primary">変更する</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </form>
                </>
            }
        </>
    )
}

export default PasswordChange