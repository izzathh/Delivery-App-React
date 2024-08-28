import { useDeliveryApp } from "../hooks";
import { ProductContents } from "./products"
import { IoMdClose } from "react-icons/io";

const OrderDetails = ({ items, setOpenOrderDetails }) => {
    const { setBlurred } = useDeliveryApp()

    const handleClose = () => {
        setOpenOrderDetails(null)
        setBlurred(false)
    }

    return (
        <div className="order-details-container">
            <div className="header">
                <h2>Order Details</h2>
                <button onClick={handleClose}><IoMdClose /></button>
            </div>
            <div>
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="order-card">
                            <div>
                                <img src={item.image} alt="Product Image" />
                            </div>
                            <div className="">
                                <ProductContents
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                />
                            </div>
                        </div>
                        <br />
                    </div>
                ))}
            </div>
            <div className="footer">
                <span>Sub Total: 700</span>
                <span>Grand Total: 700</span>
            </div>
        </div>
    )
}

export default OrderDetails