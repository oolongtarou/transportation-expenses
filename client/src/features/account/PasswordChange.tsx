import { Label } from "@/components/ui/label"
import PasswordRulesDescription from "./PasswordRulesDescription"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PasswordChange = () => {
    return (
        <div className="container max-w-xl">
            <h2 className="heading-2">パスワードを変更する</h2>
            <PasswordRulesDescription />

            <div className="grid w-full items-center gap-1.5 mb-7">
                <Label htmlFor="password">現在のパスワード</Label>
                <Input type="password" id="password" placeholder="password" className="mt-2" />
            </div>

            <div className="grid w-full items-center gap-1.5 mb-7">
                <Label htmlFor="password">新しいパスワード</Label>
                <Input type="password" id="password" placeholder="password" className="mt-2" />
            </div>

            <div className="grid w-full items-center gap-1.5 mb-7">
                <Label htmlFor="password">新しいパスワード(確認用)</Label>
                <Input type="password" id="password" placeholder="password" className="mt-2" />
            </div>

            <div className="flex justify-evenly">
                <Button className="btn btn-light" >キャンセル</Button>
                <Button className="btn btn-primary">パスワードを変更する</Button>
            </div>
        </div>
    )
}

export default PasswordChange