import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL
import { AppLoader } from "../components/loader"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [adminId, setAdminId] = useState('')
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`${baseUrl}/admin/check-auth`,
                    { withCredentials: true }
                )
                setAdminId(data.admin.id)
                setIsAuthenticated(data.authenticated);
            } catch (error) {
                console.error('error:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loading, setLoading, adminId }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useContext(AuthContext)
    if (loading) return <AppLoader />
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export { ProtectedRoutes, AuthProvider, AuthContext }