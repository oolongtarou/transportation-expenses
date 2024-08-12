import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema } from '../schema/user-schema';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import AlertDestructive from '@/components/Alert';

type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginFormData>({
        mode: "onSubmit",
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = handleSubmit((data: LoginFormData) => {
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/login`, data, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    navigate("/menu")
                } else {
                    setError(response.data.message);
                }
            })
            .catch((err: AxiosError) => {
                setError(`サーバーエラーが発生しました。ステータスコード:${err.code}`);
            })
    });

    return (
        <>
            {error ? <AlertDestructive message={error} /> : null}
            <form onSubmit={onSubmit}>
                <div className="w-full mb-5">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                        type="text"
                        id="email"
                        placeholder="example@example.com"
                        className='mt-1'
                        {...register("email")}
                    />
                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
                <div className="w-full mb-5">
                    <Label htmlFor="password">パスワード</Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="password"
                        className='mt-1'
                        {...register("password")}
                    />
                    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                </div>
                <div className='text-center mb-5'>
                    <a onClick={() => navigate("/account/password/reset-link")} className='text-pale-blue text-sm' style={{ cursor: "pointer" }}>
                        パスワードを忘れた場合
                    </a>
                </div>
                <Button type='submit' className='btn btn-primary w-full mb-10'>ログイン</Button>
                <div className='text-center mb-1'>
                    <p className='text-pale-blue text-sm'>アカウントを持っていない場合</p>
                </div>
                <Button onClick={() => navigate("/account/signup")} className='btn btn-light w-full'>アカウントを作成する</Button>
            </form>
        </>
    )
}

export default Login