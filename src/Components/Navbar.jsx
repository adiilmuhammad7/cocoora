import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = function () {
    const [menuOpen, setMenuOpen] = useState(false)

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
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 lg:py-5 bg-[#FFF8EC] relative z-40">

            {/* Logo */}
            <Link to={'/'}>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#245C43]">
                    COCOORA<span className="text-[#A8C686]">.</span>
                </h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 text-[#245C43] font-medium">

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
            <div className="hidden lg:flex items-center gap-4">
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

            <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full border border-[#245C43] text-[#245C43]"
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
            >
                <span className="block w-5 h-0.5 bg-current"></span>
                <span className="block w-5 h-0.5 bg-current"></span>
                <span className="block w-5 h-0.5 bg-current"></span>
            </button>

            {menuOpen && (
                <div className="absolute left-0 right-0 top-full bg-[#FFF8EC] border-t border-[#245C43]/10 px-4 py-5 shadow-lg lg:hidden">
                    <div className="flex flex-col gap-1 text-[#245C43] font-medium">
                        <Link onClick={() => setMenuOpen(false)} to="/" className="px-3 py-3 rounded-lg hover:bg-[#A8C686]/20">Home</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/shop" className="px-3 py-3 rounded-lg hover:bg-[#A8C686]/20">Shop</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/our-story" className="px-3 py-3 rounded-lg hover:bg-[#A8C686]/20">Our Story</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/contact" className="px-3 py-3 rounded-lg hover:bg-[#A8C686]/20">Contact</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                        <Link onClick={() => setMenuOpen(false)} to="/wishlist" className="text-center bg-[#245C43] text-white px-4 py-3 rounded-full font-semibold">Wishlist ♥</Link>
                        <Link onClick={() => setMenuOpen(false)} to={user ? '/profile' : '/login'} className="text-center border border-[#245C43] text-[#245C43] px-4 py-3 rounded-full font-semibold">{user ? 'Profile' : 'Login'}</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/cart" className="text-center bg-[#A8C686] text-[#245C43] px-4 py-3 rounded-full font-semibold">Cart ({cartCount})</Link>
                    </div>
                </div>
            )}

        </nav>
    )
}

export default Navbar