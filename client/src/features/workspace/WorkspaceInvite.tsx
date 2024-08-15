import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const WorkspaceInvite = () => {
    return (
        <div className="container max-w-md">
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
                <span className="btn btn-light">キャンセル</span>
                <span className="btn btn-primary">招待する</span>
            </div>
        </div>
    )
}

export default WorkspaceInvite