import { createSlice } from '@reduxjs/toolkit';

type PayloadAction<T> = {
    payload: T;
    type: string;
}

interface CategoryState {
    selectedCategory: string;
}

const initialState: CategoryState = {
    selectedCategory: '',
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setSelectedCategory: ( state, action: PayloadAction<string> ) => {
            state.selectedCategory = action.payload;
        },
    },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;