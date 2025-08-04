import { createSlice } from "@reduxjs/toolkit";
import { createSubCategory, fetchSubCategory } from "../actions/subCategory";

interface SubCategoryState {
    subData: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SubCategoryState = {
    subData: [],
    loading: false,
    error: null as string | null,
    success: false,
};

export const subCategorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        reset: (state) => {
            state.subData = [];
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategory.fulfilled, (state, { payload }: { payload: any[] }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.subData = payload;
            })
            .addCase(fetchSubCategory.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(createSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.subData = payload;
            })
            .addCase(createSubCategory.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            );
    },

});
export { fetchSubCategory, createSubCategory };