import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import '../../styles/button.css'
import '../../styles/index.css'
import PasswordRulesDescription from './PasswordRulesDescription'

const SignUp = () => {
    return (
        <>
            <h2 className='font-bold text-2xl text-center mb-2'>アカウントを作成する</h2>
            <PasswordRulesDescription />

            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="email" className='text-basic'>メールアドレス</Label>
                <Input type="email" id="email" placeholder="example@example.com" />
            </div>

            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="password">パスワード</Label>
                <Input type="password" id="password" placeholder="password" />
            </div>


            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="password">パスワード(確認用)</Label>
                <Input type="password" id="password" placeholder="password" />
            </div>

            <div className='flex justify-evenly'>
                <Button className='btn btn-light'>キャンセル</Button>
                <Button className='btn btn-primary'>アカウントを作成する</Button>
            </div>
        </>
    )
}

export default SignUp