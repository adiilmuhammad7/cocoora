
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Categories = function () {

    const navigate = useNavigate()

    const { data: product = [], isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: async function () {
            const response = await axios.get('http://localhost:3000/category')
            return response.data
        }
    })

    if (isLoading) {
        return <p>Loading categories...</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }

    return (
        <section className='bg-[#FFF8EC] py-24 px-6 md:px-12'>

            {/* Section Heading */}

            <div className='text-center mb-16'>
                <p className='text-[#8B9F57] uppercase tracking-[4px] text-sm font-semibold'>
                    A Taste of Paradise
                </p>

                <h1 className='text-[#245C43] text-3xl md:text-5xl font-bold mt-5'>
                    DISCOVER YOUR <span className='text-[#A8C686]'>TROPICAL</span>
                    <br />
                    FAVORITES
                </h1>

                <p className='text-gray-500 mt-5 text-base md:text-lg'>
                    Find your perfect sip in our refreshing collection.
                </p>
            </div>

            {/* Category Cards */}

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

                {product.map(function (item) {

                    return (

                        <div
                            key={item.id}
                            className='group cursor-pointer'
                            onClick={function () {
                                navigate('/shop', {
                                    state: { category: 
                                        item.name
                                     }
                                })
                            }}
                        >

                            <div className='relative overflow-hidden rounded-3xl'>

                                {/* Category Image */}

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-full h-[350px] object-cover transition duration-500 group-hover:scale-110'
                                />

                                {/* Dark Gradient */}

                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                                {/* Category Details */}

                                <div className='absolute bottom-6 left-6 right-6'>

                                    <p className='text-white/80 text-sm tracking-widest uppercase'>
                                        {item.description}
                                    </p>

                                    <h2 className='text-white text-2xl font-bold mt-2'>
                                        {item.name}
                                    </h2>

                                    <p className='text-white mt-3 text-sm'>
                                        Discover More →
                                    </p>

                                </div>

                            </div>

                        </div>

                    )
                })}

            </div>

        </section>
    )
}

export default Categories
