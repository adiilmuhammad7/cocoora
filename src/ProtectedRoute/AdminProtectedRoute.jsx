import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtectedRoute = function () {

  const admin = useSelector(function (state) {
    return state.admin.admin
  })

  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute