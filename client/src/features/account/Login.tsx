import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import '../../styles/button.css'

const Login = () => {
    return (
        <>
            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="email" className='text-basic'>メールアドレス</Label>
                <Input type="email" id="email" placeholder="example@example.com" />
            </div>

            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="password">パスワード</Label>
                <Input type="password" id="password" placeholder="password" />
            </div>
            <div className='flex justify-center mb-5'>
                <a href='#' className='text-pale-blue text-sm'>パスワードを忘れた場合</a>
            </div>
            <Button className='btn btn-primary w-full mb-10'>ログイン</Button>
            <div className='flex justify-center mb-1'>
                <p className='text-pale-blue text-sm'>アカウントを持っていない場合</p>
            </div>
            <Button className='btn btn-light w-full'>アカウントを作成する</Button>
        </>
    )
}

export default Login