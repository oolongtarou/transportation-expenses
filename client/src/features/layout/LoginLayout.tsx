import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
    return (
        <div className="flex items-center justify-center main-content">
            <div className="container max-w-xl">
                <Outlet />
            </div >
        </div >
    )
}

export default LoginLayout
