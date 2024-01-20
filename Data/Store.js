import {configureStore} from '@reduxjs/toolkit'
import cart from "./cart";
import items from './Items';
import profile from './profile';

export const store = configureStore({
    reducer: {
        cartItems : cart,
        productItems : items,
        profileData: profile
    }
})
