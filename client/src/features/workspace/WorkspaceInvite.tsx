import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const WorkspaceInvite = () => {
    return (
        <div className="container max-w-md">
            <h2 className="font-bold text-2xl text-center mb-7">ワークスペースに招待する</h2>

            <div>
                <div>
                    <Label htmlFor="mailAddress">メールアドレス</Label>
                    <Badge variant="destructive" className="ml-1">必須</Badge>
                </div>
                <Input type="mail" id="mailAddress" className="mt-2 mb-7" placeholder="you@example.com" />
            </div>

            <div>
                <Label htmlFor="message">メッセージ</Label>
                <Textarea id="message" className="mt-2 mb-7" />
            </div>

            <div className="flex justify-evenly">
                <Button className="btn btn-light">キャンセル</Button>
                <Button className="btn btn-primary">招待する</Button>
            </div>
        </div>
    )
}

export default WorkspaceInvite