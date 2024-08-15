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
            <ResizablePanel minSize={10} maxSize={20}>
                <WorkspaceNav />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <Outlet />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default MainLayout
