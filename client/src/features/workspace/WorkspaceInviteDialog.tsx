import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WorkspaceInvite from "./WorkspaceInvite"


const WorkspaceInviteDialog = () => {
    return (
        <Dialog>
            <DialogTrigger className="text-right">
                <Button className="btn btn-primary">
                    <img src="/icons/add_person.svg" />
                    <span className="ml-2">ワークスペースに招待する</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl" aria-describedby="ワークスペースに招待するためのダイアログです">
                <DialogHeader>
                    <DialogTitle>
                    </DialogTitle>
                </DialogHeader>
                <WorkspaceInvite />
            </DialogContent>
        </Dialog>
    )
}

export default WorkspaceInviteDialog