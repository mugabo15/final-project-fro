import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface DecodedToken {
    id: string;
    // add other properties if needed
}


if (!backendUrl) {
    console.error("Backend URL is not defined in the environment variables.");
}
export const addTransaction = createAsyncThunk(
    'transaction/addTransaction',
    async (transactionData: { account: string; type:string; amount: number; description: string; category_id: string; sub_category_id: string; }, { rejectWithValue }) => {
        try {
             const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error("Token not found");
                      }
                
                      const decodedToken: DecodedToken = jwtDecode(token);
                      const user_id = decodedToken.id;
                
                      console.log(`Fetching categories for user ID: ${user_id}`);
                      console.log(`Backend URL: ${backendUrl}/category`);
                
            const response = await axios.post(`${backendUrl}/transaction/create/${user_id}`, transactionData);
            toast.success('Transaction added successfully!');
            return response.data;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                toast.error('There was an error adding the transaction.');
                return rejectWithValue(error.response.data.message);
            } else {
                toast.error('There was an error adding the transaction.');
                return rejectWithValue(error.message);

            }
        }
    });

    export const fetchTransaction = createAsyncThunk( 
        'transaction/fetchTransaction',
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
                const response = await axios.get<{ transactions: any[] }>(`${backendUrl}/transaction/${user_id}`);
                
                return response.data.transactions;
            } catch (error: any) {
                if (error.response && error.response.data) {
                    console.log(error.response.data.message);
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }
    );