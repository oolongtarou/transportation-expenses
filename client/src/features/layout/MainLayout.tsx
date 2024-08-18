import { Outlet } from 'react-router-dom'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/components/ui/resizable"
import WorkspaceNav from '../workspace/WorkspaceNav'
import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'
import { useState } from 'react'
import { ChevronRight, Menu } from 'lucide-react'

const MainLayout = () => {
    const { isLoggedin } = useAuth();
    const [isNavigationVisible, setIsNavigationVisible] = useState(true);

    return (
        <>
            <Header isLoggedin={isLoggedin} />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={10} maxSize={20} hidden={!isNavigationVisible}>
                    <WorkspaceNav onToggleNav={() => setIsNavigationVisible(!isNavigationVisible)} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    {isNavigationVisible
                        ? <></>
                        : <>
                            <div className="image-container "
                                style={{ position: 'absolute', top: '3.5rem' }}
                            >
                                <Menu className="image image1" />
                                <ChevronRight className="image image2 btn-link" onClick={() => setIsNavigationVisible(!isNavigationVisible)} />
                            </div>
                        </>
                    }
                    <Outlet />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default MainLayout
