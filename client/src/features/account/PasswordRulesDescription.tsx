
const PasswordRulesDescription = () => {
    return (
        <>
            <ul className='text-pale-blue text-sm mb-10'>
                <li>以下の条件を満たすパスワードを設定してください</li>
                <li>- 10文字以上50文字以内</li>
                <li>- 英大文字を含む</li>
                <li>- 英小文字を含む</li>
                <li>- 半角数字を含む</li>
                <li>- 次の記号を含む</li>
                <li>&emsp;!@#$%^&amp;*()_+-=[]{ }|;:,.&lt;&gt;?</li>
            </ul>
        </>
    )
}

export default PasswordRulesDescription