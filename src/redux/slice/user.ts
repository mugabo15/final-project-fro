import { createSlice } from "@reduxjs/toolkit";

import { loginUser, registerUser } from "../actions/user";


interface UserState {
    data: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: UserState = {
    data: [],
    loading: false,
    error: null as string | null,
    success: false,
};

export const userSlice = createSlice({
    name: "user",
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
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload as any[];
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            })
            //loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.data = payload as unknown as any[];
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.success = false;
                state.error = payload as string;
            }
            )
           
    },
});

export { registerUser};

export const { reset } = userSlice.actions;