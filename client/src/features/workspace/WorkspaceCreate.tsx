import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


const WorkspaceCreate = () => {
    return (
        <div className="container max-w-md">
            <h2 className="heading-2">ワークスペースを作成する</h2>

            <div>
                <div>
                    <Label htmlFor="workspaceName">ワークスペース名</Label>
                    <Badge variant="destructive" className="ml-1">必須</Badge>
                </div>
                <Input type="text" id="workspaceName" className="mt-2 mb-7" />
            </div>

            <div>
                <Label htmlFor="description">説明</Label>
                <Textarea id="description" className="mt-2 mb-7" />
            </div>

            <div className="flex justify-evenly">
                <Button className="btn btn-light">キャンセル</Button>
                <Button className="btn btn-primary">ワークスペースを作成する</Button>
            </div>
        </div>
    )
}

export default WorkspaceCreate