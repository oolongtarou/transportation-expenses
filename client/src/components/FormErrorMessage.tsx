import { FieldError } from "react-hook-form"

interface FormErrorMessageProps {
    error: FieldError | undefined
    className?: string
}

const FormErrorMessage = (props: FormErrorMessageProps) => {
    const { error, className } = props;
    return (
        <>
            {error && <p className={`text-red-500 ${className}`}>{error.message}</p>}
        </>
    )
}

export default FormErrorMessage