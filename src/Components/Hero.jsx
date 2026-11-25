import React from 'react'
import Herobg from '../assets/Herobg.png'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    let navigate = useNavigate()
    return (
        <>
            <section
                className="h-[750px] w-full relative isolate flex flex-col justify-center  px-10 bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: `url(${Herobg})` }}
            >
                <div className="w-fit">
                    <h1 className="text-6xl font-bold text-black text-left text-lime-800">
                        A LITTLE TROPICAL.<br /> A LOT REFRESHING
                    </h1>

                    <p className="text-black text-lg mt-6 max-w-xl text-left text-gray-600">
                        Fresh coconut goodness with a taste of paradise.
                        Discover your favorite tropical refreshment.
                    </p>

                    <div className="flex justify-center">
                        <button 
                       
                        className="text-black  mt-10 px-6 py-3 bg-[#A8C686] font-semibold rounded-lg hover:bg-[#8FB56A] transition"
                         onClick={function(){
                            navigate('/shop')
                         }}
                        >
                            Explore Drinks
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero