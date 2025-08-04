import { createSlice } from "@reduxjs/toolkit";
import { fetchCategory, registerCategory } from "../actions/category";

const initialState = {
    data: [],
    loading: false,
    error: null as string | null,
    success: false,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        reset: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerCategory.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload as any; // Adjust the type as needed
            })
            .addCase(registerCategory.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(fetchCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategory.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = (payload as any).categories || [];
            })
            .addCase(fetchCategory.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            
    },
});


export { fetchCategory, registerCategory };