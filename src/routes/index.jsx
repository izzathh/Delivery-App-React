import { Route, Routes } from 'react-router-dom'
import Layout from "../components/Layout"
import { ProtectedRoutes } from '../context/Protected'
import Redirect from "../components/Redirect"

import {
    StorePage,
    LoginPage,
    ProductPage,
    OrdersPage,
    AddNewStorePage,
    EditStorePage,
    AddNewProductPage
} from "../pages"

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path='/login'
                element={
                    <Redirect>
                        <LoginPage />
                    </Redirect>
                }
            />
            <Route element={<ProtectedRoutes />}>
                <Route
                    path='/'
                    element={
                        <Layout>
                            <StorePage />
                        </Layout>
                    }
                />
                <Route
                    path='/products'
                    element={
                        <Layout>
                            <ProductPage />
                        </Layout>
                    }
                />
                <Route
                    path='/orders'
                    element={
                        <Layout>
                            <OrdersPage />
                        </Layout>
                    }
                />
                <Route
                    path='/add-store'
                    element={
                        <Layout>
                            <AddNewStorePage />
                        </Layout>
                    }
                />
                <Route
                    path='/edit-store'
                    element={
                        <Layout>
                            <EditStorePage />
                        </Layout>
                    }
                />
                <Route
                    path='/add-product'
                    element={
                        <Layout>
                            <AddNewProductPage />
                        </Layout>
                    }
                />
            </Route>
        </Routes>
    )
}

export default AppRoutes