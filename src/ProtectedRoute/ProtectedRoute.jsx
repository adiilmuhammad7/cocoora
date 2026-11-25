import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = function ({ children }) {

    const user = useSelector(function (state) {
        return state.auth.user
    })

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute