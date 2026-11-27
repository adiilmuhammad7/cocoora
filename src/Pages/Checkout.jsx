
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { clearCart } from '../Redux/cartSlice'

const Checkout = function () {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const queryClient = useQueryClient()

    // Get logged-in user
    const user = useSelector(function (state) {
        return state.auth.user
    })

    // Get cart products
    const cartProducts = useSelector(function (state) {
        return state.cart.cart
    })

    // Get Buy Now product
    const buyNowProduct = location.state?.buyNowProduct

    // Choose Buy Now product or cart products
    const products = buyNowProduct
        ? [{ ...buyNowProduct, quantity: buyNowProduct.quantity || 1 }]
        : cartProducts

    const [selectedAddressId, setSelectedAddressId] = useState('')
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        fullName: user.name,
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    })

    // Calculate total
    const grandTotal = products.reduce(function (total, product) {
        return total + product.price * product.quantity
    }, 0)

    // Fetch user addresses
    const addressQuery = useQuery({

        queryKey: ['userAddresses', user.id],

        queryFn: async function () {

            const response = await axios.get(
                `https://cocoora-api.onrender.com/users/${user.id}`
            )

            return response.data
        }
    })

    const userData = addressQuery.data
    const addresses = userData?.addresses || []

    // Select default address
    useEffect(function () {

        if (addresses.length > 0 && !selectedAddressId) {

            const defaultAddress = addresses.find(function (address) {
                return address.isDefault
            })

            setSelectedAddressId(
                defaultAddress ? defaultAddress.id : addresses[0].id
            )
        }

    }, [addresses, selectedAddressId])

    // Save address
    const addressMutation = useMutation({

        mutationFn: async function (addressData) {

            const response = await axios.put(
                `https://cocoora-api.onrender.com/users/${user.id}`,
                {
                    ...userData,
                    addresses: addressData.updatedAddresses
                }
            )

            return response.data
        },

        onSuccess: function (data, variables) {

            queryClient.invalidateQueries({
                queryKey: ['userAddresses', user.id]
            })

            setSelectedAddressId(variables.selectedAddressId)
            setShowForm(false)

            setFormData({
                fullName: user.name,
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                isDefault: false
            })
        }
    })

    // Handle form inputs
    const handleChange = function (e) {

        const { name, value, checked, type } = e.target

        setFormData(function (previousData) {

            return {
                ...previousData,
                [name]: type === 'checkbox' ? checked : value
            }
        })
    }

    // Submit new address
    const handleSubmit = function (e) {

        e.preventDefault()

        const newAddress = {
            ...formData,
            id: Date.now().toString()
        }

        let updatedAddresses

        if (formData.isDefault) {

            updatedAddresses = addresses.map(function (address) {

                return {
                    ...address,
                    isDefault: false
                }

            }).concat(newAddress)

        } else {

            updatedAddresses = addresses.concat(newAddress)
        }

        addressMutation.mutate({

            updatedAddresses: updatedAddresses,
            selectedAddressId: newAddress.id

        })
    }

    // Get selected address
    const selectedAddress = addresses.find(function (address) {
        return address.id === selectedAddressId
    })

    // Place order
    const orderMutation = useMutation({

        mutationFn: async function (orderData) {

            // Update product stock
            for (let i = 0; i < products.length; i++) {

                const product = products[i]

                const response = await axios.get(
                    `https://cocoora-api.onrender.com/products/${product.id}`
                )

                const newStock = response.data.stock - product.quantity

                if (newStock < 0) {

                    throw new Error(
                        'Not enough stock for ' + product.name
                    )
                }

                await axios.patch(
                    `https://cocoora-api.onrender.com/products/${product.id}`,
                    {
                        stock: newStock
                    }
                )
            }

            // Save order
            const response = await axios.post(
                'https://cocoora-api.onrender.com/orders',
                orderData
            )

            return response.data
        },

        // After successful order
        onSuccess: async function (data) {

            // Clear cart only for normal cart checkout
            if (!buyNowProduct) {

                try {

                    // Get user's cart from JSON Server
                    const cartResponse = await axios.get(
                        `https://cocoora-api.onrender.com/cart?userId=${user.id}`
                    )

                    const cartData = cartResponse.data[0]

                    // Empty database cart
                    if (cartData) {

                        await axios.patch(
                            `https://cocoora-api.onrender.com/cart/${cartData.id}`,
                            {
                                items: []
                            }
                        )
                    }

                    // Empty Redux cart
                    dispatch(clearCart())

                } catch (error) {

                    console.log('Cart clearing failed:', error)

                    alert(
                        'Order placed successfully, but cart could not be cleared.'
                    )
                }
            }

            // Refresh products
            queryClient.invalidateQueries({
                queryKey: ['products']
            })

            // Refresh orders
            queryClient.invalidateQueries({
                queryKey: ['myOrders', user.id]
            })

            // Navigate to success page
            navigate('/order-success', {
                state: {
                    order: data
                }
            })
        },

        onError: function (error) {

            alert(error.message || 'Failed to place order')
        }
    })

    // Handle Place Order button
    const handlePlaceOrder = function () {

        if (!selectedAddress) {

            alert('Please select a delivery address')
            return
        }

        if (products.length === 0) {

            alert('Your cart is empty')
            return
        }

        const orderData = {

            userId: user.id,
            customerName: user.name,
            email: user.email,
            products: products,
            deliveryAddress: selectedAddress,
            total: grandTotal,
            paymentMethod: 'Cash on Delivery',
            status: 'Pending',
            createdAt: new Date().toISOString()

        }

        orderMutation.mutate(orderData)
    }

    // Loading
    if (addressQuery.isLoading) {

        return (
            <p className="text-center py-20">
                Loading checkout...
            </p>
        )
    }

    // Error
    if (addressQuery.isError) {

        return (
            <p className="text-center py-20 text-red-500">
                Failed to load checkout details.
            </p>
        )
    }

    return (

        <section className="min-h-screen bg-[#FFF8EC] px-5 md:px-16 py-16">

            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-12">

                    <p className="text-[#A8C686] uppercase tracking-[4px] text-sm font-semibold">
                        Almost There
                    </p>

                    <h1 className="text-4xl font-bold text-[#245C43] mt-4">
                        Checkout
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Choose your delivery address and review your order.
                    </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Delivery Address */}
                    <div className="lg:col-span-2">

                        <div className="bg-white rounded-3xl p-7 shadow-sm">

                            <div className="flex justify-between items-center mb-7">

                                <h2 className="text-2xl font-bold text-[#245C43]">
                                    Delivery Address
                                </h2>

                                <button
                                    onClick={function () {

                                        setFormData({
                                            fullName: user.name,
                                            phone: '',
                                            address: '',
                                            city: '',
                                            state: '',
                                            pincode: '',
                                            isDefault: addresses.length === 0
                                        })

                                        setShowForm(true)
                                    }}
                                    className="text-[#245C43] font-semibold hover:text-[#A8C686]"
                                >
                                    + Add New
                                </button>

                            </div>

                            {/* Saved Addresses */}
                            <div className="space-y-4">

                                {addresses.map(function (address) {

                                    return (

                                        <label
                                            key={address.id}
                                            className={`block border rounded-2xl p-5 cursor-pointer transition ${
                                                selectedAddressId === address.id
                                                    ? 'border-[#245C43] bg-[#FFF8EC]'
                                                    : 'border-gray-200'
                                            }`}
                                        >

                                            <div className="flex gap-4">

                                                <input
                                                    type="radio"
                                                    name="deliveryAddress"
                                                    checked={
                                                        selectedAddressId === address.id
                                                    }
                                                    onChange={function () {
                                                        setSelectedAddressId(address.id)
                                                    }}
                                                    className="mt-1 accent-[#245C43]"
                                                />

                                                <div>

                                                    <div className="flex flex-wrap gap-3 items-center">

                                                        <h3 className="font-bold text-[#245C43]">
                                                            {address.fullName}
                                                        </h3>

                                                        {address.isDefault && (

                                                            <span className="text-xs bg-[#A8C686] text-[#245C43] px-3 py-1 rounded-full">
                                                                Default
                                                            </span>

                                                        )}

                                                    </div>

                                                    <p className="text-gray-600 mt-2">
                                                        {address.address}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        {address.city}, {address.state} - {address.pincode}
                                                    </p>

                                                    <p className="text-gray-600 mt-2">
                                                        Phone: {address.phone}
                                                    </p>

                                                </div>

                                            </div>

                                        </label>

                                    )
                                })}

                            </div>

                            {/* Add New Address Form */}
                            {showForm && (

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 border-t pt-7"
                                >

                                    <h3 className="text-xl font-bold text-[#245C43] mb-5">
                                        Add Delivery Address
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="border rounded-lg p-3"
                                        />

                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            type="tel"
                                            required
                                            className="border rounded-lg p-3"
                                        />

                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="House No, Street, Area"
                                            required
                                            className="border rounded-lg p-3 md:col-span-2"
                                        />

                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                            className="border rounded-lg p-3"
                                        />

                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            required
                                            className="border rounded-lg p-3"
                                        />

                                        <input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="PIN Code"
                                            required
                                            className="border rounded-lg p-3"
                                        />

                                    </div>

                                    <label className="flex gap-3 items-center mt-5 text-[#245C43]">

                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleChange}
                                        />

                                        Set as default address

                                    </label>

                                    <div className="flex gap-4 mt-6">

                                        <button
                                            type="submit"
                                            disabled={addressMutation.isPending}
                                            className="bg-[#245C43] text-white px-6 py-3 rounded-xl disabled:opacity-50"
                                        >
                                            {addressMutation.isPending
                                                ? 'Saving...'
                                                : 'Save Address'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={function () {
                                                setShowForm(false)
                                            }}
                                            className="border px-6 py-3 rounded-xl"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                    {addressMutation.isError && (

                                        <p className="text-red-500 mt-4">
                                            Failed to save address.
                                        </p>

                                    )}

                                </form>

                            )}

                        </div>

                    </div>

                    {/* Order Summary */}
                    <div>

                        <div className="bg-white rounded-3xl p-7 shadow-sm sticky top-10">

                            <h2 className="text-2xl font-bold text-[#245C43]">
                                Order Summary
                            </h2>

                            <div className="space-y-5 mt-7">

                                {products.map(function (product) {

                                    return (

                                        <div
                                            key={product.id}
                                            className="flex justify-between gap-4"
                                        >

                                            <div>

                                                <p className="font-semibold text-[#245C43]">
                                                    {product.name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Qty: {product.quantity}
                                                </p>

                                            </div>

                                            <p className="font-semibold text-[#245C43]">
                                                ₹{product.price * product.quantity}
                                            </p>

                                        </div>

                                    )
                                })}

                                {products.length === 0 && (

                                    <p className="text-gray-500">
                                        Your cart is empty.
                                    </p>

                                )}

                            </div>

                            <div className="border-t border-gray-200 my-6"></div>

                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{grandTotal}</span>
                            </div>

                            <div className="flex justify-between mt-4 text-gray-600">
                                <span>Delivery</span>

                                <span className="text-[#245C43] font-semibold">
                                    Free
                                </span>
                            </div>

                            <div className="border-t border-gray-200 my-6"></div>

                            <div className="flex justify-between items-center">

                                <span className="text-lg font-bold text-[#245C43]">
                                    Grand Total
                                </span>

                                <span className="text-2xl font-bold text-[#245C43]">
                                    ₹{grandTotal}
                                </span>

                            </div>

                            <div className="border-t border-gray-200 my-6"></div>

                            {/* Payment Method */}
                            <div>

                                <h3 className="text-lg font-bold text-[#245C43] mb-3">
                                    Payment Method
                                </h3>

                                <div className="flex items-center gap-3 border border-[#245C43] bg-[#FFF8EC] rounded-xl p-4">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked
                                        readOnly
                                        className="accent-[#245C43]"
                                    />

                                    <div>

                                        <p className="font-semibold text-[#245C43]">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={
                                    products.length === 0 ||
                                    orderMutation.isPending
                                }
                                className="w-full bg-[#245C43] text-white py-4 rounded-full mt-8 font-semibold hover:bg-[#1A4532] transition disabled:opacity-50"
                            >
                                {orderMutation.isPending
                                    ? 'Placing Order...'
                                    : 'Place Order'}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-5">
                                Freshness and goodness in every sip.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Back to Cart */}
                {!buyNowProduct && (

                    <Link
                        to="/cart"
                        className="inline-block text-[#245C43] font-semibold mt-10 hover:text-[#A8C686]"
                    >
                        ← Back to Cart
                    </Link>

                )}

            </div>

        </section>
    )
}

export default Checkout
