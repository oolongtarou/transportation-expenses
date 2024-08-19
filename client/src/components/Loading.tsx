import { ThreeDots } from "react-loader-spinner"

const Loading = () => {
    return (
        <div className='h-[80px] w-[80px] m-auto'>
            <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#0067c0"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperClass=""
            />
        </div>
    )
}

export default Loading