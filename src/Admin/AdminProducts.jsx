
import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminProducts = function () {

    const queryClient = useQueryClient()

    const emptyProduct = {
        name: '',
        category: '',
        price: '',
        stock: '',
        images: ['', '', ''],
        description: ''
    }

    const [showForm, setShowForm] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [product, setProduct] = useState(emptyProduct)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [currentPage, setCurrentPage] = useState(1)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [editId, setEditId] = useState(null)
    const [errors, setErrors] = useState({})

    const itemsPerPage = 6

    // Debounced Search
    useEffect(function () {
        const timer = setTimeout(function () {
            setDebouncedSearch(search)
        }, 500)

        return function () {
            clearTimeout(timer)
        }
    }, [search])

    // Fetch Products
    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: async function () {
            const response = await axios.get('http://localhost:3000/products')
            return response.data
        }
    })

    // Active Products
    const activeProducts = products.filter(function (item) {
        return item.deleted !== true
    })

    // Add Product
    const addProductMutation = useMutation({
        mutationFn: async function (newProduct) {
            const response = await axios.post(
                'http://localhost:3000/products',
                newProduct
            )
            return response.data
        },
        onSuccess: function () {
            toast.success('Product added successfully')
            setProduct(emptyProduct)
            setErrors({})
            setShowForm(false)
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    // Update Product
    const updateMutation = useMutation({
        mutationFn: async function (updatedProduct) {
            const response = await axios.patch(
                `http://localhost:3000/products/${editId}`,
                updatedProduct
            )
            return response.data
        },
        onSuccess: function () {
            toast.success('Product updated successfully')
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setEditId(null)
            setProduct(emptyProduct)
            setErrors({})
            setShowForm(false)
        }
    })

    // Permanent Delete
    const deleteMutation = useMutation({
        mutationFn: async function (id) {
            const response = await axios.delete(
                `http://localhost:3000/products/${id}`
            )
            return response.data
        },
        onSuccess: function () {
            toast.success('Product deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    // Move to Trash
    const moveToTrashMutation = useMutation({
        mutationFn: async function (id) {
            const response = await axios.patch(
                `http://localhost:3000/products/${id}`,
                { deleted: true }
            )
            return response.data
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success('Product moved to trash')
        }
    })

    // Product Validation
    function validateProduct() {
        const newErrors = {}

        if (!product.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!product.category.trim()) {
            newErrors.category = 'Category is required'
        }

        if (
            product.price === '' ||
            !Number.isFinite(Number(product.price)) ||
            Number(product.price) <= 0
        ) {
            newErrors.price = 'Enter a valid price greater than 0'
        }

        if (
            product.stock === '' ||
            !Number.isInteger(Number(product.stock)) ||
            Number(product.stock) < 0
        ) {
            newErrors.stock = 'Enter a valid stock quantity'
        }

        if (!product.images.some(function (image) {
            return image.trim() !== ''
        })) {
            newErrors.images = 'At least one product image is required'
        }

        if (!product.description.trim()) {
            newErrors.description = 'Description is required'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    // Handle Input Changes
    function handleProductChange(field, value) {
        setProduct({
            ...product,
            [field]: value
        })

        setErrors({
            ...errors,
            [field]: ''
        })
    }

    // Edit Product
    function handleEdit(productItem) {
        setEditId(productItem.id)

        setProduct({
            name: productItem.name || '',
            category: productItem.category || '',
            price: productItem.price ?? '',
            stock: productItem.stock ?? '',
            images: productItem.images || ['', '', ''],
            description: productItem.description || ''
        })

        setErrors({})
        setShowForm(true)
    }

    // Filter Products
    const filteredProducts = activeProducts.filter(function (item) {
        const searchMatch = item.name.toLowerCase().includes(
            debouncedSearch.toLowerCase()
        )

        const categoryMatch =
            selectedCategory === 'All Categories' ||
            item.category === selectedCategory

        return searchMatch && categoryMatch
    })

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Categories
    const categories = [
        'All Categories',
        ...new Set(activeProducts.map(function (item) {
            return item.category
        }).filter(Boolean))
    ]

    // Save Product
    function handleSaveProduct() {

        const isValid = validateProduct()

        if (!isValid) {
            return
        }

        const productData = {
            ...product,
            price: Number(product.price),
            stock: Number(product.stock)
        }

        if (editId !== null) {
            updateMutation.mutate(productData)
        } else {
            addProductMutation.mutate(productData)
        }
    }

    if (isLoading) return <p className="p-8">Loading products...</p>
    if (isError) return <p className="p-8">Something went wrong</p>

    return (
        <div className="min-h-screen w-full pb-16 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">

            <SideBar />

            <div className="flex-1 min-w-0 p-5 md:p-8">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-green-700 font-semibold">
                            Inventory Hub / Catalog Master
                        </p>

                        <h1 className="text-3xl font-bold text-[#245C43] mt-2">
                            Product Catalog & Inventory
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage, update and track your coconut drinks.
                        </p>
                    </div>

                    <button
                        onClick={function () {
                            setEditId(null)
                            setProduct(emptyProduct)
                            setErrors({})
                            setShowForm(true)
                        }}
                        className="bg-[#245C43] text-white px-5 py-3 rounded-lg hover:bg-[#1A4532] transition"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#eee9dc]">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                            Total Products
                        </p>

                        <h2 className="text-3xl font-bold text-[#245C43] mt-2">
                            {activeProducts.length}
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Products in catalog
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#eee9dc]">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                            In Stock
                        </p>

                        <h2 className="text-3xl font-bold text-green-700 mt-2">
                            {activeProducts.filter(function (item) {
                                return Number(item.stock) > 0
                            }).length}
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Products available
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#eee9dc]">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                            Low Stock Alerts
                        </p>

                        <h2 className="text-3xl font-bold text-orange-600 mt-2">
                            {activeProducts.filter(function (item) {
                                return Number(item.stock) > 0 &&
                                    Number(item.stock) <= 5
                            }).length}
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Products need attention
                        </p>
                    </div>

                </div>

                {/* Add / Edit Product Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#eee9dc] mb-8">

                        <h2 className="text-xl font-bold text-[#245C43] mb-5">
                            {editId !== null ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Product Name */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={product.name}
                                    onChange={function (e) {
                                        handleProductChange('name', e.target.value)
                                    }}
                                    className="border p-3 rounded-lg w-full"
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={product.category}
                                    onChange={function (e) {
                                        handleProductChange('category', e.target.value)
                                    }}
                                    className="border p-3 rounded-lg w-full"
                                />

                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={product.price}
                                    min="0"
                                    onChange={function (e) {
                                        handleProductChange('price', e.target.value)
                                    }}
                                    className="border p-3 rounded-lg w-full"
                                />

                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={product.stock}
                                    min="0"
                                    step="1"
                                    onChange={function (e) {
                                        handleProductChange('stock', e.target.value)
                                    }}
                                    className="border p-3 rounded-lg w-full"
                                />

                                {errors.stock && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Product Images */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">
                                Product Images
                            </h3>

                            {product.images.map(function (image, index) {
                                return (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Image ${index + 1} URL`}
                                        value={image}
                                        onChange={function (e) {
                                            const updatedImages = [...product.images]
                                            updatedImages[index] = e.target.value

                                            setProduct({
                                                ...product,
                                                images: updatedImages
                                            })

                                            setErrors({
                                                ...errors,
                                                images: ''
                                            })
                                        }}
                                        className="border p-3 rounded-lg w-full mb-3"
                                    />
                                )
                            })}

                            {errors.images && (
                                <p className="text-red-500 text-sm">
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-2">
                            <textarea
                                placeholder="Product Description"
                                value={product.description}
                                onChange={function (e) {
                                    handleProductChange('description', e.target.value)
                                }}
                                className="border p-3 rounded-lg w-full"
                                rows="4"
                            />

                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={handleSaveProduct}
                                disabled={
                                    addProductMutation.isPending ||
                                    updateMutation.isPending
                                }
                                className="bg-[#245C43] text-white px-6 py-2 rounded-lg disabled:opacity-50"
                            >
                                {updateMutation.isPending
                                    ? 'Updating...'
                                    : addProductMutation.isPending
                                        ? 'Saving...'
                                        : editId !== null
                                            ? 'Update Product'
                                            : 'Save Product'}
                            </button>

                            <button
                                onClick={function () {
                                    setShowForm(false)
                                    setEditId(null)
                                    setProduct(emptyProduct)
                                    setErrors({})
                                }}
                                className="bg-gray-200 px-6 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                )}

                {/* Product Search and Filter */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-5 flex flex-col md:flex-row gap-4 justify-between">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={function (e) {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="border bg-[#FFF8EC] px-4 py-3 rounded-lg w-full md:w-2/3 outline-none focus:border-[#245C43]"
                    />

                    <select
                        value={selectedCategory}
                        onChange={function (e) {
                            setSelectedCategory(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="border bg-[#FFF8EC] px-4 py-3 rounded-lg"
                    >
                        {categories.map(function (category) {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            )
                        })}
                    </select>

                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-[#EAE8DE] text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                currentProducts.map(function (item) {
                                    return (
                                        <tr key={item.id} className="border-b hover:bg-[#FFF8EC]">

                                            <td className="p-4">
                                                <div className="flex items-center gap-3 min-w-48">
                                                    <img
                                                        src={item.images?.[0] || item.image || ''}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {item.name}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            COCOORA PRODUCT
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-sm">
                                                {item.category}
                                            </td>

                                            <td className="p-4 font-semibold">
                                                ₹{item.price}
                                            </td>

                                            <td className="p-4">
                                                {Number(item.stock) > 0 ? (
                                                    <span className="text-green-700 text-sm font-medium">
                                                        ● {item.stock} in stock
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 text-sm font-medium">
                                                        ● Out of stock
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-6">

                                                    <button
                                                        onClick={function () {
                                                            setSelectedProduct(item)
                                                        }}
                                                        className="bg-[#F0EFE8] text-[#245C43] px-4 py-2 rounded-lg text-sm hover:bg-[#DDE8D9] transition"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        onClick={function () {
                                                            handleEdit(item)
                                                        }}
                                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={function () {
                                                            moveToTrashMutation.mutate(item.id)
                                                        }}
                                                        className="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-200"
                                                    >
                                                        Move to Trash
                                                    </button>

                                                    <button
                                                        onClick={function () {
                                                            const confirmDelete = window.confirm(
                                                                'Are you sure you want to delete this product?'
                                                            )

                                                            if (confirmDelete) {
                                                                deleteMutation.mutate(item.id)
                                                            }
                                                        }}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex justify-center items-center gap-5 py-8">

                        <button
                            onClick={function () {
                                setCurrentPage(currentPage - 1)
                            }}
                            disabled={currentPage === 1}
                            className="bg-[#245C43] text-white px-5 py-2 rounded-lg disabled:bg-gray-300"
                        >
                            Previous
                        </button>

                        <p className="font-semibold text-[#245C43]">
                            Page {currentPage} of {totalPages}
                        </p>

                        <button
                            onClick={function () {
                                setCurrentPage(currentPage + 1)
                            }}
                            disabled={currentPage === totalPages}
                            className="bg-[#245C43] text-white px-5 py-2 rounded-lg disabled:bg-gray-300"
                        >
                            Next
                        </button>

                    </div>
                )}

            </div>

            {/* View Product Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={function () {
                        setSelectedProduct(null)
                    }}
                >

                    <div
                        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8"
                        onClick={function (e) {
                            e.stopPropagation()
                        }}
                    >

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-xs text-green-700 uppercase tracking-widest">
                                    COCOORA / Product Details
                                </p>

                                <h2 className="text-2xl font-bold text-[#245C43] mt-1">
                                    {selectedProduct.name}
                                </h2>
                            </div>

                            <button
                                onClick={function () {
                                    setSelectedProduct(null)
                                }}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Product Images */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {(selectedProduct.images || [selectedProduct.image])
                                .filter(Boolean)
                                .map(function (image, index) {
                                    return (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${selectedProduct.name} ${index + 1}`}
                                            className="w-full h-44 object-cover rounded-xl bg-gray-100"
                                        />
                                    )
                                })}
                        </div>

                        {/* Product Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="bg-[#FFF8EC] p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Category</p>
                                <p className="font-semibold text-[#245C43] mt-1">
                                    {selectedProduct.category}
                                </p>
                            </div>

                            <div className="bg-[#FFF8EC] p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Price</p>
                                <p className="font-semibold text-[#245C43] mt-1">
                                    ₹{selectedProduct.price}
                                </p>
                            </div>

                            <div className="bg-[#FFF8EC] p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Available Stock</p>
                                <p className="font-semibold text-[#245C43] mt-1">
                                    {selectedProduct.stock} units
                                </p>
                            </div>

                            <div className="bg-[#FFF8EC] p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase">Stock Status</p>
                                <p className={`font-semibold mt-1 ${
                                    Number(selectedProduct.stock) > 0
                                        ? 'text-green-700'
                                        : 'text-red-600'
                                }`}>
                                    {Number(selectedProduct.stock) > 0
                                        ? 'In Stock'
                                        : 'Out of Stock'}
                                </p>
                            </div>

                        </div>

                        <div className="mt-5">
                            <h3 className="font-bold text-[#245C43] mb-2">
                                Product Description
                            </h3>

                            <p className="text-gray-600 leading-7">
                                {selectedProduct.description || 'No description available.'}
                            </p>
                        </div>

                        <button
                            onClick={function () {
                                setSelectedProduct(null)
                            }}
                            className="mt-7 bg-[#245C43] text-white px-6 py-3 rounded-lg hover:bg-[#1A4532] transition"
                        >
                            Close Details
                        </button>

                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminProducts
