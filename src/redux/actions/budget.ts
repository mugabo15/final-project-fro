import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl) {
    console.error("Backend URL is not defined in the environment variables.");
}

interface Budget {
    status: string;
    start_date: string | number | Date;
    end_date: string | number | Date;
    category_id: string;
    isActive: unknown;
    id: string;
    name: string;
    amount: number;
    category: string;
}

interface BudgetState {
    data: Budget[];
    loading: boolean;
    error: string | null;
}

interface DecodedToken {
    id: string;
    // add other properties if needed
}

const initialState: BudgetState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchBudgets = createAsyncThunk(
    'budget/fetchBudgets',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const user_id = decodedToken.id;
            console.log(`Fetching transactions for user ID: ${user_id}`);
            console.log(`Backend URL: ${backendUrl}/transaction`);
            const response = await axios.get(`${backendUrl}/budget/active/${user_id}`);
            const data = response.data as { activeBudget: Budget };
            return data.activeBudget;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const createBudget = createAsyncThunk(
    'budget/createBudget',
    async (budget: { amount: number; category_id: string; start_date: string; end_date: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const user_id = decodedToken.id;
            console.log(`Fetching transactions for user ID: ${user_id}`);
            console.log(`Backend URL: ${backendUrl}/transaction`);
            const response = await axios.post<{ activeBudget: Budget }>(`${backendUrl}/budget/create/${user_id}`, budget);
            toast.success('Budget created successfully!');
            const data = response.data.activeBudget;
            return data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);

                return rejectWithValue(error.response.data.message);
            } else {
                toast.error(error);

                return rejectWithValue(error.message);
            }
        }
    }
);

export const getUserExpenseTransactionsWithTotal = createAsyncThunk(
    'transaction/totalexpense',
    async (user_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${backendUrl}/transaction/totalexpense/${user_id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
)
const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBudgets.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload as unknown as Budget[];
            })
            .addCase(fetchBudgets.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(createBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBudget.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data.push(payload as Budget);
            })
            .addCase(createBudget.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
    },
});

export default budgetSlice.reducer;