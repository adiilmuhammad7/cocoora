
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { logout } from '../Redux/authSlice'

const UserSessionCheck = function () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(function (state) {
        return state.auth.user
    })

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async function () {
            const response = await axios.get(
                'https://cocoora-api.onrender.com/users'
            )
            return response.data
        },
        refetchInterval: 3000,
        enabled: !!user?.id
    })

    const currentUser = users.find(function (item) {
        return String(item.id) === String(user?.id)
    })

    useEffect(function () {
        if (currentUser?.blocked === true) {
            dispatch(logout())
            localStorage.removeItem('user')
            toast.error('Your account has been blocked by admin')
            navigate('/login', { replace: true })
        }
    }, [currentUser, dispatch, navigate])

    return null
}

export default UserSessionCheck
