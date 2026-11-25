import React from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'

// Customer components
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import Categories from '../Components/Categories'
import OurStory from '../Components/OurStory'
import Footer from '../Components/Footer'
import UserSessionCheck from '../Components/UserSessionCheck'

// Customer pages
import Shop from '../Pages/Shop'
import ProductDetails from '../Pages/ProductDetails'
import Cart from '../Pages/Cart'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import Profile from '../Pages/Profile'
import Checkout from '../Pages/Checkout'
import OrderSuccess from '../Pages/OrderSuccess'
import MyOrders from '../Pages/MyOrders'
import Wishlist from '../Pages/Wishlist'

// Protected routes
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import AdminProtectedRoute from '../ProtectedRoute/AdminProtectedRoute'

// Admin pages
import AdminDashboard from '../Admin/AdminDashboard'
import AdminProducts from '../Admin/AdminProducts'
import AdminUsers from '../Admin/AdminUsers'
import AdminOrders from '../Admin/AdminOrders'
import AdminTrash from '../Admin/AdminTrash'
import FeaturedDrinks from '../Components/FeaturedDrinks'


// Customer Layout
const CustomerLayout = function () {

    return (
        <>
            <UserSessionCheck />

            <Navbar />

            <Outlet />

            <Footer />
        </>
    )
}


// Main Routes
const AppRoutes = function () {

    return (
        <BrowserRouter>

            <Routes>

                {/* Customer Routes */}

                <Route element={<CustomerLayout />}>

                    <Route
                        path="/"
                        element={
                            <>
                                <Hero />
                                <Categories />
                                <FeaturedDrinks/>
                                <OurStory />
                            </>
                        }
                    />

                    <Route
                        path="/shop"
                        element={<Shop />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/order-success"
                        element={<OrderSuccess />}
                    />

                    <Route
                        path="/my-orders"
                        element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/our-story"
                        element={<OurStory />}
                    />

                    <Route
                        path="/contact"
                        element={<Footer />}
                    />

                </Route>


                {/* Admin Routes */}

                <Route element={<AdminProtectedRoute />}>

                    <Route
                        path="/adminDashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/adminProducts"
                        element={<AdminProducts />}
                    />

                    <Route
                        path="/adminUsers"
                        element={<AdminUsers />}
                    />

                    <Route
                        path="/adminOrders"
                        element={<AdminOrders />}
                    />

                    <Route
                        path="/adminTrash"
                        element={<AdminTrash />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes