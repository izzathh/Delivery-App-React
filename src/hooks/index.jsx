import { useContext, createContext, useState, useEffect } from "react";
const DeliveryAppContext = createContext();
import axiosIns from "../api"
import moment from "moment"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/Protected"

export const DeliveryAppProvider = ({ children }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stores, setStores] = useState([]);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
    const [blurred, setBlurred] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [confirmCallBack, setConfirmCallBack] = useState()
    const [launchToaster, setLaunchToaster] = useState(false)
    const [toastMsg, setToastMsg] = useState('')
    const [toastType, setToastType] = useState('')
    const [openOrderDetails, setOpenOrderDetails] = useState(null)
    const [openProfileDetails, setOpenProfileDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const toastIt = (type, message) => {
        setLaunchToaster(false);
        setTimeout(() => {
            setToastMsg(message);
            setToastType(type);
            setLaunchToaster(true);
        }, 0);
        setTimeout(() => {
            setLaunchToaster(false)
        }, 10000);
    }

    const loginAdmin = async (values) => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.post('/admin/login',
                {
                    username: values.userName,
                    password: values.password,
                    rememberMe: values.rememberMe
                }
            )
            if (data.status === 1) {
                return true
            }
            setIsLoading(false)
            return false
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                toastIt('error', error.response.data.message || error.response.data.error)
            }
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const getAllProducts = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.get('/product/fetch-all')
            if (data.status === 1) setProducts(data.products)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    const addNewProduct = async (values) => {
        try {
            setIsLoading(false)
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('price', values.price)
            formData.append('description', values.description)
            formData.append('image', values.image)

            const { data } = await axiosIns.post('/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.status === 1) {
                toastIt('success', data.message)
                navigate('/products')
                return
            }
            toastIt('error', data.message)
            return
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const updateProductDetails = async (id, newDetails) => {
        try {
            setIsLoading(true)
            const formdata = new FormData()
            formdata.append('id', id)
            formdata.append('name', newDetails.name)
            formdata.append('description', newDetails.description)
            formdata.append('price', newDetails.price)
            if (newDetails.image && typeof newDetails.image !== "string") {
                formdata.append('image', newDetails.image)
            }
            const { data } = await axiosIns.post('/product/update', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if (data.status === 1) {
                setProducts((prev) =>
                    prev.map(prod => {
                        if (prod._id === id) {
                            return {
                                ...prod,
                                ...data.updated
                            }
                        } else {
                            return prod
                        }
                    })
                )
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProduct = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.delete('/product/delete/' + id)
            if (data.status === 1) {
                setProducts((prev) =>
                    prev.filter(prod => prod._id !== id)
                )
                toastIt('success', data.message)
            } else {
                toastIt('error', data.message)
            }
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const getAllOrders = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.get('/order/fetch-all')
            if (data.status === 1) setOrders(data.orders)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    const deleteOrder = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.delete('/order/delete/' + id)
            if (data.status === 1) {
                setOrders((prev) =>
                    prev.filter(order => order._id !== id)
                )
                toastIt('success', data.message)
            } else {
                toastIt('error', data.message)
            }
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const downloadTodaysOrders = async () => {
        try {
            setIsLoading(true)
            const start = moment().startOf('day').format('DD/MM/YYYY HH:mm:ss')
            const end = moment().endOf('day').format('DD/MM/YYYY HH:mm:ss')
            const todayOrders = orders.filter(o => o.orderedAt >= start && o.orderedAt <= end)
            if (todayOrders.length === 0) {
                toastIt('error', 'There is no orders today')
                return
            }
            const { data } = await axiosIns.get('/order/download-pdf', {
                responseType: 'blob',
            });

            const pdf = new Blob([data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(pdf)

            const a = document.createElement('a')
            a.href = url
            const today = moment().format('DD/MM/YYYY')
            a.setAttribute('download', `${today}.pdf`)

            document.body.appendChild(a)
            a.click()

            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const updateOrderStatus = async (status, id) => {
        try {
            setIsLoading(true)
            const values = {
                ...status,
                id
            }
            const { data } = await axiosIns.post('/order/update-status', values)
            if (data.status === 1) {
                toastIt('success', data.message)
                setOrders((prev) =>
                    prev.map(order => {
                        if (order._id === id) {
                            return {
                                ...order,
                                ...data.updated
                            }
                        } else {
                            return order
                        }
                    })
                )
            } else {
                toastIt('error', data.message)
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const getAllStores = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.get('/store/fetch-all')
            if (data.status === 1) {
                setStores(data.stores)
                return data.stores
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    const addNewStore = async (values) => {
        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('profileAddress', values.profileAddress)
            formData.append('adminType', values.adminType)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('profileName', values.username)
            formData.append('contact', values.contact)
            formData.append('description', values.description)
            formData.append('image', values.image)
            formData.append('storeName', values.name)
            formData.append('storeAddress', values.storeAddress)
            formData.append('createdAdminId', "666932f6aa5bdd23bec6c7f7")

            const { data } = await axiosIns.post('/store/add', formData, {
                'Content-Type': 'multipart/formdata'
            })
            if (data.status === 1) {
                toastIt('success', data.message)
                navigate('/')
                return
            }
            toastIt('error', data.message)
            return
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const deleteStore = async (id) => {
        try {
            setIsLoading(true)
            const { data } = await axiosIns.delete('/store/delete/' + id)
            if (data.status === 1) {
                setStores((prev) =>
                    prev.filter(store => store._id !== id)
                )
                toastIt('success', data.message)
                return
            }
            toastIt('error', data.message)
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const updateStore = async (values, id) => {
        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('id', id)
            formData.append('profileAddress', values.profileAddress)
            formData.append('adminType', values.adminType)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('profileName', values.username)
            formData.append('contact', values.contact)
            formData.append('description', values.description)
            formData.append('storeName', values.name)
            formData.append('storeAddress', values.storeAddress)
            formData.append('image', values.image)

            const { data } = await axiosIns.post('/store/update', formData, {
                'Content-Type': 'multipart/formdata'
            })
            if (data.status === 1) {
                toastIt('success', data.message)
                navigate('/')
                return
            }
            toastIt('error', data.message)
            return
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data)
                toastIt('error', error.response.data.message || error.response.data.error)
            else
                toastIt('error', 'Something Went Wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        setBlurred(true)
        setOpenConfirmationDialog(true)
        setTitle('Confirm to proceed !')
        setMessage('Are you certain that you want to log out now ?')
        setConfirmCallBack(() => async () => {
            await axiosIns.post('/admin/logout')
            setBlurred(false)
            setOpenConfirmationDialog(false)
            setTitle('')
            setMessage('')
            window.location.href = '/login'
        })
    }

    return (
        <DeliveryAppContext.Provider
            value={{
                products,
                setProducts,
                orders,
                setOrders,
                getAllProducts,
                updateProductDetails,
                loginAdmin,
                deleteProduct,
                getAllOrders,
                deleteOrder,
                openConfirmationDialog,
                setOpenConfirmationDialog,
                setTitle,
                setMessage,
                title,
                message,
                setConfirmCallBack,
                confirmCallBack,
                launchToaster,
                setLaunchToaster,
                toastMsg,
                setToastMsg,
                toastType,
                setToastType,
                blurred,
                setBlurred,
                openOrderDetails,
                setOpenOrderDetails,
                downloadTodaysOrders,
                updateOrderStatus,
                stores,
                setStores,
                getAllStores,
                toastIt,
                addNewStore,
                navigate,
                deleteStore,
                openProfileDetails,
                setOpenProfileDetails,
                updateStore,
                addNewProduct,
                handleLogout,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </DeliveryAppContext.Provider>
    )
}

export const useDeliveryApp = () => {
    const context = useContext(DeliveryAppContext)
    if (!context)
        throw new Error('Delivery app context should be used within the delivery app provider')
    return context
}