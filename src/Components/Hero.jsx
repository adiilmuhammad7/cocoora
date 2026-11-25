
import React from 'react'
import Herobg from '../assets/Herobg.png'
import { useNavigate } from 'react-router-dom'

const Hero = function () {

    const navigate = useNavigate()

    return (
        <section className="relative isolate flex min-h-[650px] flex-col overflow-hidden bg-[#FFF8EC] sm:min-h-[700px] lg:h-[750px] lg:min-h-0">

            {/* Desktop Background Image */}
            <div
                className="absolute inset-0 -z-10 hidden bg-cover bg-center bg-no-repeat lg:block"
                style={{
                    backgroundImage: `url(${Herobg})`
                }}
                aria-hidden="true"
            />

            {/* Main Content */}
            <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col justify-center px-5 py-10 sm:px-8 md:px-10 lg:px-10 lg:py-0">

                <div className="w-full max-w-xl text-center lg:text-left">

                    <h1 className="text-4xl font-bold leading-[1.08] text-lime-800 sm:text-4xl lg:text-6xl">
                        A LITTLE TROPICAL.<br className="hidden sm:block" /> A LOT REFRESHING
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base text-gray-600 sm:mt-6 sm:text-lg lg:mx-0">
                        Fresh coconut goodness with a taste of paradise.
                        Discover your favorite tropical refreshment.
                    </p>

                    <div className="mt-7 flex justify-center sm:mt-10 lg:justify-start">

                        <button
                            className="rounded-lg bg-[#A8C686] px-6 py-3 font-semibold text-black transition duration-300 hover:bg-[#8FB56A]"
                            onClick={function () {
                                navigate('/shop')
                            }}
                        >
                            Explore Drinks
                        </button>

                    </div>

                </div>

            </div>

            {/* Mobile and Tablet Image */}
            <div className="relative mt-auto h-[280px] w-full sm:h-[340px] md:h-[400px] lg:hidden">

                <img
                    src={Herobg}
                    alt="Fresh tropical coconut drinks"
                    className="h-full w-full object-cover object-[70%_center] sm:object-[65%_center] md:object-center"
                />

            </div>

        </section>
    )
}

export default Hero
