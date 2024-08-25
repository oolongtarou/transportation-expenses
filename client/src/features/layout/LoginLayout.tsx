import Header from '@/components/Header'
import { useAuth } from '@/lib/auth'
import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
    const { isLoggedin } = useAuth();
    return (
        <>
            <Header isLoggedin={isLoggedin} />
            <div className="flex items-center justify-center main-content">
                <div className="container max-w-2xl">
                    <Outlet />
                </div >
            </div >
        </>
    )
}

export default LoginLayout
