
import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../Redux/authSlice'
import { setAdmin } from '../Redux/adminSlice'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

const Login = function () {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')



    let user = useSelector((state)=>state.auth.user)

    // LOGIN MUTATION
    const loginMutation = useMutation({

        mutationFn: async function (loginData) {

            // First check admins
            const adminResponse = await axios.get(
                'http://localhost:3000/admins'
            )

            const admin = adminResponse.data.find(function (admin) {
                return admin.email.toLowerCase() ===
                    loginData.email.trim().toLowerCase() &&
                    admin.password === loginData.password
            })

            if (admin) {
                return {
                    ...admin,
                    role: 'admin'
                }
            }

            // If not admin, check users
            const userResponse = await axios.get(
                'http://localhost:3000/users'
            )

            const user = userResponse.data.find(function (user) {
                return user.email.toLowerCase() ===
                    loginData.email.trim().toLowerCase() &&
                    user.password === loginData.password
            })
            if (user && user.blocked === true) {
                throw new Error('Your account has been blocked. Please contact the administrator.')
            }

            if (!user) {
                throw new Error('Invalid email or password')
            }

            return {
                ...user,
                role: 'user'
            }
        },

        // LOGIN SUCCESS
        onSuccess: function (user) {

            const loggedInUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

            if (user.role === 'admin') {

                localStorage.setItem(
                    'admin',
                    JSON.stringify(loggedInUser)
                )

                dispatch(setAdmin(loggedInUser))

                toast.success('Admin login successful!')

                navigate('/adminDashboard')

            } else {

                localStorage.setItem(
                    'user',
                    JSON.stringify(loggedInUser)
                )

                dispatch(setUser(loggedInUser))

                toast.success('Login successful!')

                navigate('/')
            }

            setEmail('')
            setPassword('')
            setError('')
        },

        // LOGIN ERROR
        onError: function (error) {
            setError(error.message)
        }

    })


    // HANDLE LOGIN FORM
    const handleLogin = function (e) {

        e.preventDefault()

        setError('')

        if (email.trim() === '') {
            setError('Please enter your email')
            return
        }

        if (password === '') {
            setError('Please enter your password')
            return
        }

        loginMutation.mutate({
            email: email,
            password: password
        })
    }

    const{data: users = []}=useQuery({
        queryKey:['users'],
        queryFn:async function () {
            let response = await axios.get('http://localhost:3000/users')
            return response.data
        },
        refetchInterval:3000
    })
    const currentUser = users?.find(function(User){
       return User.id === user?.id
    })
    useEffect(function(){
        if(currentUser?.blocked == true){
            dispatch(logout())
            navigate('/login')
            toast.error("You Has been blocked by admin")
            localStorage.removeItem('user')
        }
    },[currentUser])
  

    // UI
    return (
        <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-5 sm:p-8 md:p-10">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <h1 className="text-4xl font-bold text-[#245C43]">
                            COCOORA<span className="text-[#A8C686]">.</span>
                        </h1>
                    </Link>
                    <p className="text-gray-500 mt-3">
                        Fresh coconut goodness starts here.
                    </p>
                </div>


                {/* Heading */}
                <div className="mb-7">

                    <h2 className="text-2xl font-bold text-[#245C43]">
                        Welcome Back
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        Login to your COCOORA account.
                    </p>

                </div>


                {/* Login Form */}
                <form
                    onSubmit={handleLogin}
                    noValidate
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={function (e) {
                                setEmail(e.target.value)
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition"
                        />

                    </div>


                    {/* Password */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={function (e) {
                                setPassword(e.target.value)
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition"
                        />

                    </div>


                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}


                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full py-3.5 bg-[#245C43] text-white font-semibold rounded-xl hover:bg-[#194630] transition duration-300 shadow-md disabled:opacity-50"
                    >
                        {loginMutation.isPending
                            ? 'Logging in...'
                            : 'Login'}
                    </button>

                </form>


                {/* Register Link */}
                <div className="text-center mt-7 text-sm text-gray-500">

                    Don't have an account?{' '}

                    <Link
                        to="/register"
                        className="text-[#245C43] font-semibold hover:text-[#A8C686] transition"
                    >
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    )
}

export default Login
