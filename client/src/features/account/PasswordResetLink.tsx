import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PasswordResetLink = () => {
    return (
        <>
            <h2 className="heading-2">パスワードを再設定する</h2>

            <p className="text-sm text-pale-blue mb-1">登録しているメールアドレスを入力してください。</p>
            <div className="grid w-full items-center gap-1.5 mb-5">
                <Input type="email" id="email" placeholder="メールアドレス" />
            </div>

            <Button className="btn btn-primary w-full">パスワード再設定用のリンクを送る</Button>
        </>
    )
}

export default PasswordResetLink