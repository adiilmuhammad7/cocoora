
import { createSlice } from '@reduxjs/toolkit'

const savedUser = localStorage.getItem('user')

const initialState = {
user: savedUser ? JSON.parse(savedUser) : null
}
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,

    reducers: {
        setUser: function (state, action) {
            state.user = action.payload
        },

        logout: function (state) {
            state.user = null
        }
    }
})

export const { setUser, logout } = authSlice.actions

export default authSlice.reducer
