
import { createSlice } from '@reduxjs/toolkit'

const savedAdmin = localStorage.getItem('admin')

const initialState = {
  admin: savedAdmin ? JSON.parse(savedAdmin) : null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialState,

  reducers: {
    setAdmin: function (state, action) {
      state.admin = action.payload
      localStorage.setItem('admin', JSON.stringify(action.payload))
    },

    adminLogout: function (state) {
      state.admin = null
      localStorage.removeItem('admin')
    }
  }
})

export const { setAdmin, adminLogout } = adminSlice.actions

export default adminSlice.reducer
