import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';

// messages.json をインポート
import messages from '../../public/messages.json';

type MessageBoxVariant = 'default' | 'destructive' | 'success' | 'warn';

interface MessageBoxProps {
    messageCode: string | null;
}

const MessageBox = (props: MessageBoxProps) => {
    const { messageCode } = props;
    const [isVisible, setIsVisible] = useState(true);
    const variant = getVarintByCode(messageCode);
    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {messageCode && isVisible && (
                <Alert variant={variant} className="my-5">
                    <div className='flex items-center justify-between'>
                        <div className='flex'>
                            {variant === 'success' && <BadgeCheck className='h-4 w-4' />}
                            {variant === 'warn' && <AlertCircle className='h-4 w-4' />}
                            {variant === 'destructive' && <AlertCircle className='h-4 w-4' />}
                            <AlertTitle className='ml-3'>
                                {variant === 'success' && 'SUCCESS'}
                                {variant === 'warn' && 'WARN'}
                                {variant === 'destructive' && 'ERROR'}
                            </AlertTitle>
                        </div>
                        <Button onClick={handleClose} className='h-1 w-1'>
                            ×
                        </Button>
                    </div>
                    <AlertDescription className='ml-7'>
                        {getMessageByCode(messageCode)}
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
};

export default MessageBox;



// 読み込んだJSONファイルからメッセージをコードで取得する
const getMessageByCode = (code: string): string | undefined => {
    const messageObj = messages.find((msg) => msg.code === code);
    return messageObj ? messageObj.message : undefined;
}

function getVarintByCode(code: string | null): MessageBoxVariant {
    if (!code) {
        return 'default'
    }

    const codeUpperCase = code.toUpperCase();
    if (codeUpperCase.startsWith('S')) {
        return 'success'
    } else if (codeUpperCase.startsWith('E')) {
        return 'destructive'
    } else if (codeUpperCase.startsWith('W')) {
        return 'warn'
    } else {
        return 'default'
    }
}