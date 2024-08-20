import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PasswordRulesDescription from './PasswordRulesDescription'
import { Link, useNavigate } from 'react-router-dom'
import MustBadge from '@/components/MustBadge'
import { useForm } from 'react-hook-form'
import { SignupFormData, signupSchema } from '../schema/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import MessageBox from '@/components/MessageBox'
import { scrollToTop } from '@/lib/utils'
import Loading from '@/components/Loading'

const SignUp = () => {
    const [isLoading, setLoading] = useState(false);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignupFormData>({
        mode: "onSubmit",
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = handleSubmit(async (data: SignupFormData) => {
        setLoading(true);
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/account/signup`, { signFormData: data }, { withCredentials: true });
            console.log(result);
            if (result.status === 200 && result.data.userId) {
                navigate('/account/login?m=S00010')
            } else {
                setMessageCode('E00001')
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status && err.response.data.messageCode) {
                    setMessageCode(err.response.data.messageCode)
                } else {
                    setMessageCode('E00001')
                }
            }
        } finally {
            setLoading(false);
            scrollToTop();
        }
    });

    return (
        <>
            {isLoading
                ? <Loading />
                : <>
                    <div className='mt-44' />
                    <MessageBox messageCode={messageCode} className='mt-64' />
                    <h2 className='heading-2'>アカウントを作成する</h2>
                    <PasswordRulesDescription />

                    <form onSubmit={onSubmit}>
                        <div className='flex gap-5'>
                            <div className="grid w-full items-center gap-1.5 mb-5">
                                <div>
                                    <Label htmlFor="lastName" className='text-basic'>姓</Label>
                                    <MustBadge />
                                </div>
                                <Input
                                    type="text"
                                    id="lastName"
                                    placeholder="山田"
                                    {...register('lastName')}
                                />
                                {errors.lastName && <p className='text-red-500'>{errors.lastName.message}</p>}
                            </div>

                            <div className="grid w-full items-center gap-1.5 mb-5">
                                <div>
                                    <Label htmlFor="firstName" className='text-basic'>名</Label>
                                    <MustBadge />
                                </div>
                                <Input
                                    type="text"
                                    id="firstName"
                                    placeholder="太郎"
                                    {...register('firstName')}
                                />
                                {errors.firstName && <p className='text-red-500'>{errors.firstName.message}</p>}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5 mb-5">
                            <div>
                                <Label htmlFor="userName" className='text-basic'>ユーザー名</Label>
                                <MustBadge />
                            </div>
                            <Input
                                type="text"
                                id="userName"
                                placeholder="山田くん"
                                {...register('userName')}
                            />
                            {errors.userName && <p className='text-red-500'>{errors.userName.message}</p>}
                        </div>

                        <div className="grid w-full items-center gap-1.5 mb-5">
                            <div>
                                <Label htmlFor="email" className='text-basic'>メールアドレス</Label>
                                <MustBadge />
                            </div>
                            <Input
                                type="email"
                                id="email"
                                placeholder="yamada.taro@example.com"
                                {...register('email')}
                            />
                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                        </div>

                        <div className="grid w-full items-center gap-1.5 mb-5">
                            <div>
                                <Label htmlFor="password">パスワード</Label>
                                <MustBadge />
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="password"
                                {...register('password')}
                            />
                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                        </div>


                        <div className="grid w-full items-center gap-1.5 mb-5">
                            <div>
                                <Label htmlFor="password">パスワード(確認用)</Label>
                                <MustBadge />
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="password"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                        </div>

                        <div className='flex justify-evenly my-5'>
                            <Link to='/account/login' className='btn btn-light'>キャンセル</Link>
                            <Button className='btn btn-primary'>アカウントを作成する</Button>
                        </div>
                    </form>
                </>
            }
        </>
    )
}

export default SignUp