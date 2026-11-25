import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = function () {

    const products = useSelector(function (state) {
        return state.cart.cart
    })

    const user = useSelector(function (state) {
        return state.auth.user
    })

    const cartCount = products.reduce(function (total, product) {
        return total + product.quantity
    }, 0)

    return (
        <nav className="w-full flex items-center justify-between px-10 py-5 bg-[#FFF8EC]">

            {/* Logo */}
            <Link to={'/'}>
                <h1 className="text-3xl font-bold text-[#245C43]">
                    COCOORA<span className="text-[#A8C686]">.</span>
                </h1>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8 text-[#245C43] font-medium">

                <Link
                    to={'/'}
                    className="hover:text-[#A8C686] transition"
                >
                    Home
                </Link>

                <Link
                    to={'/shop'}
                    className="hover:text-[#A8C686] transition"
                >
                    Shop
                </Link>

                <Link
                    to={'/our-story'}
                    className="hover:text-[#A8C686] transition"
                >
                    Our Story
                </Link>

                <Link
                    to={'/contact'}
                    className="hover:text-[#A8C686] transition"
                >
                    Contact
                </Link>

            </div>

            {/* Profile and Cart */}
            <div className="flex items-center gap-4">
                <Link
    to="/wishlist"
    className="bg-[#245C43] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#1B4633] transition"
>
    Wishlist ♥
</Link>

                <Link to={user ? '/profile' : '/login'}>
                    <button className="px-5 py-2 border border-[#245C43] text-[#245C43] rounded-full font-semibold hover:bg-[#A8C686] transition">
                        {user ? 'Profile' : 'Login'}
                    </button>
                </Link>

                <Link to={'/cart'}>
                    <button className="px-5 py-2 bg-[#A8C686] text-[#245C43] rounded-full font-semibold hover:bg-[#8FB56A] transition">
                        Cart ({cartCount})
                    </button>
                </Link>

            </div>

        </nav>
    )
}

export default Navbar