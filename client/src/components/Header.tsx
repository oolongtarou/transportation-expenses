import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button'
import axios from 'axios';
import { useAuth } from '@/lib/auth';
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { getWorkspaceById, getWorkspacesExcludingId } from '@/lib/user-workspace';

interface HeaderProps {
    isLoggedin: boolean;
}

const Header = (props: HeaderProps) => {
    const { currentWorkspace, myWorkspaces, setCurrentWorkspace } = useAuth();
    const { isLoggedin } = props;
    return (
        <div className='flex justify-between shadow sticky top-0 w-full bg-main h-14 z-50'>
            <div className='flex'>
                <h1 className='font-bold text-lg mx-5 leading-14'>交通費精算ツール</h1>
                {isLoggedin && myWorkspaces.length > 0
                    ?
                    <Popover>
                        <PopoverTrigger>
                            <ul className='flex items-center btn btn-link'>
                                <li>ワークスペース</li>
                                <li><img src='/icons/stat_minus.svg' /></li>
                            </ul>
                        </PopoverTrigger>
                        <PopoverContent align='start'>
                            <h3 className='mx-1'>現在のワークスペース</h3>
                            <ul className='text-left flex flex-col gap-3'>
                                <li className='btn my-3 h-14 leading-10' style={{ textAlign: 'left', cursor: 'auto' }}>
                                    {getWorkspaceById(myWorkspaces, currentWorkspace ?? 0)?.workspaceName}
                                </li>
                            </ul>
                            <Separator />
                            <h3 className='mx-1 my-3'>ワークスペース</h3>
                            <ul>
                                {getWorkspacesExcludingId(myWorkspaces, currentWorkspace ?? 0).map(workspace => (
                                    <li onClick={() => setCurrentWorkspace(workspace.workspaceId)}
                                        className='btn btn-link my-3 h-14 leading-10'
                                        style={{ textAlign: 'left' }}
                                    >
                                        {workspace.workspaceName}
                                    </li>
                                ))}
                            </ul>
                        </PopoverContent>
                    </Popover>
                    : <></>}

            </div>
            <nav className='leading-14'>
                {isLoggedin ? HeaderNavWhenLogin() : HeaderNavWhenLogout()}
            </nav>
        </div >
    )
}

export default Header

const HeaderNavWhenLogin = () => {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    async function logout() {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/account/logout`, { withCredentials: true });
            if (!res.data.loggedIn) {
                setIsLoggedIn(false);
                navigate('/');
            } else {
                console.error('ログアウトできませんでした。');
            }
        } catch (err) {
            console.error(err)
        }

    }

    return (
        <>
            <ul className='flex gap-3 mr-5 items-center'>
                <li>
                    <Button onClick={logout} className='btn btn-link'>ログアウト</Button>
                </li>
                <li>
                    <img src='/icons/notification.svg' className='btn-img btn-light' />
                </li>
                <li>
                    <img src='/icons/help.svg' className='btn-img btn-light' />
                </li>
                <li>
                    <Link to='/account/my-page'>
                        <img src='/icons/default_user_icon.svg' className='btn-img btn-link' />
                    </Link>
                </li>
            </ul>
        </>
    )
}

const HeaderNavWhenLogout = () => {
    return (
        <>
            <ul className='flex gap-3 mr-5'>
                <li><Link to='/account/login' className='btn btn-link'>ログイン</Link></li>
                <li><Link to='/account/signup' className='btn btn-sub'>サインアップ</Link></li>
            </ul>
        </>
    )
}