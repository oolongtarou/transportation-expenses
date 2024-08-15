import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WorkspaceInvite from "./WorkspaceInvite"
import { DialogDescription } from "@radix-ui/react-dialog"


const WorkspaceInviteDialog = () => {
    return (
        <Dialog>
            <DialogTrigger className="text-right">
                <div className="btn btn-primary flex">
                    <img src="/icons/add_person.svg" />
                    <span className="ml-2">ワークスペースに招待する</span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl" aria-describedby="ワークスペースに招待するためのダイアログです">
                <DialogHeader>
                    <DialogTitle className="heading-2 text-center">
                        ワークスペースに招待する
                    </DialogTitle>
                    <DialogDescription hidden>
                        ワークスペースに招待する画面です。
                    </DialogDescription>
                </DialogHeader>
                <WorkspaceInvite />
            </DialogContent>
        </Dialog>
    )
}

export default WorkspaceInviteDialog