import { IoMdClose } from "react-icons/io";
import { useDeliveryApp } from "../hooks";

const ProfileDetails = ({ setOpenProfileDetails, openProfileDetails }) => {
    const { setBlurred } = useDeliveryApp()

    const handleClose = () => {
        setOpenProfileDetails(null)
        setBlurred(false)
    }

    return (
        <div className="profile-details-container">
            <div className="header">
                <h2>Profile Details</h2>
                <button onClick={handleClose}><IoMdClose /></button>
            </div>
            <hr />
            <div className="contents">
                <div>
                    <label htmlFor="name">Name: </label>
                    <span id="name">{openProfileDetails.name}</span>
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <span id="email">{openProfileDetails.email}</span>
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <span id="password">{openProfileDetails.password}</span>
                </div>
                <div>
                    <label htmlFor="address">Address: </label>
                    <span id="address">{openProfileDetails.address}</span>
                </div>
                <div>
                    <label htmlFor="adminType">Admin Type: </label>
                    <span id="adminType">{openProfileDetails.adminType}</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileDetails