
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setWishlist } from '../Redux/wishlistSlice'
import { setCart } from '../Redux/cartSlice'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Wishlist = function () {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const wishlist = useSelector(function (state) {
        return state.wishlist.wishlist
    })

    const user = useSelector(function (state) {
        return state.auth.user
    })

    // Add wishlist product to cart
    const addWishlistToCart = function (product) {

        if (!user) return

        const cartProduct = {
            id: String(product.id),
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        }

        axios.get(`http://localhost:3000/cart?userId=${user.id}`)
            .then(function (response) {

                const cartData = response.data[0]

                if (cartData) {

                    const existingProduct = cartData.items.find(function (item) {
                        return String(item.id) === String(cartProduct.id)
                    })

                    let updatedItems

                    if (existingProduct) {

                        updatedItems = cartData.items.map(function (item) {

                            if (String(item.id) === String(cartProduct.id)) {
                                return {
                                    ...item,
                                    quantity: item.quantity + 1
                                }
                            }

                            return item
                        })

                    } else {
                        updatedItems = [...cartData.items, cartProduct]
                    }

                    return axios.patch(`http://localhost:3000/cart/${cartData.id}`, {
                        items: updatedItems
                    })

                } else {

                    return axios.post('http://localhost:3000/cart', {
                        userId: user.id,
                        items: [cartProduct]
                    })

                }

            })
            .then(function (response) {

                if (response) {
                    dispatch(setCart(response.data.items))
                    navigate('/cart')
                }

            })
            .catch(function (error) {
                console.error('ADD TO CART ERROR:', error)
            })
    }

    // Remove product from wishlist database
    const removeWishlistProduct = function (productId) {

        if (!user) return

        axios.get(`http://localhost:3000/wishlist?userId=${user.id}`)
            .then(function (response) {

                const wishlistData = response.data[0]

                if (!wishlistData) return

                const updatedItems = wishlistData.items.filter(function (item) {
                    return String(item.id) !== String(productId)
                })

                return axios.patch(`http://localhost:3000/wishlist/${wishlistData.id}`, {
                    items: updatedItems
                })

            })
            .then(function (response) {

                if (response) {
                    dispatch(setWishlist(response.data.items))
                }

            })
            .catch(function (error) {
                console.error('REMOVE WISHLIST ERROR:', error)
            })
    }

    return (
        <div className="min-h-screen bg-[#FFF8EC] px-10 py-16">

            <h1 className="text-4xl font-bold text-[#245C43] text-center mb-12">
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (

                <div className="text-center">
                    <h2 className="text-2xl text-[#245C43]">
                        Your Wishlist is Empty
                    </h2>

                    <Link
                        to="/shop"
                        className="inline-block mt-5 bg-[#245C43] text-white px-6 py-3 rounded-xl"
                    >
                        Explore Drinks
                    </Link>
                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {wishlist.map(function (product) {

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden"
                            >

                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-[300px] object-cover"
                                />

                                <div className="p-5">

                                    <h2 className="text-xl font-bold text-[#245C43]">
                                        {product.name}
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        {product.description}
                                    </p>

                                    <p className="text-lg font-semibold mt-3">
                                        ₹{product.price}
                                    </p>

                                    <div className="flex gap-3 mt-5">

                                        <button
                                            onClick={function () {
                                                addWishlistToCart(product)
                                            }}
                                            disabled={product.stock <= 0}
                                            className="bg-[#245C43] text-white px-4 py-3 rounded-full disabled:bg-gray-300"
                                        >
                                            {product.stock > 0
                                                ? 'Add To Cart'
                                                : 'Out of Stock'}
                                        </button>

                                        <button
                                            onClick={function () {
                                                removeWishlistProduct(product.id)
                                            }}
                                            className="bg-red-500 text-white px-4 py-3 rounded-full"
                                        >
                                            Remove ♥
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )
                    })}

                </div>

            )}

        </div>
    )
}

export default Wishlist
