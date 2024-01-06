import {configureStore} from '@reduxjs/toolkit'
import cart from "./cart";
import items from './Items';

export const store = configureStore({
    reducer: {
        cartItems : cart,
        productItems : items
    }
})
