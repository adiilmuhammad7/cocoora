
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
    <aside className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center bg-white border-t border-gray-100 px-2 lg:top-0 lg:bottom-auto lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:p-5">

      {/* Logo */}
      <div className="hidden items-center gap-2 px-2 mb-10 lg:flex">

        <h1 className="text-xl font-bold text-[#245C43]">
          COCOORA
        </h1>
      </div>

      {/* Main Section */}
      <div className="w-full lg:mb-3">
        <p className="hidden text-xs font-medium text-gray-400 px-3 mb-3 lg:block">
          MAIN
        </p>

        <div className="grid grid-cols-5 gap-1 lg:flex lg:flex-col">

          {menuItems.map(function (item) {
            return (
              <button
                key={item.path}
                onClick={function () {
                  navigate(item.path)
                }}
                className={`w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-0 lg:gap-3 px-1 lg:px-4 py-2 lg:py-3 rounded-lg text-[10px] lg:text-sm font-medium transition ${isActive(item.path)
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
        className="hidden w-full lg:flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
      >
        <span className="text-lg w-5 text-center">⇥</span>
        Logout
      </button>



    </aside>
  )
}

export default SideBar
