import { GoAlert } from "react-icons/go";
import { useDeliveryApp } from "../hooks";

const Confirm = ({ title, message, onConfirm }) => {
    const {
        setOpenConfirmationDialog,
        setBlurred
    } = useDeliveryApp()

    const handleConfirmClose = () => {
        setBlurred(false)
        setOpenConfirmationDialog(false)
    }

    const handleConfirmation = () => {
        onConfirm()
    }

    return (
        <div className="confirm-container">
            <div>
                <div>
                    <GoAlert />
                    <h2>{title}</h2>
                </div>
                <br />
                <span>{message}</span>
            </div>
            <div>
                <button onClick={handleConfirmClose}>No</button>
                <button onClick={handleConfirmation}>Yes</button>
            </div>
        </div>
    )
}

export default Confirm