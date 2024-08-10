import { Button } from './ui/button'

const Header = () => {
    return (
        <div className='flex justify-between shadow fixed top-0 w-full bg-main h-14'>
            <h1 className='font-bold text-lg mx-5 leading-14'>交通費精算ツール</h1>
            <nav className='leading-14'>
                <ul className='flex gap-3 mr-5'>
                    <li><Button className='btn btn-link'>ログイン</Button></li>
                    <li><Button className='btn btn-sub'>サインアップ</Button></li>
                </ul>
            </nav>
        </div>
    )
}

export default Header