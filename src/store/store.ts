import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../context/CategorySlice';
import cartReducer from '../context/CartSlice';

//what it is doing in the below 4 lines is trying to get the cart from sessionStorage, if it finds a cart,
//it parses it into a JSON object and then  uses it as the initial state only for the cart slice
//if it doesn't find a cart, it defaults back to the slice's initial state in cartSlice.ts, which is an empty cart array
const savedCart = sessionStorage.getItem('cart');
const preloadedState = savedCart
    ? {cart: JSON.parse(savedCart)}
    : undefined;

//this is creating the actual Redux store, which has two pieces of state, cart and category. The reducers
//come from their respective slices of the cart. 
export const store  = configureStore({
    reducer: {
        category: categoryReducer,
        cart: cartReducer,
    },
    preloadedState,  //this feeds in the existing items in the state if they exist
});

//below is getting the current state and then storing any changes to the cart when changes occur
store.subscribe(() => {
    const state = store.getState();
    sessionStorage.setItem('cart', JSON.stringify(state.cart));
});

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;