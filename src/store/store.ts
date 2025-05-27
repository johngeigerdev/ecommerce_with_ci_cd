import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../context/CategorySlice';
import cartReducer from '../context/CartSlice';

export const store  = configureStore({
    reducer: {
        category: categoryReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType< typeof store.getState>;
export type AppDispatch = typeof store.dispatch;