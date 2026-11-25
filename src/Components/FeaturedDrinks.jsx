
import React from 'react'
import featureddrinks from '../assets/featured drinks.png'
import { Link} from 'react-router-dom'

const FeaturedDrinks = function () {
  
  return (
    <>
      <section className="min-h-[520px] sm:min-h-[620px] lg:h-[750px] w-full relative isolate flex flex-col justify-between px-5 sm:px-8 lg:px-10 py-8 sm:py-10 overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat scale-105 blur-[2px]"
          style={{ backgroundImage: `url(${featureddrinks})` }}
        ></div>

        {/* Light Cream Overlay */}
        <div className="absolute inset-0 -z-10 bg-[#FFF8EC]/20"></div>

        {/* Top Heading */}
        <div className="text-center relative z-10">

          <h3 className="text-[#245C43] tracking-[5px] font-medium text-sm ">
            COCOORA FUSION COLLECTION
          </h3>

          <h1 className="text-[#245C43] text-3xl sm:text-4xl md:text-6xl font-bold mt-5">
            FRESH <span className="text-[#8FB56A]">•</span>
            FRUITY <span className="text-[#8FB56A]">•</span>
            REFRESHING
          </h1>

        </div>

        {/* Bottom Tagline and Button */}
        <div className="text-center relative z-10 mb-5">

          

          <button className="bg-[#245C43] text-[#FFF8EC] px-10 py-4 rounded-full text-lg font-medium hover:bg-[#8FB56A] hover:text-[#245C43] transition duration-300">
            <Link to="/shop">
  Explore Fusion →
</Link>
           
          </button>

        </div>

      </section>
    </>
  )
}

export default FeaturedDrinks
