import {createSlice} from '@reduxjs/toolkit'

const cart = createSlice({
    name : 'cart',
    initialState: {
        ids: [],
        order : []
    },
    reducers: {
        addToCart : (state, action) => {
            // state.ids.push(action.payload.id)
            const title = action.payload.id.title;
            const index = state.ids.findIndex(item => Object.keys(item)[0] === title);
            if (index !== -1){
                state.ids[index][title].push(action.payload.id)
            }else{
                const newItem = {};
                newItem[title] = [action.payload.id];
                state.ids.push(newItem)
            }
        },
        deleteItem : (state, action) => {
            const title = action.payload.id.title;
            const index =state.ids.findIndex(obj => Object.keys(obj)[0] === title);
            if (index !== -1) {
                const titleArray = state.ids[index][title];
                titleArray.splice(action.payload.id.index, 1);
                if (titleArray.length === 0) {
                    state.ids.splice(index, 1);
                }
    }
        },
        removeFromCart : (state, action) => {
            
            const titleName = action.payload.id.title;

            const index = state.ids.findIndex(obj => Object.keys(obj)[0] === titleName);

            if (index !== -1) {
                const objectsArray = state.ids[index][titleName];
                
                if (objectsArray.length > 0) {
                    objectsArray.pop();
                }
                if (objectsArray.length === 0) {
                    state.ids.splice(index, 1);
                }
            }},
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
            const titleName = action.payload.id.title;
            
            const indexToRemove = state.ids.findIndex(obj => Object.keys(obj)[0] === titleName);
            if (indexToRemove !== -1) {
                state.ids.splice(indexToRemove, 1);
            }},
        clearCart : (state) => {state.ids.length = 0},
        completeOrder: (state, action) => {state.order.push(action.payload.id)},
        updateOrder: (state, action) => { const index = state.order.findIndex(item => item.id === action.payload.id.uid); // Find the object with the given id
        if (index !== -1) {
            const order = state.order[index] 
            const act = action.payload.id.act
            order[act] = action.payload.id.perform; // Add the delivery time to the found order object
            console.log("Delivery time added successfully:", order);
        } }
    }
})

export const addToCart = cart.actions.addToCart
export const updateCart = cart.actions.updateCart
export const updateOrder = cart.actions.updateOrder
export const deleteItem = cart.actions.deleteItem
export const removeFromCart = cart.actions.removeFromCart
export const deleteFromCart = cart.actions.deleteFromCart
export const addOptions = cart.actions.addOptions
export const clearCart = cart.actions.clearCart
export const completeOrder = cart.actions.completeOrder
export default cart.reducer