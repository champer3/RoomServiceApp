import {configureStore} from '@reduxjs/toolkit'
import cart from "./cart";
import { cartSyncMiddleware } from "./cart";
import items from './Items';
import profile from './profile';
import order from './order';
import notifications from './notify';
import favorites from './favorites';
import { favSyncMiddleware } from './favorites';

export const store = configureStore({
    reducer: {
        cartItems : cart,
        productItems : items,
        orders: order,
        profileData: profile,
        notifications: notifications,
        favorites: favorites,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }).concat(cartSyncMiddleware, favSyncMiddleware),
})
