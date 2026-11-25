import React from 'react'
import SideBar from './SideBar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminTrash = () => {
    const queryClient = useQueryClient()

    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: async function () {
            const response = await axios.get("http://localhost:3000/products")
            return response.data
        }
    })


    const trashedProducts = products.filter(function (item) {
        return item.deleted === true
    })

    // restore 


    const restoreMutation = useMutation({
        mutationFn: async function (id) {
            let response = await axios.patch(`http://localhost:3000/products/${id}`, {
                deleted: false
            })
            return response.data
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success('Product restored successfully!')
        }
    })


    const deleteMutation = useMutation({
        mutationFn: async function (id) {
            let response = await axios.delete(`http://localhost:3000/products/${id}`)
            return response.data
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success('Product permanently deleted!')
        }
    })



    return (
        <>
            <SideBar />
            <div className="ml-64 min-h-screen bg-[#FFF8EC] p-8">
                <h1 className="text-2xl font-bold text-[#245C43] mb-6">
                    Trash ({trashedProducts.length})
                </h1>

                {isLoading && <p>Loading products...</p>}

                {isError && <p>Something went wrong!</p>}

                {!isLoading && trashedProducts.length === 0 && (
                    <p className="text-gray-500">Your trash is empty.</p>
                )}

                {trashedProducts.map(function (item) {
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-lg mb-3">
                            <h2 className="font-semibold">{item.name}</h2>
                            <p>₹{item.price}</p>
                            <div className='flex gap-6'>
                                <button
                                    onClick={function () {
                                        restoreMutation.mutate(item.id)
                                    }}
                                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mt-3 hover:bg-green-200"
                                >
                                    Restore
                                </button>
                                <button 
                                className='bg-red-500 px-4 py-2 mt-3 text-white rounded-lg hover:bg-red-400'
                                onClick={function () {
                                    deleteMutation.mutate(item.id)
                                }}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AdminTrash