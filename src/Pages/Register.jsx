
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const Register = function () {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const navigate = useNavigate()

    // Name validation
    const validateName = function (value) {

        const nameRegex = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u

        if (!value.trim()) {
            return 'Name is required'
        }

        if (value.trim().length < 2 || value.trim().length > 50) {
            return 'Name must be between 2 and 50 characters'
        }

        if (!nameRegex.test(value.trim())) {
            return 'Please enter a valid name (letters only)'
        }

        return ''
    }

    // Email validation
    const validateEmail = function (value) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!value.trim()) {
            return 'Email is required'
        }

        if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address'
        }

        return ''
    }

    // Password validation
    const validatePassword = function (value) {

        if (!value) {
            return 'Password is required'
        }

        if (value.length < 8) {
            return 'Password must contain at least 8 characters'
        }

        if (value.length > 64) {
            return 'Password cannot exceed 64 characters'
        }

        if (!/[A-Z]/.test(value)) {
            return 'Include at least one uppercase letter'
        }

        if (!/[a-z]/.test(value)) {
            return 'Include at least one lowercase letter'
        }

        if (!/[0-9]/.test(value)) {
            return 'Include at least one number'
        }

        return ''
    }

    // Confirm password validation
    const validateConfirmPassword = function (value, currentPassword) {

        if (!value) {
            return 'Please confirm your password'
        }

        if (value !== currentPassword) {
            return 'Passwords do not match'
        }

        return ''
    }

    // Registration mutation
    const registerMutation = useMutation({

        mutationFn: async function (userData) {

            const response = await axios.get(
                'http://localhost:3000/users'
            )

            const existingUser = response.data.find(function (user) {
                return user.email.toLowerCase() === userData.email
            })

            if (existingUser) {
                throw new Error('EMAIL_EXISTS')
            }

            const registerResponse = await axios.post(
                'http://localhost:3000/users',
                userData
            )

            return registerResponse.data
        },

        onSuccess: function () {

            toast.success('Registration successful!')

            setName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')

            setErrors({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

            navigate('/login')
        },

        onError: function (error) {

            if (error.message === 'EMAIL_EXISTS') {

                setErrors(function (prev) {
                    return {
                        ...prev,
                        email: 'This email is already registered'
                    }
                })

                return
            }

            toast.error('Registration failed. Please try again.')
        }

    })

    // Form submission
    const handleRegister = function (e) {

        e.preventDefault()

        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(
                confirmPassword,
                password
            )
        }

        setErrors(newErrors)

        const isValid = Object.values(newErrors).every(function (error) {
            return error === ''
        })

        if (!isValid) {
            return
        }

        registerMutation.mutate({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            blocked: false,
            addresses: []
        })
    }

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
                        Create Your Account
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        Join COCOORA and discover your tropical refreshment.
                    </p>

                </div>

                {/* Register Form */}
                <form
                    onSubmit={handleRegister}
                    noValidate
                    className="space-y-5"
                >

                    {/* Name */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            autoComplete="name"
                            onChange={function (e) {

                                const value = e.target.value
                                setName(value)

                                setErrors(function (prev) {
                                    return {
                                        ...prev,
                                        name: validateName(value)
                                    }
                                })

                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition`}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}

                    </div>

                    {/* Email */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            autoComplete="email"
                            onChange={function (e) {

                                const value = e.target.value
                                setEmail(value)

                                setErrors(function (prev) {
                                    return {
                                        ...prev,
                                        email: validateEmail(value)
                                    }
                                })

                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition`}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            autoComplete="new-password"
                            onChange={function (e) {

                                const value = e.target.value
                                setPassword(value)

                                setErrors(function (prev) {
                                    return {
                                        ...prev,
                                        password: validatePassword(value),
                                        confirmPassword: confirmPassword
                                            ? validateConfirmPassword(confirmPassword, value)
                                            : prev.confirmPassword
                                    }
                                })

                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition`}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Confirm Password */}
                    <div>

                        <label className="block text-sm font-medium text-[#245C43] mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            autoComplete="new-password"
                            onChange={function (e) {

                                const value = e.target.value
                                setConfirmPassword(value)

                                setErrors(function (prev) {
                                    return {
                                        ...prev,
                                        confirmPassword: validateConfirmPassword(value, password)
                                    }
                                })

                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-[#FFF8EC] outline-none focus:border-[#245C43] focus:ring-2 focus:ring-[#A8C686]/30 transition`}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}

                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full py-3.5 bg-[#245C43] text-white font-semibold rounded-xl hover:bg-[#194630] transition duration-300 shadow-md disabled:opacity-50"
                    >
                        {registerMutation.isPending
                            ? 'Creating Account...'
                            : 'Create Account'}
                    </button>

                </form>

                {/* Login Link */}
                <div className="text-center mt-7 text-sm text-gray-500">

                    Already have an account?{' '}

                    <Link
                        to="/login"
                        className="text-[#245C43] font-semibold hover:text-[#A8C686] transition"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default Register
