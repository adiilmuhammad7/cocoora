
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '../Redux/cartSlice'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const Cart = function () {

    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    const products = useSelector(function (state) {
        return state.cart.cart
    })

    const user = useSelector(function (state) {
        return state.auth.user
    })

    // Fetch cart from JSON Server
    const fetchCart = async function () {

        if (!user) return []

        const response = await axios.get(
            `https://cocoora-api.onrender.com/cart?userId=${user.id}`
        )

        return response.data[0]?.items || []
    }

    const {
        data: cartData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['cart', user?.id],
        queryFn: fetchCart,
        enabled: !!user
    })

    // Synchronize TanStack Query data with Redux
    useEffect(function () {

        if (!user) {
            dispatch(setCart([]))
            return
        }

        if (cartData !== undefined) {
            dispatch(setCart(cartData))
        }

    }, [cartData, user, dispatch])

    // Update cart mutation
    const cartMutation = useMutation({

        mutationFn: async function (updatedItems) {

            const response = await axios.get(
                `https://cocoora-api.onrender.com/cart?userId=${user.id}`
            )

            const cartRecord = response.data[0]

            if (cartRecord) {

                const updateResponse = await axios.patch(
                    `https://cocoora-api.onrender.com/cart/${cartRecord.id}`,
                    {
                        items: updatedItems
                    }
                )

                return updateResponse.data.items

            } else {

                const createResponse = await axios.post(
                    'https://cocoora-api.onrender.com/cart',
                    {
                        userId: user.id,
                        items: updatedItems
                    }
                )

                return createResponse.data.items

            }
        },

        onSuccess: function (updatedItems) {

            // Update Redux
            dispatch(setCart(updatedItems))

            // Refresh TanStack Query cache
            queryClient.invalidateQueries({
                queryKey: ['cart', user.id]
            })

        },

        onError: function (error) {
            console.error('CART UPDATE ERROR:', error)
        }

    })

    // Update cart
    const updateCart = function (updatedItems) {

        if (!user) return

        cartMutation.mutate(updatedItems)

    }

    // Increase quantity
    const increaseProduct = function (productId) {

        const updatedItems = products.map(function (product) {

            if (String(product.id) === String(productId)) {

                return {
                    ...product,
                    quantity: Number(product.quantity) + 1
                }

            }

            return product

        })

        updateCart(updatedItems)

    }

    // Decrease quantity
    const decreaseProduct = function (productId) {

        const updatedItems = products.map(function (product) {

            if (String(product.id) === String(productId)) {

                return {
                    ...product,
                    quantity: Math.max(1, Number(product.quantity) - 1)
                }

            }

            return product

        })

        updateCart(updatedItems)

    }

    // Remove product
    const removeProduct = function (productId) {

        const updatedItems = products.filter(function (product) {

            return String(product.id) !== String(productId)

        })

        updateCart(updatedItems)

    }

    // Calculate total items
    const totalItems = products.reduce(function (total, product) {
        return total + Number(product.quantity)
    }, 0)

    // Calculate grand total
    const grandTotal = products.reduce(function (total, product) {
        return total + product.price * product.quantity
    }, 0)

    if (!user) {
        return (
            <section className='min-h-screen bg-[#FFF8EC] flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-[#245C43]'>
                        Please login to view your cart
                    </h2>
                    <Link to='/login' className='inline-block mt-5 bg-[#245C43] text-white px-8 py-3 rounded-full'>
                        Login
                    </Link>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <div className='min-h-screen bg-[#FFF8EC] flex items-center justify-center'>
                <h1 className='text-2xl text-[#245C43] font-semibold'>
                    Loading Cart...
                </h1>
            </div>
        )
    }

    if (isError) {
        return (
            <div className='min-h-screen bg-[#FFF8EC] flex items-center justify-center'>
                <h1 className='text-2xl text-red-500'>
                    Something went wrong!
                </h1>
            </div>
        )
    }

    return (
        <section className='min-h-screen bg-[#FFF8EC] px-5 md:px-16 py-16'>

            {/* Heading */}
            <div className='text-center mb-14'>

                <p className='text-[#A8C686] uppercase tracking-[4px] text-sm font-semibold'>
                    Your Tropical Picks
                </p>

                <h1 className='text-4xl md:text-5xl font-bold text-[#245C43] mt-4'>
                    Your Shopping Cart
                </h1>

                <p className='text-gray-500 mt-4'>
                    A little tropical goodness, coming your way.
                </p>

            </div>

            {products.length === 0 ? (

                <div className='max-w-xl mx-auto text-center bg-white rounded-3xl p-12 shadow-sm'>

                    <div className='text-6xl mb-6'>🥥</div>

                    <h2 className='text-2xl font-bold text-[#245C43]'>
                        Your cart is empty
                    </h2>

                    <p className='text-gray-500 mt-4'>
                        Looks like you haven't added any tropical drinks yet.
                    </p>

                    <Link
                        to='/shop'
                        className='inline-block mt-8 bg-[#245C43] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1A4532] transition'
                    >
                        Explore Drinks
                    </Link>

                </div>

            ) : (

                <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>

                    {/* Cart Products */}
                    <div className='lg:col-span-2 flex flex-col gap-6'>

                        {products.map(function (product) {

                            return (

                                <div
                                    key={product.id}
                                    className='bg-white rounded-3xl p-5 md:p-7 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition'
                                >

                                    <div className='w-full sm:w-40 h-48 sm:h-40 shrink-0 bg-[#F5F0E5] rounded-2xl overflow-hidden'>

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className='w-full h-full object-cover'
                                        />

                                    </div>

                                    <div className='flex flex-col flex-1 justify-between'>

                                        <div>

                                            <h2 className='text-xl font-bold text-[#245C43]'>
                                                {product.name}
                                            </h2>

                                            <p className='text-gray-500 mt-2'>
                                                Price: ₹{product.price}
                                            </p>

                                            <p className='text-[#245C43] font-semibold mt-2'>
                                                Subtotal: ₹{product.price * product.quantity}
                                            </p>

                                        </div>

                                        <div className='flex flex-wrap items-center justify-between gap-4 mt-6'>

                                            <div className='flex items-center gap-4 border border-[#A8C686] rounded-full px-4 py-2'>

                                                <button
                                                    onClick={function () {
                                                        decreaseProduct(product.id)
                                                    }}
                                                    disabled={cartMutation.isPending}
                                                    className='text-[#245C43] text-xl font-semibold hover:text-[#A8C686] disabled:opacity-50'
                                                >
                                                    -
                                                </button>

                                                <span className='text-[#245C43] font-semibold min-w-5 text-center'>
                                                    {product.quantity}
                                                </span>

                                                <button
                                                    onClick={function () {
                                                        increaseProduct(product.id)
                                                    }}
                                                    disabled={cartMutation.isPending}
                                                    className='text-[#245C43] text-xl font-semibold hover:text-[#A8C686] disabled:opacity-50'
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <button
                                                onClick={function () {
                                                    removeProduct(product.id)
                                                }}
                                                disabled={cartMutation.isPending}
                                                className='text-red-500 text-sm font-semibold hover:text-red-700 transition disabled:opacity-50'
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )

                        })}

                        <Link
                            to='/shop'
                            className='text-[#245C43] font-semibold hover:text-[#A8C686] transition mt-3'
                        >
                            ← Continue Shopping
                        </Link>

                    </div>

                    {/* Order Summary */}
                    <div className='lg:col-span-1'>

                        <div className='bg-white rounded-3xl p-7 shadow-sm sticky top-10'>

                            <h2 className='text-2xl font-bold text-[#245C43]'>
                                Order Summary
                            </h2>

                            <div className='flex justify-between mt-8 text-gray-600'>
                                <span>Items</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className='flex justify-between mt-5 text-gray-600'>
                                <span>Subtotal</span>
                                <span>₹{grandTotal}</span>
                            </div>

                            <div className='flex justify-between mt-5 text-gray-600'>
                                <span>Delivery</span>
                                <span className='text-[#245C43] font-semibold'>Free</span>
                            </div>

                            <div className='border-t border-gray-200 my-6'></div>

                            <div className='flex justify-between items-center'>

                                <span className='text-lg font-bold text-[#245C43]'>
                                    Grand Total
                                </span>

                                <span className='text-2xl font-bold text-[#245C43]'>
                                    ₹{grandTotal}
                                </span>

                            </div>

                            <Link
                                to='/checkout'
                                className='block w-full text-center bg-[#245C43] text-white py-4 rounded-full mt-8 font-semibold hover:bg-[#1A4532] transition'
                            >
                                Proceed to Checkout
                            </Link>

                            <p className='text-xs text-gray-400 text-center mt-5'>
                                Freshness and goodness in every sip.
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </section>
    )
}

export default Cart
