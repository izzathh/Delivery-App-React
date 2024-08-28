import { useEffect, useState } from "react"
import { useDeliveryApp } from "../../hooks"

import { IoIosExpand, IoMdClose } from "react-icons/io";
import { RiDeleteBinLine, RiSaveLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

const Orders = () => {
    const [editOrderStatus, setEditOrderStatus] = useState(null)
    const [orderDeliverySts, setOrderDeliverySts] = useState({ order: '', delivery: '' })

    const {
        orders,
        getAllOrders,
        deleteOrder,
        setOpenConfirmationDialog,
        setTitle,
        setMessage,
        setConfirmCallBack,
        setBlurred,
        setOpenOrderDetails,
        downloadTodaysOrders,
        updateOrderStatus
    } = useDeliveryApp()

    useEffect(() => {
        getAllOrders()
    }, [])

    const handleOrderDelete = async (id) => {
        setTitle('Confirm to delete !')
        setMessage('Are you sure to delete this order ?')
        setBlurred(true)
        setOpenConfirmationDialog(true)
        setConfirmCallBack(() => async () => {
            await deleteOrder(id)
            setOpenConfirmationDialog(false)
            setBlurred(false)
        });
    };

    const handleExpandOrder = (items) => {
        setOpenOrderDetails(items)
        setBlurred(true)
    }

    const handleStatusEdit = (order) => {
        setEditOrderStatus(order._id)
        setOrderDeliverySts({ order: order.orderStatus, delivery: order.deliveryStatus })
    }

    const handleStatusChange = (e) => {
        const { name, value } = e.target
        setOrderDeliverySts((prev) => ({ ...prev, [name]: value }))
    }

    const handleOrderStsUpdate = async (id) => {
        await updateOrderStatus
            (
                orderDeliverySts,
                id
            )
        setEditOrderStatus(null)
    }

    return (
        <>
            <div className="orders-container">
                <div>
                    <h2>Orders</h2>
                    <button onClick={downloadTodaysOrders}>
                        Download Today's orders
                    </button>
                </div>
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User</th>
                                <th>Order Status</th>
                                <th>Delivery Status</th>
                                <th>Grand Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.orderNumber}</td>
                                    <td>{order.userId}</td>
                                    {editOrderStatus === order._id &&
                                        <td>
                                            <select
                                                name="order"
                                                id="order"
                                                onChange={handleStatusChange}
                                                value={orderDeliverySts.order}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Payment Received">Payment Received</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Canceled">Canceled</option>
                                            </select>
                                        </td>
                                    }
                                    {editOrderStatus !== order._id &&
                                        <td>{order.orderStatus}</td>
                                    }
                                    {editOrderStatus === order._id &&
                                        <td>
                                            <select
                                                name="delivery"
                                                id="delivery"
                                                onChange={handleStatusChange}
                                                value={orderDeliverySts.delivery}
                                            >
                                                <option value="Order Confirmed">Order Confirmed</option>
                                                <option value="Order Processing">Order Processing</option>
                                                <option value="Dispatched">Dispatched</option>
                                                <option value="In Transit">In Transit</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Attempted Delivery">Attempted Delivery</option>
                                                <option value="Delayed">Delayed</option>
                                                <option value="Lost">Lost</option>
                                                <option value="Order Delivered">Order Delivered</option>
                                            </select>
                                        </td>
                                    }
                                    {editOrderStatus !== order._id &&
                                        <td>{order.deliveryStatus}</td>
                                    }
                                    <td>{order.grandTotal}</td>
                                    <td className="btn">
                                        {editOrderStatus === order._id &&
                                            <>
                                                <button
                                                    className="save"
                                                    title="Save"
                                                    onClick={() => handleOrderStsUpdate(order._id)}
                                                >
                                                    <RiSaveLine />
                                                </button>
                                                <button
                                                    title="Cancel"
                                                    onClick={() => setEditOrderStatus(null)}
                                                >
                                                    <IoMdClose />
                                                </button>
                                            </>
                                        }
                                        {editOrderStatus !== order._id &&
                                            <button
                                                title="Expand Details"
                                                onClick={() => handleExpandOrder(order.items)}
                                            >
                                                <IoIosExpand />
                                            </button>
                                        }
                                        {editOrderStatus !== order._id &&
                                            <button
                                                className="edit"
                                                title="Update Status"
                                                onClick={() => handleStatusEdit(order)}
                                            >
                                                <CiEdit />
                                            </button>
                                        }
                                        {editOrderStatus !== order._id &&
                                            <button
                                                title="Delete Order"
                                                onClick={() => handleOrderDelete(order._id)}
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Orders