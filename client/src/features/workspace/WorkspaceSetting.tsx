import { Button } from "@/components/ui/button"
import WorkspaceInviteDialog from "./WorkspaceInviteDialog"


const WorkspaceSetting = () => {
    return (
        <div className="container max-w-6xl">
            <header className="flex justify-between items-center">
                <h2 className="heading-2">ワークスペース設定</h2>
                <WorkspaceInviteDialog />
            </header>
            <div className="flex flex-row justify-between">
                <div className="flex ">
                    <img src="/icons/default_workspace_icon.svg" className="w-32 h-32 btn-img btn-link" />
                    <div className="ml-3 pr-5 max-w-2xl">
                        <div className="flex flex-row items-center">
                            <h3 className="font-bold text-xl mr-5">Acme, Inc.</h3>
                            <img src="/icons/edit.svg" className="btn-img btn-link" />
                        </div>
                        <p className="text-pale-blue">Acme, Inc.は、革新的なソリューションを提供するグローバル企業で、効率的なチームコラボレーションを促進するワークスペースです。最先端のツールとリソースを駆使して、プロジェクト管理やコミュニケーションを円滑にサポートします。</p>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Button className="btn btn-danger">ワークスペースを削除する</Button>
            </div>
        </ div>
    )
}

export default WorkspaceSetting