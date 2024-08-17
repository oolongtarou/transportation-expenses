import { Outlet } from 'react-router-dom'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceNav from '../workspace/WorkspaceNav'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'

const MainLayout = () => {
    const { isLoggedin } = useAuth();
    return (
        <>
            <Header isLoggedin={isLoggedin} />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={10} maxSize={20}>
                    <WorkspaceNav />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <Outlet />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default MainLayout
