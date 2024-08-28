import { ThreeDots } from 'react-loader-spinner'

export const AppLoader = () => {
    return (
        <div className='app-loader'>
            <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#ffffff87"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
} 