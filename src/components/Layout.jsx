import { Link } from 'react-router-dom';
import { useDeliveryApp } from '../hooks';
import Confirm from "./Confirmation"
import OrderDetails from "./OrderDetails"
import { lazy, Suspense, useState } from 'react';
import { TbTruckDelivery } from "react-icons/tb";
import { AppLoader } from "./loader"

const Layout = ({ children }) => {
    const {
        openConfirmationDialog,
        title,
        message,
        confirmCallBack,
        blurred,
        openOrderDetails,
        setOpenOrderDetails,
        setOpenProfileDetails,
        openProfileDetails,
        handleLogout,
        isLoading,
    } = useDeliveryApp()
    const ProfileDetails = lazy(() => import('./ProfileDetails'))
    const [anchorHovered, setAanchorHovered] = useState(false)

    const handleMouseEnter = (e) => {
        setAanchorHovered(true)
        document.getElementById(e.target.name).style.color = '#fff'
    }

    const handleMouseLeave = (e) => {
        setAanchorHovered(false)
        document.getElementById(e.target.name).style.color = ''
    }

    return (
        <>
            <nav className={`navbar-container ${blurred ? 'blurred-elements' : ''}`}>
                <div>
                    <TbTruckDelivery />
                    <span>Delivery <br /> App</span>
                </div>
                <div>
                    <Link
                        id='orders'
                        name='orders'
                        className={`${anchorHovered ? 'active' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        to="/orders"
                    >
                        Orders
                    </Link>
                    <Link
                        id='products'
                        name='products'
                        className={`${anchorHovered ? 'active' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        to="/products"
                    >
                        Product
                    </Link>
                    <Link
                        id='store'
                        name='store'
                        className={`${anchorHovered ? 'active' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        to="/"
                    >
                        Store
                    </Link>
                    <Link
                        id='logout'
                        name='logout'
                        className={`${anchorHovered ? 'active' : ''}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleLogout}
                    >
                        Logout
                    </Link>
                </div>
            </nav>
            {openConfirmationDialog &&
                <Confirm
                    title={title}
                    message={message}
                    onConfirm={confirmCallBack}
                />
            }
            {isLoading && <AppLoader />}
            {openOrderDetails &&
                <OrderDetails
                    items={openOrderDetails}
                    setOpenOrderDetails={setOpenOrderDetails}
                />
            }
            {openProfileDetails &&
                <Suspense>
                    <ProfileDetails
                        setOpenProfileDetails={setOpenProfileDetails}
                        openProfileDetails={openProfileDetails}
                    />
                </Suspense>
            }
            <main className={`${blurred ? 'blurred-elements' : ''}`}>
                {children}
            </main>
        </>
    )
}

export default Layout