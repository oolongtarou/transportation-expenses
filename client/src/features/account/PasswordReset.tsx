import { Label } from "@/components/ui/label"
import PasswordRulesDescription from "./PasswordRulesDescription"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PasswordReset = () => {
    return (
        <>
            <h2 className="font-bold text-2xl text-center mb-5">パスワードを再設定する</h2>
            <PasswordRulesDescription />

            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="password">パスワード</Label>
                <Input type="password" id="password" placeholder="password" />
            </div>


            <div className="grid w-full items-center gap-1.5 mb-5">
                <Label htmlFor="password">パスワード(確認用)</Label>
                <Input type="password" id="password" placeholder="password" />
            </div>

            <Button className="btn btn-primary w-full">パスワードを変更する</Button>
        </>
    )
}

export default PasswordReset