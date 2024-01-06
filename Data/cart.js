import {createSlice} from '@reduxjs/toolkit'

const cart = createSlice({
    name : 'cart',
    initialState: {
        ids: [],
        order : []
    },
    reducers: {
        addToCart : (state, action) => {state.ids.push(action.payload.id)},
        removeFromCart : (state, action) => {for (let i = state.ids.length - 1; i >= 0; i--) {
            if (state.ids[i].title === action.payload.id.title) {
                state.ids.splice(i, 1);
                break
            }
        }},
        deleteFromCart : (state, action) => {for (let i = state.ids.length - 1; i >= 0; i--) {
            if (state.ids[i].title === action.payload.id.title) {
                state.ids.splice(i, 1);
            }
        }},
        clearCart : (state) => {state.ids.length = 0},
        completeOrder: (state) => {state.order.push(...state.ids)}
    }
})

export const addToCart = cart.actions.addToCart
export const removeFromCart = cart.actions.removeFromCart
export const deleteFromCart = cart.actions.deleteFromCart
export const clearCart = cart.actions.clearCart
export const completeOrder = cart.actions.completeOrder
export default cart.reducer