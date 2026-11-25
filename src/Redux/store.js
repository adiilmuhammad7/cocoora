import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import wishlistReducer from './wishlistSlice'
import adminReducer from './adminSlice'

const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        wishlist: wishlistReducer,
        admin: adminReducer,
    }
})

export default store