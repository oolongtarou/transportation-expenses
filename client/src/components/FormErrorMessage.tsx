import { FieldError } from "react-hook-form"

interface FormErrorMessageProps {
    error: FieldError | undefined
}

const FormErrorMessage = (props: FormErrorMessageProps) => {
    const { error } = props;
    return (
        <>
            {error && <p className='text-red-500'>{error.message}</p>}
        </>
    )
}

export default FormErrorMessage