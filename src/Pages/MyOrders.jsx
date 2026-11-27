import React from 'react'
import { useSelector } from 'react-redux'
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

const MyOrders = function () {

    const user = useSelector(function (state) {
        return state.auth.user
    })

    const queryClient = useQueryClient()

    // Fetch orders
    const ordersQuery = useQuery({
        queryKey: ['myOrders', user.id],

        queryFn: async function () {
            const response = await axios.get(
                `https://cocoora-api.onrender.com/orders?userId=${user.id}`
            )

            return response.data
        }
    })

    // Delete order
    const deleteOrderMutation = useMutation({

        mutationFn: async function (orderId) {
            await axios.delete(
                `https://cocoora-api.onrender.com/orders/${orderId}`
            )
        },

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['myOrders', user.id]
            })
        },

        onError: function () {
            alert("Failed to delete order")
        }

    })

    if (ordersQuery.isLoading) {
        return (
            <p className="text-center py-20">
                Loading your orders...
            </p>
        )
    }

    if (ordersQuery.isError) {
        return (
            <p className="text-center py-20 text-red-500">
                Failed to load orders.
            </p>
        )
    }

    const orders = ordersQuery.data

    return (

        <section className="min-h-screen bg-[#FFF8EC] px-5 md:px-16 py-16">

            <div className="max-w-6xl mx-auto">

                {/* Heading */}

                <div className="text-center mb-12">

                    <p className="text-[#A8C686] uppercase tracking-[4px] text-sm font-semibold">
                        Your Purchases
                    </p>

                    <h1 className="text-4xl font-bold text-[#245C43] mt-4">
                        My Orders
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Track and manage your COCOORA orders.
                    </p>

                </div>

                {/* Empty Orders */}

                {orders.length === 0 && (

                    <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

                        <h2 className="text-2xl font-bold text-[#245C43]">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500 mt-3">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/shop"
                            className="inline-block bg-[#245C43] text-white px-8 py-3 rounded-full mt-6"
                        >
                            Explore Drinks
                        </Link>

                    </div>

                )}

                {/* Orders List */}

                <div className="space-y-8">

                    {orders.map(function (order) {

                        return (

                            <div
                                key={order.id}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
                            >

                                {/* Order Header */}

                                <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-5">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order ID
                                        </p>

                                        <p className="font-semibold text-[#245C43]">
                                            {order.id}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString('en-IN')}
                                        </p>

                                    </div>

                                    <div>

                                        <span className="text-sm text-gray-500">
                                            Order Status
                                        </span>

                                        <p className="bg-[#FFF8EC] text-[#245C43] px-4 py-2 rounded-full font-semibold mt-2 inline-block">
                                            {order.status}
                                        </p>

                                    </div>

                                </div>

                                {/* Products */}

                                <div className="space-y-5 mt-6">

                                    {order.products.map(function (product) {

                                        return (

                                            <div
                                                key={product.id}
                                                className="flex items-center gap-5"
                                            >

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded-xl"
                                                />

                                                <div className="flex-1">

                                                    <h3 className="font-bold text-[#245C43]">
                                                        {product.name}
                                                    </h3>

                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Quantity: {product.quantity}
                                                    </p>

                                                    <p className="text-[#245C43] font-semibold mt-1">
                                                        ₹{product.price * product.quantity}
                                                    </p>

                                                </div>

                                            </div>

                                        )

                                    })}

                                </div>

                                {/* Order Footer */}

                                <div className="border-t mt-6 pt-5 flex flex-col md:flex-row justify-between gap-4">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Payment Method
                                        </p>

                                        <p className="font-semibold text-[#245C43]">
                                            {order.paymentMethod}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="text-2xl font-bold text-[#245C43]">
                                            ₹{order.total}
                                        </p>

                                    </div>

                                </div>

                                {/* Delete Order */}

                                <button
                                    onClick={function () {

                                        const confirmDelete = window.confirm(
                                            "Are you sure you want to delete this order?"
                                        )

                                        if (confirmDelete) {
                                            deleteOrderMutation.mutate(order.id)
                                        }

                                    }}
                                    disabled={deleteOrderMutation.isPending}
                                    className="bg-red-500 text-white px-6 py-3 rounded-full mt-6 hover:bg-red-600 disabled:opacity-50"
                                >
                                    {deleteOrderMutation.isPending
                                        ? "Deleting..."
                                        : "Delete Order"}
                                </button>

                            </div>

                        )

                    })}

                </div>

                <div className="text-center mt-10">

                    <Link
                        to="/shop"
                        className="inline-block bg-[#245C43] text-white px-8 py-3 rounded-full hover:bg-[#1A4532] transition"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </section>
    )
}

export default MyOrders