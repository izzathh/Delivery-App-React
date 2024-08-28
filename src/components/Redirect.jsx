import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/Protected"
import { useContext } from "react"
import { AppLoader } from "./loader"

const Redirect = ({ children }) => {
    const { loading, isAuthenticated } = useContext(AuthContext)
    if (loading) return <AppLoader />
    return isAuthenticated ? <Navigate to={'/'} /> : children
}

export default Redirect