import Loading from "@/components/Loading";
import MessageBox from "@/components/MessageBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountInfoChangeFormData, accountInfoChangeSchema } from "../schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorMessage from "@/components/FormErrorMessage";
import axios, { AxiosError } from "axios";

interface AccountInfoChangeProps {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    className?: string
}

const AccountInfoChange = (props: AccountInfoChangeProps) => {
    const { user, className, setUser, setDialogOpen } = props
    const navigate = useNavigate();
    const location = useLocation();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<AccountInfoChangeFormData>({
        mode: "onSubmit",
        resolver: zodResolver(accountInfoChangeSchema)
    });

    const onSubmit = handleSubmit((data: AccountInfoChangeFormData) => {
        setLoading(true);
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/user-info/change`, { user: data }, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setUser(response.data)
                    navigate(`${location.pathname}?m=S00014`)
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
        <div className={`${className}`}>
            3
            {isLoading
                ? <Loading />
                : <>
                    <MessageBox messageCode={messageCode} />
                    <form onSubmit={onSubmit}>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="lastName" className="w-32">姓：</Label>
                                <Input
                                    type="text"
                                    id="lastName"
                                    defaultValue={user.lastName}
                                    {...register('lastName')}
                                />
                            </div>
                            <FormErrorMessage error={errors.lastName} className="ml-24 mt-1" />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="lastName" className="w-32">名：</Label>
                                <Input
                                    type="text"
                                    id="lastName"
                                    defaultValue={user.firstName}
                                    {...register('firstName')}
                                />
                            </div>
                            <FormErrorMessage error={errors.firstName} className="ml-24 mt-1" />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="userName" className="w-32">ユーザー名：</Label>
                                <Input
                                    type="text"
                                    id="userName"
                                    defaultValue={user.userName}
                                    {...register('userName')}
                                />
                            </div>
                            <FormErrorMessage error={errors.userName} className="ml-24 mt-1" />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center">
                                <Label htmlFor="mailAddress" className="w-32">メールアドレス：</Label>
                                <Input
                                    type="text"
                                    id="mailAddress"
                                    defaultValue={user.mailAddress}
                                    {...register('email')}
                                />
                            </div>
                            <FormErrorMessage error={errors.email} className="ml-24 mt-1" />
                        </div>
                        <section className="flex justify-evenly">
                            <span onClick={() => setDialogOpen(false)} className="btn btn-light">キャンセル</span>
                            <Button className="btn btn-primary">変更を保存する</Button>
                        </section>
                    </form>
                </>
            }
        </div >
    )
}

export default AccountInfoChange