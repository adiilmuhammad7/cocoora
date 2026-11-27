
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import SideBar from './SideBar'

const AdminDashboard = () => {

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async function () {
      const response = await axios.get('https://cocoora-api.onrender.com/users')
      return response.data
    }
  })

  const { data: products = [] } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async function () {
      const response = await axios.get('https://cocoora-api.onrender.com/products')
      return response.data
    }
  })

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async function () {
      const response = await axios.get('https://cocoora-api.onrender.com/orders')
      return response.data
    }
  })

  const totalUsers = users.length
  const totalProducts = products.length
  const totalOrders = orders.length

  const totalSales = orders.reduce(function (total, order) {
    if (order.status === 'Success') {
      return total + Number(order.total)
    }
    return total
  }, 0)

  const totalRevenue = orders.reduce(function (total, order) {
    return total + Number(order.total)
  }, 0)

  const recentOrders = [...orders]
    .sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    .slice(0, 5)

  const dashboardData = [
    {
      name: 'Products',
      count: totalProducts
    },
    {
      name: 'Users',
      count: totalUsers
    },
    {
      name: 'Orders',
      count: totalOrders
    }
  ]

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  }

  if (isError) {
    return (
      <p>Something Went Wrong</p>
    )
  }

  return (
    <div className="min-h-screen w-full pb-16 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">

      <SideBar />

      <div className='flex-1 bg-[#FFF8EC] p-4 sm:p-6 lg:p-8'>

        <h1 className='text-3xl font-bold text-green-900'>
          Dashboard Overview
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6'>

          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <h2 className='text-green-500 text-sm'>Total Products</h2>
            <p className='text-3xl font-bold text-green-900 mt-2'>
              {totalProducts}
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <h2 className='text-green-500 text-sm'>Total Users</h2>
            <p className='text-3xl font-bold text-green-900 mt-2'>
              {totalUsers}
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <h2 className='text-green-500 text-sm'>Total Orders</h2>
            <p className='text-3xl font-bold text-green-900 mt-2'>
              {totalOrders}
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <h2 className='text-green-500 text-sm'>Total Revenue</h2>
            <p className='text-3xl font-bold text-green-900 mt-2'>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

          <h2 className="text-xl font-bold text-green-900 mb-6">
            Recent Orders
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-green-700">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>

              <tbody>

                {recentOrders.map(function (order) {

                  return (
                    <tr key={order.id} className="border-b">

                      <td className="py-4">
                        {order.id}
                      </td>

                      <td className="py-4">
                        {order.customerName}
                      </td>

                      <td className="py-4 font-semibold">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {order.status}
                        </span>
                      </td>

                      <td className="py-4">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>

                    </tr>
                  )

                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard
