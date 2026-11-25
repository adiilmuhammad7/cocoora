
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { adminLogout } from '../Redux/adminSlice'

const SideBar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/adminDashboard',
      icon: '▦'
    },
    {
      name: 'Products',
      path: '/adminProducts',
      icon: '◇'
    },
    {
      name: 'Users',
      path: '/adminUsers',
      icon: '♧'
    },
    {
      name: 'Orders',
      path: '/adminOrders',
      icon: '🛒'
    },
    {
      name: 'Trash',
      path: '/adminTrash',
      icon: '🗑️'
    },
  ]

  function isActive(path) {
    return location.pathname === path
  }


  function handleLogout() {
    dispatch(adminLogout())
    localStorage.removeItem('admin')
    navigate('/login')
  }

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen shrink-0 bg-white border-r border-gray-100 p-5 flex flex-col z-50">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10">

        <h1 className="text-xl font-bold text-[#245C43]">
          COCOORA
        </h1>
      </div>

      {/* Main Section */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-400 px-3 mb-3">
          MAIN
        </p>

        <div className="flex flex-col gap-1">

          {menuItems.map(function (item) {
            return (
              <button
                key={item.path}
                onClick={function () {
                  navigate(item.path)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive(item.path)
                    ? 'bg-[#E5F8F0] text-[#16875A]'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg w-5 text-center">
                  {item.icon}
                </span>

                {item.name}
              </button>
            )
          })}

        </div>
      </div>
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
      >
        <span className="text-lg w-5 text-center">⇥</span>
        Logout
      </button>



    </aside>
  )
}

export default SideBar
