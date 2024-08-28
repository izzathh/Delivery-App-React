import { TiTick } from "react-icons/ti";
import { IoTimeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit, CiUser } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useDeliveryApp } from "../../hooks";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Store = () => {
    const {
        stores,
        getAllStores,
        deleteStore,
        setConfirmCallBack,
        setTitle,
        setMessage,
        setOpenConfirmationDialog,
        setBlurred,
        setOpenProfileDetails,
        navigate
    } = useDeliveryApp();

    useEffect(() => {
        getAllStores()
    }, [])

    const handleStoreDelete = async (id) => {
        setTitle('Confirm to delete !')
        setMessage('Are you sure to delete this store ?')
        setBlurred(true)
        setOpenConfirmationDialog(true)
        setConfirmCallBack(() => async () => {
            await deleteStore(id)
            setOpenConfirmationDialog(false)
            setBlurred(false)
        })
    }

    const handleProfileOpen = (data) => {
        setBlurred(true)
        setOpenProfileDetails(data)
    }

    const handleEditStore = (data) => {
        sessionStorage.setItem('edit-id', data._id)
        navigate('/edit-store')
    }

    return (
        <div className="store-container">
            <div className="header">
                <h2>Stores</h2>
                <Link to="/add-store">Add Store</Link>
            </div>
            <div className="store-cards">
                {stores.map((store, index) => (
                    <div key={index} className="cards">
                        <div className="img-contents">
                            <div>
                                <img src={store.store.image} alt="Store Image" />
                            </div>
                            <div>
                                <strong>{store.store.name}</strong>
                                <span>{store.store.address}</span>
                                <span>{store.store.description}</span>
                                <span
                                    className={`${store.store.delivery ? 'delivery' : 'no-delivery'}`}
                                >
                                    {store.store.delivery ? <TiTick /> : <IoMdClose />}delivery
                                </span>
                                <span><IoTimeOutline /> {store.store.storeTimings}</span>
                            </div>
                        </div>
                        <div className="btns">
                            <button
                                onClick={() => handleProfileOpen(store.profile)}
                                title="View Profile"
                            >
                                <CiUser />
                            </button>
                            <button
                                title="Edit Store Details"
                                onClick={() => handleEditStore(store)}
                            >
                                <CiEdit />
                            </button>
                            <button
                                onClick={() => handleStoreDelete(store._id)}
                                title="Delete Store"
                            >
                                <RiDeleteBinLine />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Store