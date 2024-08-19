import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { loginSchema } from '../schema/user-schema';
import { useAuth } from '@/lib/auth';
import { getWorkspaceWithSmallestId } from '@/lib/user-workspace';
import MessageBox from '@/components/MessageBox';
import Loading from '@/components/Loading';


type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const { setIsLoggedIn, setCurrentWorkspace, setMyWorkspaces, setMyAuthorities } = useAuth();
    const navigate = useNavigate();
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();
    const [isLoading, setLoading] = useState(false);

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
                }
            })
            .catch(() => {
                setMessageCode('E00001')
            });
    }, [navigate]);

    useEffect(() => {
        setMessageCode(searchParams.get('m'));
    }, [searchParams])

    const onSubmit = handleSubmit((data: LoginFormData) => {
        setLoading(true);
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/login`, data, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    setIsLoggedIn(true);
                    setMyWorkspaces(response.data.workspaces);
                    setCurrentWorkspace(getWorkspaceWithSmallestId(response.data.workspaces));
                    setMyAuthorities(response.data.authorities);
                    navigate(`/w/${getWorkspaceWithSmallestId(response.data.workspaces)?.workspaceId}/app-form/create`);
                } else {
                    setMessageCode('E00002');
                }
            })
            .catch(() => {
                setMessageCode('E00001')
            }).finally(() => {
                setLoading(false);
            })
    });

    return (
        <>
            {isLoading
                ? <Loading />
                : <>
                    <MessageBox messageCode={messageCode} />
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
            }
        </>
    )
}

export default Login