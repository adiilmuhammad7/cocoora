import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../Redux/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const Profile = function () {

    const user = useSelector(function (state) {
        return state.auth.user
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = function () {
        dispatch(logout())
        localStorage.removeItem('user')
        navigate('/login')
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFF8EC] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-[#245C43]">
                    Please Login First
                </h2>

                <Link
                    to="/login"
                    className="mt-5 bg-[#245C43] text-white px-6 py-3 rounded-lg"
                >
                    Go to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center px-5">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#245C43]">
                        COCOORA
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Your Profile
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-[#245C43] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-[#245C43]">
                        Welcome, {user.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Manage your COCOORA account
                    </p>
                </div>

                <div className="space-y-4">

                    <div className="bg-[#FFF8EC] p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                            Full Name
                        </p>

                        <p className="font-semibold text-[#245C43] mt-1">
                            {user.name}
                        </p>
                    </div>

                    <div className="bg-[#FFF8EC] p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                            Email Address
                        </p>

                        <p className="font-semibold text-[#245C43] mt-1">
                            {user.email}
                        </p>
                    </div>

                </div>

                <Link
                    to="/my-orders"
                    className="w-full mt-6 flex items-center justify-center bg-[#245C43] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1B4633] transition duration-300"
                >
                    My Orders
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-[#245C43] text-white py-3 rounded-lg font-semibold hover:bg-[#19432F] transition"
                >
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Profile
