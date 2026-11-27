
import React, { useState, useEffect } from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import axios from 'axios'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setWishlist } from '../Redux/wishlistSlice'

const Shop = function () {

    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const location = useLocation()

    const [selectedCategory, setSelectedCategory] = useState(
        location.state?.category || "All Drinks"
    )

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [sortPrice, setSortPrice] = useState("default")
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6

    // Get wishlist from Redux
    const wishlist = useSelector(function (state) {
        return state.wishlist.wishlist
    })

    // Get logged-in user
    const user = useSelector(function (state) {
        return state.auth.user
    })

    // Debouncing search
    useEffect(function () {

        const timer = setTimeout(function () {
            setDebouncedSearch(search)
        }, 500)

        return function () {
            clearTimeout(timer)
        }

    }, [search])

    // Fetch products
    const fetchProducts = async function () {

        const response = await axios.get(
            'https://cocoora-api.onrender.com/products'
        )

        return response.data
    }

    const {
        data: products = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    })

    // Remove trashed products
    const activeProducts = products.filter(function (item) {
        return item.deleted !== true
    })

    // Fetch user's wishlist
    const fetchWishlist = async function () {

        if (!user) return null

        const response = await axios.get(
            `https://cocoora-api.onrender.com/wishlist?userId=${user.id}`
        )

        return response.data[0] || null
    }

    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist', user?.id],
        queryFn: fetchWishlist,
        enabled: !!user
    })

    // Add or remove wishlist product
    const wishlistMutation = useMutation({

        mutationFn: async function (product) {

            if (!user) {
                throw new Error("Please login first")
            }

            const currentWishlist = await axios.get(
                `https://cocoora-api.onrender.com/wishlist?userId=${user.id}`
            )

            const wishlistRecord = currentWishlist.data[0]

            let updatedItems

            if (wishlistRecord) {

                const existingProduct = wishlistRecord.items.find(
                    function (item) {
                        return String(item.id) === String(product.id)
                    }
                )

                if (existingProduct) {

                    // Remove product
                    updatedItems = wishlistRecord.items.filter(
                        function (item) {
                            return String(item.id) !== String(product.id)
                        }
                    )

                } else {

                    // Add product
                    updatedItems = [
                        ...wishlistRecord.items,
                        product
                    ]

                }

                const response = await axios.patch(
                    `https://cocoora-api.onrender.com/wishlist/${wishlistRecord.id}`,
                    {
                        items: updatedItems
                    }
                )

                return response.data

            } else {

                // Create wishlist record
                const response = await axios.post(
                    'https://cocoora-api.onrender.com/wishlist',
                    {
                        userId: user.id,
                        items: [product]
                    }
                )

                return response.data
            }
        },

        onSuccess: function (data) {

            // Update Redux
            dispatch(setWishlist(data.items || []))

            // Refresh wishlist query
            queryClient.invalidateQueries({
                queryKey: ['wishlist', user.id]
            })

            toast.success("Wishlist updated successfully")

        },

        onError: function (error) {
            toast.error(error.message || "Something went wrong")
        }

    })

    // Handle wishlist
    const handleWishlist = function (product) {

        if (!user) {
            toast.error("Please login first")
            return
        }

        wishlistMutation.mutate(product)
    }

    // Keep Redux synchronized with JSON Server
    useEffect(function () {

        if (!user) {
            dispatch(setWishlist([]))
        } else if (wishlistData) {
            dispatch(setWishlist(wishlistData.items || []))
        } else if (wishlistData === null) {
            dispatch(setWishlist([]))
        }

    }, [wishlistData, user, dispatch])

    // Category and search filtering
    const filteredProducts = activeProducts.filter(function (product) {

        const categoryMatch =
            selectedCategory === "All Drinks" ||
            product.category === selectedCategory

        const nameMatch = product.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())

        return categoryMatch && nameMatch

    })

    // Sort products
    const sortedProducts = [...filteredProducts].sort(
        function (a, b) {

            if (sortPrice === "low-high") {
                return a.price - b.price
            }

            if (sortPrice === "high-low") {
                return b.price - a.price
            }

            return 0
        }
    )

    // Pagination
    const totalPages = Math.ceil(
        sortedProducts.length / itemsPerPage
    )

    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCategory = function (category) {

        setSelectedCategory(category)
        setCurrentPage(1)

    }

    if (isLoading) {
        return <h1>Loading Products...</h1>
    }

    if (isError) {
        return <h1>Something went wrong!</h1>
    }

    return (

        <div className='bg-[#FFF8EC] min-h-screen'>

            <h1 className='text-center px-4 pt-12 pb-6 sm:py-16 lg:py-20 text-3xl sm:text-4xl font-bold text-[#245C43]'>
                Discover Your Tropical Favorites
            </h1>

            <p className='text-base sm:text-lg text-[#245C43] text-center px-5'>
                Explore our refreshing collection of coconut drinks,
                crafted for every moment.
            </p>

            {/* Filters */}
            <div className='flex justify-center gap-6 py-10 flex-wrap'>

                {/* Sort */}
                <select
                    value={sortPrice}
                    onChange={function (e) {
                        setSortPrice(e.target.value)
                        setCurrentPage(1)
                    }}
                    className='border border-[#245C43] rounded-full px-6 py-3 bg-white'
                >
                    <option value="default">Sort By Price</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                </select>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search your favorite drink..."
                    value={search}
                    onChange={function (e) {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className='border border-[#245C43] rounded-full px-5 sm:px-6 py-3 w-full max-w-[350px]'
                />

                {/* Category buttons */}
                <div className='flex gap-4 flex-wrap justify-center'>

                    {[
                        "All Drinks",
                        "Pure Coconut",
                        "Tropical Fusion",
                        "Coconut Cream",
                        "Coconut Smoothie"
                    ].map(function (category) {

                        return (

                            <button
                                key={category}
                                onClick={function () {
                                    handleCategory(category)
                                }}
                                className={`px-5 py-3 rounded-full border border-[#245C43] ${
                                    selectedCategory === category
                                        ? 'bg-[#245C43] text-white'
                                        : 'bg-white text-[#245C43]'
                                }`}
                            >
                                {category}
                            </button>

                        )
                    })}

                </div>

            </div>

            {/* Product Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 px-4 sm:px-6 lg:px-10 pb-10'>

                {currentProducts.length === 0 ? (

                    <h2 className='text-center text-2xl col-span-3 py-20'>
                        No Items Found
                    </h2>

                ) : (

                    currentProducts.map(function (product) {

                        const isWishlisted = wishlist.some(
                            function (item) {
                                return String(item.id) === String(product.id)
                            }
                        )

                        return (

                            <div
                                key={product.id}
                                className='bg-white rounded-2xl overflow-hidden shadow-sm'
                            >

                                <div className='relative'>

                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.name}
                                            className='w-full h-[350px] object-cover'
                                        />
                                    </Link>

                                    {/* Wishlist button */}
                                    <button
                                        onClick={function () {
                                            handleWishlist(product)
                                        }}
                                        disabled={wishlistMutation.isPending}
                                        className={`absolute top-4 left-4 w-11 h-11 rounded-full flex items-center justify-center text-2xl shadow-md transition ${
                                            isWishlisted
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white text-gray-500 hover:text-red-500'
                                        }`}
                                    >
                                        {isWishlisted ? '♥' : '♡'}
                                    </button>

                                    {/* Stock status */}
                                    <span
                                        className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
                                            product.stock > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-600'
                                        }`}
                                    >
                                        {product.stock > 0
                                            ? 'In Stock'
                                            : 'Out of Stock'}
                                    </span>

                                </div>

                                <div className='p-5'>

                                    <h2 className='text-xl font-bold text-[#245C43] mt-4'>
                                        {product.name}
                                    </h2>

                                    <p className='text-gray-600 mt-2'>
                                        {product.description}
                                    </p>

                                    <p className='text-lg font-semibold mt-3'>
                                        ₹{product.price}
                                    </p>

                                    <Link
                                        to={`/product/${product.id}`}
                                        className={`inline-block px-6 py-3 rounded-full mt-4 ${
                                            product.stock > 0
                                                ? 'bg-[#245C43] text-white'
                                                : 'bg-gray-300 text-gray-500 pointer-events-none'
                                        }`}
                                    >
                                        {product.stock > 0
                                            ? 'View Product'
                                            : 'Out of Stock'}
                                    </Link>

                                </div>

                            </div>
                        )
                    })
                )}

            </div>

            {/* Pagination */}
            {totalPages > 0 && (

                <div className='flex justify-center items-center gap-4 pb-16'>

                    <button
                        onClick={function () {
                            setCurrentPage(currentPage - 1)
                        }}
                        disabled={currentPage === 1}
                        className='bg-[#245C43] text-white px-5 py-2 rounded-full disabled:opacity-50'
                    >
                        Previous
                    </button>

                    <p className='text-[#245C43] font-semibold'>
                        Page {currentPage} of {totalPages}
                    </p>

                    <button
                        onClick={function () {
                            setCurrentPage(currentPage + 1)
                        }}
                        disabled={currentPage === totalPages}
                        className='bg-[#245C43] text-white px-5 py-2 rounded-full disabled:opacity-50'
                    >
                        Next
                    </button>

                </div>

            )}
        </div>
    )
}

export default Shop
