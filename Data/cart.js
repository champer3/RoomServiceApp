import {createSlice} from '@reduxjs/toolkit'
import { syncCartToServer, clearCartOnServer } from '../api/syncService';

let syncTimer = null;
function debouncedCartSync(getState) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const items = getState().cartItems.ids;
    syncCartToServer(items).catch(() => {});
  }, 1500);
}

export const cart = createSlice({

    name : 'cart',
    initialState: {
        ids: [],
    },
    reducers: {
        setCart: (state, action) => { state.ids = action.payload || []; },
        addToCart : (state, action) => {
            const incoming = action.payload.id;

            const hasCustomisation = (item) => {
                if (item.extra?.length > 0) return true;
                if (item.options?.some(o => o.values?.length > 0)) return true;
                if (item.variantSelections?.some(g => g.selected?.length > 0)) return true;
                if (item.schemaAddonsSelected?.length > 0) return true;
                if (item.instructions) return true;
                if (item.components) return true;
                return false;
            };

            if (!hasCustomisation(incoming)) {
                const productId = incoming?.products?.[0]?.id || incoming?.products?.[0]?.title;
                const existingIdx = state.ids.findIndex(existing =>
                    !hasCustomisation(existing) &&
                    (existing?.products?.[0]?.id || existing?.products?.[0]?.title) === productId
                );
                if (existingIdx !== -1) {
                    state.ids[existingIdx]?.products.push(incoming?.products[0]);
                    return;
                }
            }

            state.ids.push(incoming);
        },
        addItem : (state, action) => {;
            const index =action.payload.id.index
            if (index !== -1) {
                state.ids[index]?.products.push(state.ids[index]?.products[0])
    }
        },
        removeFromCart : (state, action) => {
            const index = action.payload.id.index
            if (index !== -1) {
                state.ids[index]?.products.pop();
            } if (state.ids[index]?.products.length == 0){
                state.ids.splice(index, 1);
            }
        },
        updateCart : (state, action)=>{
            const titleName = action.payload.id.title;
            const index = state.ids.findIndex(obj => Object.keys(obj)[0] === titleName);
    if (index !== -1) {
        const titleArray = state.ids[index][titleName];
            titleArray[action.payload.id.index] = action.payload.id.newItem;
    }
        },
        addOptions : (state, action) => {
                const titleName = action.payload.id.title;
                const indexToUpdate = state.ids.findIndex(obj => Object.keys(obj)[0] === titleName);
                if (indexToUpdate !== -1) {
                    const titleArray = state.ids[indexToUpdate][titleName];
                    if (titleArray.length > 0) {
                        titleArray[titleArray.length - 1] = { ...titleArray[titleArray.length - 1], ...action.payload.id.options };
                    }
                }
        },
        deleteFromCart : (state, action) => {
            const indexToRemove = action.payload.id.index
            if (indexToRemove !== -1) {
                state.ids.splice(indexToRemove, 1);
            }},
        clearCart : (state) => {state.ids.length = 0},
        resetCartLocal : (state) => {state.ids = []},
    }
})

export const setCart = cart.actions.setCart
export const addToCart = cart.actions.addToCart
export const updateCart = cart.actions.updateCart
export const addItem = cart.actions.addItem
export const removeFromCart = cart.actions.removeFromCart
export const deleteFromCart = cart.actions.deleteFromCart
export const addOptions = cart.actions.addOptions
export const clearCart = cart.actions.clearCart
export const resetCartLocal = cart.actions.resetCartLocal

export const selectTotalCartCount = (state) =>
    (state.cartItems.ids || []).reduce(
        (sum, item) => sum + (Array.isArray(item?.products) ? item?.products?.length : 1),
        0
    );

export const cartSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const syncActions = [
    'cart/addToCart', 'cart/addItem', 'cart/removeFromCart',
    'cart/updateCart', 'cart/addOptions', 'cart/deleteFromCart',
  ];
  if (syncActions.includes(action.type)) {
    debouncedCartSync(store.getState);
  }
  if (action.type === 'cart/clearCart') {
    clearCartOnServer().catch(() => {});
  }
  return result;
};

export default cart.reducer