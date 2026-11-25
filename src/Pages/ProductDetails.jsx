import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCart } from '../Redux/cartSlice'
import { toast } from 'react-toastify'

const ProductDetails = function () {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const user = useSelector(function (state) {
        return state.auth.user
    })

    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState('')
    const [adding, setAdding] = useState(false)

    // Fetch product
    const fetchProduct = async function () {
        const response = await axios.get(
            `http://localhost:3000/products/${id}`
        )
        return response.data
    }

    const {
        data: product,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['product', id],
        queryFn: fetchProduct
    })

    // Set first image
    useEffect(function () {
        if (product && product.images && product.images.length > 0) {
            setSelectedImage(product.images[0])
        }
    }, [product])

    // Add To Cart
    const handleAddToCart = async function () {

        if (!user) {
            toast.error('Please login first!')
            return
        }

        if (adding) return

        setAdding(true)

        try {
            // Get user's cart
            const response = await axios.get(
                `http://localhost:3000/cart?userId=${user.id}`
            )
            

            const cartData = response.data[0]
            const currentItems = cartData?.items || []

            // Check existing product
            const existingProduct = currentItems.find(function (item) {
                return String(item.id) === String(product.id)
            })

            const newQuantity = existingProduct
                ? Number(existingProduct.quantity) + quantity
                : quantity

            // Check stock before saving
            if (newQuantity > product.stock) {
                toast.error('Not enough stock available!')
                return
            }

            let updatedItems

            if (existingProduct) {
                updatedItems = currentItems.map(function (item) {
                    if (String(item.id) === String(product.id)) {
                        return { ...item, quantity: newQuantity }
                    }
                    return item
                })
            } else {
                updatedItems = [
                    ...currentItems,
                    {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        quantity: quantity
                    }
                ]
                toast.success("Cart Added Successfully")
            }

            // Save to JSON Server
            if (cartData) {
                await axios.patch(
                    `http://localhost:3000/cart/${cartData.id}`,
                    {
                        items: updatedItems
                    }
                )
            } else {
                await axios.post(
                    'http://localhost:3000/cart',
                    {
                        userId: user.id,
                        items: updatedItems
                    }
                )
            }

            // Update Redux
            dispatch(setCart(updatedItems))

            // Go to Cart
            navigate('/cart')

        } catch (error) {
            console.log(error)
            alert('Unable to add product to cart!')
        } finally {
            setAdding(false)
        }
    }

    if (isLoading) {
        return (
            <p className='text-center py-20 text-[#245C43]'>
                Loading...
            </p>
        )
    }

    if (isError || !product) {
        return (
            <p className='text-center py-20 text-red-500'>
                Something went wrong!
            </p>
        )
    }

    return (
        <section className='bg-[#FFF8EC] min-h-screen px-6 md:px-16 py-16'>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>

                {/* Product Images */}
                <div className='relative bg-white rounded-3xl overflow-hidden'>

                    <img
                        src={selectedImage || product.images[0]}
                        alt={product.name}
                        className='w-full h-[500px] md:h-[600px] object-cover'
                    />

                    {/* Thumbnails */}
                    <div className='absolute bottom-5 left-5 flex gap-3'>
                        {product.images.map(function (image, index) {
                            return (
                                <img
                                    key={index}
                                    src={image}
                                    alt={product.name}
                                    onClick={function () {
                                        setSelectedImage(image)
                                    }}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 shadow-lg
                                    ${selectedImage === image
                                            ? 'border-[#D97736]'
                                            : 'border-white'
                                        }`}
                                />
                            )
                        })}
                    </div>

                </div>

                {/* Product Information */}
                <div className='flex flex-col items-start'>

                    <p className='text-[#A8C686] uppercase tracking-[3px] font-semibold text-sm'>
                        COCOORA • Tropical Refreshment
                    </p>

                    <h1 className='text-4xl md:text-5xl font-bold text-[#245C43] mt-5'>
                        {product.name}
                    </h1>

                    <h2 className='text-3xl font-semibold text-[#245C43] mt-6'>
                        ₹{product.price}
                    </h2>

                    <div className='w-20 h-1 bg-[#A8C686] mt-6'></div>

                    <p className='text-gray-600 text-lg leading-8 mt-6'>
                        {product.description}
                    </p>

                    {/* Quantity */}
                    <div className='mt-8'>
                        <p className='text-[#245C43] font-semibold mb-3'>
                            Quantity
                        </p>

                        <div className='flex items-center gap-5 border border-[#245C43] rounded-full px-4 py-2 w-fit'>

                            <button
                                onClick={function () {
                                    if (quantity > 1) {
                                        setQuantity(quantity - 1)
                                    }
                                }}
                                className='text-[#245C43] text-2xl font-semibold'
                            >
                                -
                            </button>

                            <span className='text-[#245C43] font-semibold text-lg'>
                                {quantity}
                            </span>

                            <button
                                onClick={function () {
                                    if (quantity < product.stock) {
                                        setQuantity(quantity + 1)
                                    }
                                }}
                                disabled={quantity >= product.stock}
                                className='text-[#245C43] text-2xl font-semibold disabled:text-gray-300'
                            >
                                +
                            </button>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-4 mt-10 w-full'>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0 || adding}
                            
                            className='flex-1 bg-[#245C43] text-white py-4 px-6 rounded-full font-semibold hover:bg-[#1A4532] transition disabled:bg-gray-300'
                        >
                            {adding ? 'Adding...' : 'Add To Cart'}
                        </button>

                        <button
                            onClick={function () {
                                navigate('/checkout', {
                                    state: {
                                        buyNowProduct: {
                                            ...product,
                                            quantity: quantity
                                        }
                                    }
                                })
                            }}
                            disabled={product.stock <= 0}
                            className='flex-1 bg-[#D97736] text-white py-4 px-6 rounded-full font-semibold hover:bg-[#B85D25] transition disabled:bg-gray-300'
                        >
                            Buy Now
                        </button>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default ProductDetails