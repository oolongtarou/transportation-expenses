import { Link } from 'react-router-dom';
import { Button } from './ui/button'
import { useAuth } from '@/App';

const Header = () => {
    const { isLoggedIn } = useAuth();
    return (
        <div className='flex justify-between shadow sticky top-0 w-full bg-main h-14'>
            <h1 className='font-bold text-lg mx-5 leading-14'>交通費精算ツール</h1>
            <nav className='leading-14'>
                {isLoggedIn ? HeaderNavWhenLogin() : HeaderNavWhenLogout()}
            </nav>
        </div>
    )
}

export default Header


const HeaderNavWhenLogin = () => {
    return (
        <>
            <ul className='flex gap-3 mr-5 items-center'>
                <li>
                    <Button className='btn btn-link'>ログアウト</Button>
                </li>
                <li>
                    {/* <Link to='/'> */}
                    <img src='/icons/notification.svg' className='btn-img btn-light' />
                    {/* </Link> */}
                </li>
                <li>
                    {/* <Link to='/'> */}
                    <img src='/icons/help.svg' className='btn-img btn-light' />
                    {/* </Link> */}
                </li>
                <li>
                    <Link to='/'>
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