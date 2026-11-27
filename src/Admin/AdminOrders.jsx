
import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const AdminOrders = () => {

  const [activeFilter, setActiveFilter] = useState('All Orders')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ordersPerPage = 6

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async function () {
      const response = await axios.get('https://cocoora-api.onrender.com/orders')
      return response.data
    }
  })

  useEffect(function () {

    const timer = setTimeout(function () {
      setDebouncedSearch(search)
    }, 500)

    return function () {
      clearTimeout(timer)
    }

  }, [search])

  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: async function ({ orderId, status }) {
      const response = await axios.patch(
        `https://cocoora-api.onrender.com/orders/${orderId}`,
        { status: status }
      )

      return response.data
    },

    onSuccess: function () {
      queryClient.invalidateQueries({
        queryKey: ['adminOrders']
      })
    }
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Something went wrong</p>
  }

  // Statistics
  const totalOrders = orders.length

  const pendingOrders = orders.filter(function (order) {
    return order.status === 'Pending'
  }).length

  const deliveredOrders = orders.filter(function (order) {
    return order.status === 'Delivered'
  }).length

  const cancelledOrders = orders.filter(function (order) {
    return order.status === 'Cancelled'
  }).length

  // Search and status filter
  const filteredOrders = orders.filter(function (order) {

    const searchText = debouncedSearch.toLowerCase()

    const matchesSearch =
      String(order.id).toLowerCase().includes(searchText) ||
      (order.customerName || '').toLowerCase().includes(searchText) ||
      (order.email || '').toLowerCase().includes(searchText) ||
      (order.products || []).some(function (product) {
        return (product.name || '').toLowerCase().includes(searchText)
      })

    const matchesStatus =
      activeFilter === 'All Orders' ||
      (activeFilter === 'Pending' && order.status === 'Pending') ||
      (activeFilter === 'Completed' && order.status === 'Delivered')

    return matchesSearch && matchesStatus
  })

  // Pagination based on filtered orders
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const startIndex = (currentPage - 1) * ordersPerPage
  const endIndex = startIndex + ordersPerPage

  const currentOrder = filteredOrders.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen w-full pb-16 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">
      <SideBar />

      <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">

        <h1 className="text-2xl font-semibold">Order Management</h1>

        <p className="text-gray-600">
          Track and manage orders in real time
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full mt-6">

          <div className="bg-[#E5F1E6] rounded-xl p-6 shadow-sm min-h-36">
            <p className="text-sm font-medium text-[#245C43]">Total Orders</p>
            <h2 className="text-3xl font-bold text-[#245C43] mt-3">{totalOrders}</h2>
            <p className="text-xs text-gray-600 mt-2">All orders received</p>
          </div>

          <div className="bg-[#FFF1D9] rounded-xl p-6 shadow-sm min-h-36">
            <p className="text-sm font-medium text-[#94621C]">Completed Orders</p>
            <h2 className="text-3xl font-bold text-[#94621C] mt-3">{deliveredOrders}</h2>
            <p className="text-xs text-gray-600 mt-2">Successfully delivered</p>
          </div>

          <div className="bg-[#E5F0FA] rounded-xl p-6 shadow-sm min-h-36">
            <p className="text-sm font-medium text-[#285D8B]">Pending Orders</p>
            <h2 className="text-3xl font-bold text-[#285D8B] mt-3">{pendingOrders}</h2>
            <p className="text-xs text-gray-600 mt-2">Waiting for processing</p>
          </div>

          <div className="bg-[#FCE8E7] rounded-xl p-6 shadow-sm min-h-36">
            <p className="text-sm font-medium text-[#A33D37]">Cancelled Orders</p>
            <h2 className="text-3xl font-bold text-[#A33D37] mt-3">{cancelledOrders}</h2>
            <p className="text-xs text-gray-600 mt-2">Orders cancelled</p>
          </div>

        </div>

        {/* Orders List */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold text-[#245C43]">
            Orders List
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by order ID, customer, email or product name..."
            value={search}
            onChange={function (e) {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full mt-5 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245C43]"
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mt-6">

            <button
              onClick={function () {
                setActiveFilter('All Orders')
                setCurrentPage(1)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'All Orders'
                  ? 'bg-[#DDF4E9] text-[#16875A]'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              All Orders
            </button>

            <button
              onClick={function () {
                setActiveFilter('Pending')
                setCurrentPage(1)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'Pending'
                  ? 'bg-[#DDF4E9] text-[#16875A]'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>

            <button
              onClick={function () {
                setActiveFilter('Completed')
                setCurrentPage(1)
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'Completed'
                  ? 'bg-[#DDF4E9] text-[#16875A]'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>

          </div>

          {/* Orders Table */}
          <div className="mt-6 overflow-x-auto">

            {filteredOrders.length === 0 ? (

              <p className="text-center text-gray-500 py-8">
                No orders found.
              </p>

            ) : (

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {currentOrder.map(function (item) {

                    return (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* Product */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">

                            <img
                              src={item.products?.[0]?.images?.[0]}
                              alt={item.products?.[0]?.name || 'Product'}
                              className="w-14 h-14 rounded-lg object-cover"
                            />

                            <div>
                              <p className="font-medium text-[#245C43]">
                                {item.products?.[0]?.name || 'Product unavailable'}
                              </p>

                              <p className="text-sm text-gray-500">
                                Qty: {item.products?.reduce(function (total, product) {
                                  return total + Number(product.quantity || 0)
                                }, 0)}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <p className="font-medium text-gray-800">
                            {item.customerName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.email}
                          </p>
                        </td>

                        {/* Order ID */}
                        <td className="p-4 text-sm text-gray-600">
                          #{item.id}
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-medium">
                          ₹{item.total}
                        </td>

                        {/* Status */}
                        <td className="p-4">

                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : item.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.status}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="p-4">
                          <button
                            className="text-[#16875A] font-medium hover:underline"
                            onClick={function () {
                              setSelectedOrder(item)
                            }}
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    )

                  })}

                </tbody>

              </table>

            )}

          </div>

        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#245C43]">
                  Order Details
                </h2>

                <button
                  onClick={function () {
                    setSelectedOrder(null)
                  }}
                  className="text-gray-500 hover:text-red-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">

                <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>

                <div className="flex items-center gap-3">
                  <strong>Status:</strong>

                  <select
                    value={selectedOrder.status}
                    onChange={function (e) {
                      setSelectedOrder({
                        ...selectedOrder,
                        status: e.target.value
                      })
                    }}
                    className="border rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <hr />

                <h3 className="font-semibold text-[#245C43]">Products</h3>

                {selectedOrder.products?.map(function (product, index) {
                  return (
                    <div
                      key={`${product.id}-${index}`}
                      className="flex items-center gap-4 border-b py-3"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{product.price} × {product.quantity}
                        </p>
                      </div>
                    </div>
                  )
                })}

                <hr />

                <h3 className="font-semibold text-[#245C43]">
                  Delivery Address
                </h3>

                <p>{selectedOrder.deliveryAddress?.name}</p>
                <p>{selectedOrder.deliveryAddress?.phone}</p>
                <p>{selectedOrder.deliveryAddress?.address}</p>
                <p>
                  {selectedOrder.deliveryAddress?.city},
                  {' '}{selectedOrder.deliveryAddress?.state}
                  {' '}{selectedOrder.deliveryAddress?.pincode}
                </p>

                <hr />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.total}</span>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-5 border-t">

                  <button
                    onClick={function () {
                      setSelectedOrder(null)
                    }}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={function () {
                      updateStatusMutation.mutate({
                        orderId: selectedOrder.id,
                        status: selectedOrder.status
                      })
                      setSelectedOrder(null)
                    }}
                    disabled={updateStatusMutation.isPending}
                    className="px-5 py-2 rounded-lg bg-[#245C43] text-white hover:bg-[#1A4532] disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-5">

          <button
            onClick={function () {
              setCurrentPage(currentPage - 1)
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#245C43] text-white rounded-lg disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </p>

          <button
            onClick={function () {
              setCurrentPage(currentPage + 1)
            }}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-4 py-2 bg-[#245C43] text-white rounded-lg disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  )
}

export default AdminOrders
