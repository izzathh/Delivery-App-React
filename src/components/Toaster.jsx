import { TiTick } from "react-icons/ti";
import { BiErrorAlt } from "react-icons/bi";

const Toaster = ({ type, message }) => {
    return (
        <div className={`toaster ${type}`}>
            {type === 'success' &&
                <TiTick />
            }
            {type === 'error' &&
                <BiErrorAlt />
            }
            <span>{message}</span>
        </div>
    )
}

export default Toaster