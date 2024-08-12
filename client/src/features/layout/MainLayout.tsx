import { Outlet } from 'react-router-dom'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceNav from '../workspace/WorkspaceNav'

const MainLayout = () => {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className='min-w-60 max-w-96'>
                <WorkspaceNav workspaceId={1} workspaceName='ワールドアメニティ' />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <Outlet />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default MainLayout
