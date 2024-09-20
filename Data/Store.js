import {configureStore} from '@reduxjs/toolkit'
import cart from "./cart";
import items from './Items';
import profile from './profile';
import order from './order';
import notifications from './notify';

export const store = configureStore({
    reducer: {
        cartItems : cart,
        productItems : items,
        orders: order,
        profileData: profile,
       notifications: notifications
    }
})
