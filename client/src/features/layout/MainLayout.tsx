import { Outlet } from 'react-router-dom'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceNav from '../workspace/WorkspaceNav'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'
import { useState } from 'react'
import { ChevronRight, Menu } from 'lucide-react'

const MainLayout = () => {
    const { isLoggedin } = useAuth();
    const [isNavigationVisible, setIsNavigationVisible] = useState(false);

    return (
        <>
            <Header isLoggedin={isLoggedin} />
            {isNavigationVisible
                ? <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel minSize={10} maxSize={20}>
                        <WorkspaceNav onToggleNav={() => setIsNavigationVisible(!isNavigationVisible)} />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>
                        <Outlet />
                    </ResizablePanel>
                </ResizablePanelGroup>
                : <div className="w-full">
                    <div className="image-container">
                        <Menu className="image image1" />
                        <ChevronRight className="image image2 btn-link" onClick={() => setIsNavigationVisible(!isNavigationVisible)} />
                    </div>
                    <Outlet />
                </div>
            }
        </>
    )
}

export default MainLayout
