import { Button } from './ui/button'

const Header = () => {
    const isLogin: boolean = true;
    return (
        <div className='flex justify-between shadow fixed top-0 w-full bg-main h-14'>
            <h1 className='font-bold text-lg mx-5 leading-14'>交通費精算ツール</h1>
            <nav className='leading-14'>
                {isLogin ? HeaderNavWhenLogin() : HeaderNavWhenLogout()}
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
                    <a href='#'>
                        <img src='./icons/notification.svg' className='btn-img btn-light' />
                    </a>
                </li>
                <li>
                    <a href='#'>
                        <img src='./icons/help.svg' className='btn-img btn-light' />
                    </a>
                </li>
                <li>
                    <a href='#'>
                        <img src='./icons/default_user_icon.svg' className='btn-img btn-link' alt='マイページ' />
                    </a>
                </li>
            </ul>
        </>
    )
}

const HeaderNavWhenLogout = () => {
    return (
        <>
            <ul className='flex gap-3 mr-5'>
                <li><Button className='btn btn-link'>ログイン</Button></li>
                <li><Button className='btn btn-sub'>サインアップ</Button></li>
            </ul>
        </>
    )
}