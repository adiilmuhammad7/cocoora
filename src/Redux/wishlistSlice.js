
import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',

    initialState: {
        wishlist: []
    },

    reducers: {

        toggleWishlist: function (state, action) {
            const product = action.payload

            const existingProduct = state.wishlist.find(function (item) {
                return String(item.id) === String(product.id)
            })

            if (existingProduct) {
                state.wishlist = state.wishlist.filter(function (item) {
                    return String(item.id) !== String(product.id)
                })
            } else {
                state.wishlist.push(product)
            }
        },

        // Load wishlist from database
        setWishlist: function (state, action) {
            state.wishlist = action.payload
        }

    }
})

export const { toggleWishlist, setWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
