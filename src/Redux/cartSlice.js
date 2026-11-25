
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {

        addToCart: function (state, action) {
            const existingProduct = state.cart.find(function (item) {
                return String(item.id) === String(action.payload.id)
            })

            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity || 1
            } else {
                state.cart.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1
                })
            }
        },

        increaseQuantity: function (state, action) {
            const product = state.cart.find(function (item) {
                return String(item.id) === String(action.payload)
            })

            if (product) {
                product.quantity += 1
            }
        },

        decreaseQuantity: function (state, action) {
            const product = state.cart.find(function (item) {
                return String(item.id) === String(action.payload)
            })

            if (product && product.quantity > 1) {
                product.quantity -= 1
            }
        },

        removeFromCart: function (state, action) {
            state.cart = state.cart.filter(function (item) {
                return String(item.id) !== String(action.payload)
            })
        },

        clearCart: function (state) {
            state.cart = []
        },

        setCart: function (state, action) {
            state.cart = action.payload
        }
    }
})

export const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    setCart
} = cartSlice.actions

export default cartSlice.reducer
