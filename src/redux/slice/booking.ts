import { createSlice } from "@reduxjs/toolkit";
import { createBooking, hostBookings, rentersBookings } from "../actions/booking";

interface PropertyState {
    bookData: any[];
    rentersData: any[];
    hostData: any[];

    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: PropertyState = {
    bookData: [],
    rentersData: [],
    hostData: [],

    loading: false,
    error: null as string | null,
    success: false,
};

export const bookngSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        reset: (state) => {
            state.bookData = [];
            state.rentersData = [];
    state.hostData= [];
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    }, extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.bookData = payload;
            })
            .addCase(createBooking.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(rentersBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rentersBookings.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.rentersData = payload;
            })
            .addCase(rentersBookings.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(hostBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hostBookings.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.hostData = payload;
            })
            .addCase(hostBookings.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
    }

})

export { createBooking, rentersBookings }