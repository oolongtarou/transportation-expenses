import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema } from '../schema/user-schema';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import AlertDestructive from '@/components/Alert';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getWorkspaceWithSmallestId } from '@/lib/user-workspace';

type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const { setIsLoggedIn, setCurrentWorkspace, setMyWorkspaces, setMyAuthorities } = useAuth();
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

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    const defaultWorkspaceId = getWorkspaceWithSmallestId(response.data.workspaces)
                    navigate(`/w/${defaultWorkspaceId?.workspaceId}/app-form/create`);
                } else {
                    navigate('/');
                }
            })
            .catch((err: AxiosError) => {
                window.alert(`サーバーエラーが発生しました：${err.code}`);
            });
    }, [navigate]);

    const onSubmit = handleSubmit((data: LoginFormData) => {
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/login`, data, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    setIsLoggedIn(true);
                    setMyWorkspaces(response.data.workspaces);
                    setCurrentWorkspace(getWorkspaceWithSmallestId(response.data.workspaces));
                    setMyAuthorities(response.data.authorities);
                    navigate(`/w/${getWorkspaceWithSmallestId(response.data.workspaces)?.workspaceId}/app-form/create`);
                } else {
                    setError(response.data.message);
                }
            })
            .catch((err: AxiosError) => {
                setError(`サーバーエラーが発生しました：${err.code}`);
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
                    <Link to="/account/password/reset-link" className='text-pale-blue text-sm'>
                        パスワードを忘れた場合
                    </Link>
                </div>
                <Button type='submit' className='btn btn-primary w-full mb-10'>ログイン</Button>
                <div className='text-center mb-1'>
                    <p className='text-pale-blue text-sm'>アカウントを持っていない場合</p>
                </div>
                <Link to="/account/signup" className='block btn btn-light w-full'>アカウントを作成する</Link>
            </form>
        </>
    )
}

export default Login