import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';

interface MessageBoxProps {
    variant: 'default' | 'destructive' | 'success' | 'warn';
    message: string;
}

const MessageBox = (props: MessageBoxProps) => {
    const { variant, message } = props;
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            {isVisible && (
                <Alert variant={variant} className="mb-5">
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
                        {message}
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
};

export default MessageBox;
