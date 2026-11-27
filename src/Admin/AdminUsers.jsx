
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import SideBar from './SideBar'

const AdminUsers = function () {

    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)

    const queryClient = useQueryClient()

    const usersPerPage = 5

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async function () {
            const response = await axios.get('https://cocoora-api.onrender.com/users')
            return response.data
        }
    })

    // Block / Unblock user
    const blockMutation = useMutation({
        mutationFn: async function (user) {
            const response = await axios.patch(
                `https://cocoora-api.onrender.com/users/${user.id}`,
                {
                    isBlocked: !user.isBlocked
                }
            )

            return response.data
        },

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['adminUsers']
            })
        }
    })

    // Delete user
    const deleteMutation = useMutation({
        mutationFn: async function (userId) {
            return await axios.delete(
                `https://cocoora-api.onrender.com/users/${userId}`
            )
        },

        onSuccess: function () {
            queryClient.invalidateQueries({
                queryKey: ['adminUsers']
            })

            setSelectedUser(null)
        }
    })

    // Search users
    const filteredUsers = users.filter(function (user) {

        const name = user.name || user.fullName || ''
        const email = user.email || ''

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        )
    })

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const startIndex = (currentPage - 1) * usersPerPage

    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    )

    // Handle search
    const handleSearch = function (value) {
        setSearch(value)
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen">
                <SideBar />
                <div className="flex flex-1 items-center justify-center">
                    Loading users...
                </div>
            </div>
        )
    }

    return (

        <div className="min-h-screen bg-[#FFF8EC]">

    <SideBar />

    <main className="min-h-screen w-full pb-20 p-4 md:p-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-8">

                {/* Header */}
                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-[#245C43]">
                        User Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your COCOORA customers
                    </p>

                </div>

                {/* Search */}
                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={function (e) {
                            handleSearch(e.target.value)
                        }}
                        className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#245C43]"
                    />

                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

                    <table className="w-full min-w-[700px] text-left">

                        <thead className="bg-[#245C43] text-white">

                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {currentUsers.length > 0 ? (

                                currentUsers.map(function (user) {

                                    return (

                                        <tr
                                            key={user.id}
                                            className={`border-b border-gray-100 ${
                                                user.isBlocked
                                                    ? 'bg-red-50'
                                                    : 'bg-white'
                                            }`}
                                        >

                                            <td className="p-4 font-medium text-gray-800">
                                                {user.name || user.fullName || 'N/A'}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {user.email || 'N/A'}
                                            </td>

                                            <td className="p-4 capitalize text-gray-600">
                                                {user.role || 'user'}
                                            </td>

                                            <td className="p-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        user.isBlocked
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                                >
                                                    {user.isBlocked
                                                        ? 'Blocked'
                                                        : 'Active'}
                                                </span>

                                            </td>

                                            <td className="space-x-2 p-4">

                                                {/* View */}
                                                <button
                                                    onClick={function () {
                                                        setSelectedUser(user)
                                                    }}
                                                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
                                                >
                                                    View
                                                </button>

                                                {/* Block / Unblock */}
                                                <button
                                                    onClick={function () {
                                                        blockMutation.mutate(user)
                                                    }}
                                                    className={`rounded-lg px-3 py-2 text-sm ${
                                                        user.isBlocked
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    }`}
                                                >
                                                    {user.isBlocked
                                                        ? 'Unblock'
                                                        : 'Block'}
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={function () {

                                                        const confirmDelete = window.confirm(
                                                            'Are you sure you want to delete this user?'
                                                        )

                                                        if (confirmDelete) {
                                                            deleteMutation.mutate(user.id)
                                                        }
                                                    }}
                                                    className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                })

                            ) : (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        No users found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
                {totalPages > 1 && (

                    <div className="mt-6 flex items-center justify-center gap-4">

                        <button
                            disabled={currentPage === 1}
                            onClick={function () {
                                setCurrentPage(currentPage - 1)
                            }}
                            className="rounded-lg bg-[#245C43] px-4 py-2 text-white disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={function () {
                                setCurrentPage(currentPage + 1)
                            }}
                            className="rounded-lg bg-[#245C43] px-4 py-2 text-white disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                )}

                {/* View User Modal */}
                {selectedUser && (

                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={function (e) {
                            if (e.target === e.currentTarget) {
                                setSelectedUser(null)
                            }
                        }}
                    >

                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                            {/* Modal Header */}
                            <div className="mb-6 flex items-center justify-between">

                                <h2 className="text-xl font-bold text-[#245C43]">
                                    Customer Details
                                </h2>

                                <button
                                    onClick={function () {
                                        setSelectedUser(null)
                                    }}
                                    className="text-2xl text-gray-500 hover:text-red-500"
                                >
                                    &times;
                                </button>

                            </div>

                            {/* Personal Information */}
                            <div className="rounded-xl bg-gray-50 p-5">

                                <h3 className="mb-4 font-semibold text-gray-800">
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium text-gray-800">
                                            {selectedUser.name || selectedUser.fullName || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="break-all font-medium text-gray-800">
                                            {selectedUser.email || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium capitalize text-gray-800">
                                            {selectedUser.role || 'user'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium text-gray-800">
                                            {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Address Details */}
                            <div className="mt-5">

                                <h3 className="mb-4 font-semibold text-[#245C43]">
                                    Saved Addresses
                                </h3>

                                {Array.isArray(selectedUser.addresses) &&
                                selectedUser.addresses.length > 0 ? (

                                    <div className="space-y-4">

                                        {selectedUser.addresses.map(function (address) {

                                            return (

                                                <div
                                                    key={address.id}
                                                    className="rounded-xl border border-gray-200 p-5"
                                                >

                                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                                        <h4 className="font-semibold text-gray-800">
                                                            Delivery Address
                                                        </h4>

                                                        {address.isDefault && (
                                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                                Default Address
                                                            </span>
                                                        )}

                                                    </div>

                                                    <div className="space-y-3">

                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Full Name
                                                            </p>
                                                            <p className="font-medium text-gray-800">
                                                                {address.fullName || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Phone
                                                            </p>
                                                            <p className="font-medium text-gray-800">
                                                                {address.phone || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Address
                                                            </p>
                                                            <p className="font-medium text-gray-800">
                                                                {address.address || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    City
                                                                </p>
                                                                <p className="font-medium text-gray-800">
                                                                    {address.city || 'N/A'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    State
                                                                </p>
                                                                <p className="font-medium text-gray-800">
                                                                    {address.state || 'N/A'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    Pincode
                                                                </p>
                                                                <p className="font-medium text-gray-800">
                                                                    {address.pincode || 'N/A'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-gray-500">
                                                                    Address ID
                                                                </p>
                                                                <p className="break-all font-medium text-gray-800">
                                                                    {address.id || 'N/A'}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        })}

                                    </div>

                                ) : (

                                    <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
                                        No saved addresses available
                                    </div>

                                )}

                            </div>

                            {/* Close */}
                            <div className="mt-6 flex justify-end">

                                <button
                                    onClick={function () {
                                        setSelectedUser(null)
                                    }}
                                    className="rounded-lg bg-[#245C43] px-6 py-2 text-white hover:bg-[#1A4532]"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>
    )
}

export default AdminUsers
