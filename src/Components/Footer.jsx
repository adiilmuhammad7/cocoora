
import React from 'react'

const Footer = function () {
  return (
    <footer className='bg-[#245C43] text-[#FFF8EC] px-10 pt-16 pb-8'>

      {/* Footer Main */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>

        {/* Brand */}
        <div>
          <h1 className='text-3xl font-bold tracking-wider'>
            COCOORA
          </h1>

          <p className='mt-5 text-[#D5E5C5] leading-7'>
            Sip Into Paradise.
            <br />
            A little tropical. A lot refreshing.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className='text-lg font-semibold mb-5'>
            Quick Links
          </h2>

          <ul className='space-y-3 text-[#D5E5C5]'>
            <li className='hover:text-white cursor-pointer'>Home</li>
            <li className='hover:text-white cursor-pointer'>Shop</li>
            <li className='hover:text-white cursor-pointer'>Our Story</li>
            <li className='hover:text-white cursor-pointer'>Contact</li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h2 className='text-lg font-semibold mb-5'>
            Explore Drinks
          </h2>

          <ul className='space-y-3 text-[#D5E5C5]'>
            <li className='hover:text-white cursor-pointer'>Pure Coconut</li>
            <li className='hover:text-white cursor-pointer'>Tropical Fusion</li>
            <li className='hover:text-white cursor-pointer'>Coconut Cream</li>
            <li className='hover:text-white cursor-pointer'>Smoothies</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h2 className='text-lg font-semibold mb-5'>
            Customer Care
          </h2>

          <ul className='space-y-3 text-[#D5E5C5]'>
            <li className='hover:text-white cursor-pointer'>FAQs</li>
            <li className='hover:text-white cursor-pointer'>Shipping & Delivery</li>
            <li className='hover:text-white cursor-pointer'>Returns</li>
            <li className='hover:text-white cursor-pointer'>Contact Us</li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className='border-t border-[#6F987B] mt-16 pt-6'>

        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>

          <p className='text-sm text-[#D5E5C5]'>
            © 2026 COCOORA. All rights reserved.
          </p>

          <p className='text-sm text-[#D5E5C5]'>
            Made with nature in mind.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer
