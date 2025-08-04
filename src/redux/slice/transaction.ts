import { createSlice } from "@reduxjs/toolkit";
import { addTransaction, fetchTransaction } from "../actions/transaction";

interface TransactionState {
    data: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: TransactionState = {
    data: [],
    loading: false,
    error: null as string | null,
    success: false,
};

export const transactionSlice = createSlice({
    name: "transaction",
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
            .addCase(addTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                const payload = action.payload as any[];
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload;
            })
            .addCase(addTransaction.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            .addCase(fetchTransaction.pending, (state) => { 
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransaction.fulfilled, (state, { payload }: { payload: any[] }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload;
            })
            .addCase(fetchTransaction.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            );
    },
});

export { addTransaction };