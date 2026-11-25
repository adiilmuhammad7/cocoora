import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccess = function () {
    const location = useLocation()
    const order = location.state && location.state.order

    const formatAddress = function (address) {
        if (!address) return 'Address not available'

        if (typeof address === 'string') {
            return address
        }

        return [
            address.name,
            address.phone,
            address.address,
            address.street,
            address.city,
            address.state,
            address.pincode,
            address.zip
        ].filter(Boolean).join(', ')
    }

    return (
        <div className="min-h-screen bg-[#FFF8EC] px-4 py-12">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
                        COCOORA
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Order Placed Successfully!
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Thank you for choosing COCOORA. Your order has been received.
                    </p>
                </div>

                {order ? (
                    <>
                        <div className="mt-8 rounded-xl border border-gray-200 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="mt-1 break-all font-semibold text-gray-900">
                                        {order.id || 'Order confirmed'}
                                    </p>
                                </div>

                                <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                                    {order.status || 'Pending'}
                                </span>
                            </div>

                            <div className="mt-5 border-t border-gray-200 pt-5">
                                <h2 className="font-bold text-gray-900">Order Summary</h2>

                                <div className="mt-4 space-y-4">
                                    {(order.products || []).map(function (product, index) {
                                        return (
                                            <div
                                                key={product.id || index}
                                                className="flex items-center justify-between gap-4"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {product.name || product.title || 'Product'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {product.quantity || 1}
                                                    </p>
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    ₹{(
                                                        Number(product.price || 0) *
                                                        Number(product.quantity || 1)
                                                    ).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-5 flex justify-between border-t border-gray-200 pt-4">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-[#FFF8EC] p-5">
                                <h2 className="font-bold text-gray-900">Delivery Address</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {formatAddress(order.deliveryAddress)}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#FFF8EC] p-5">
                                <h2 className="font-bold text-gray-900">Payment Method</h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    {order.paymentMethod || 'Cash on Delivery'}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="mt-8 rounded-xl bg-[#FFF8EC] p-5 text-center text-gray-600">
                        Your order was placed. Order details are not available on this page.
                    </p>
                )}

                <div className="mt-8 flex justify-center">
                    <Link
                        to="/shop"
                        className="rounded-lg bg-[#1F2937] px-8 py-3 font-semibold text-white transition hover:bg-black"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess
