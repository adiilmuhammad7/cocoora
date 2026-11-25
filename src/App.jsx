
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Routes from './Routes/AppRoutes'
import { setCart } from './Redux/cartSlice'
import { setWishlist } from './Redux/wishlistSlice'
import {  ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = function () {

    const dispatch = useDispatch()


    const user = useSelector(function (state) {
        return state.auth.user
    })

    // Load cart from database
    useEffect(function () {

        if (!user) {
            dispatch(setCart([]))
            return
        }

        axios.get(`http://localhost:3000/cart?userId=${user.id}`)
            .then(function (response) {
                dispatch(setCart(response.data[0]?.items || []))
            })
            .catch(function (error) {
                console.log(error)
            })

    }, [user, dispatch])

    // Load wishlist from database
    useEffect(function () {

        if (!user) {
            dispatch(setWishlist([]))
            return
        }

        axios.get(`http://localhost:3000/wishlist?userId=${user.id}`)
            .then(function (response) {
                dispatch(setWishlist(response.data[0]?.items || []))
            })
            .catch(function (error) {
                console.log(error)
            })

    }, [user, dispatch])



    




    return (
        <>
        <ToastContainer
    position="top-right"
    autoClose={2000}
/>
            <Routes />
        </>
    )
}

export default App
