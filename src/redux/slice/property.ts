import { createSlice } from "@reduxjs/toolkit";
import { addProperty, fetchAdminProperty, fetchProperty, getAllProperty, getConfirmedProperties, getProperty, updateProperty } from "../actions/property";

interface PropertyState {
    data: any[];
    singleData: any[]
    updtData: any[];
    confirmedData: any[];
    adminData: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
    updatesuccess?: boolean;
}

const initialState: PropertyState = {
    data: [],
    singleData: [],
    updtData: [],
    confirmedData: [],
    adminData:[],
    loading: false,
    error: null as string | null,
    success: false,
    updatesuccess: false
};

export const propertySlice = createSlice({
    name: "property",
    initialState,
    reducers: {
        reset: (state) => {
            state.data = [];
            state.singleData = [];
            state.updtData = [];
            state.confirmedData = [] ;
            state.adminData = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.updatesuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProperty.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload;
            })
            .addCase(addProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(fetchProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperty.fulfilled, (state, { payload }: { payload: any[] }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload;
            })
            .addCase(fetchProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
            .addCase(getProperty.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(getProperty.fulfilled, (state, { payload }: { payload: any[] }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.singleData = payload;
            })
            .addCase(getProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
            .addCase(updateProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.updatesuccess = true;
                state.error = null;
                state.updtData = payload;
            })
            .addCase(updateProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
            .addCase(getAllProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProperty.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload;
            })
            .addCase(getAllProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
            .addCase(getConfirmedProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConfirmedProperties.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                // state.loading = false;
                // state.success = true;
                // state.error = null;
                state.confirmedData = payload;
            })
            .addCase(getConfirmedProperties.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
            .addCase(fetchAdminProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProperty.fulfilled, (state, action) => {
                const payload = action.payload as unknown as any[];
                // state.loading = false;
                // state.success = true;
                // state.error = null;
                state.adminData = payload;
            })
            .addCase(fetchAdminProperty.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            );
    },
});

export { addProperty, fetchProperty, getProperty, updateProperty, getAllProperty , getConfirmedProperties};