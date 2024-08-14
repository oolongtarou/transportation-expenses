import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button'
import axios from 'axios';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
    isLoggedin: boolean;
}

const Header = (props: HeaderProps) => {
    const { isLoggedin } = props;
    return (
        <div className='flex justify-between shadow sticky top-0 w-full bg-main h-14 z-50'>
            <h1 className='font-bold text-lg mx-5 leading-14'>交通費精算ツール</h1>
            <nav className='leading-14'>
                {isLoggedin ? HeaderNavWhenLogin() : HeaderNavWhenLogout()}
            </nav>
        </div>
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