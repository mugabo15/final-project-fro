import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
interface DecodedToken {
    id: string;
    // Add other properties if needed
}
if (!backendUrl) {
    console.error("Backend URL is not defined in the environment variables.");
}
export const registerCategory = createAsyncThunk(
    'Category/registerCategory',
    async (userData: { name: string; type: string; }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            console.log(`Fetching transactions for user ID: ${userId}`);
            console.log(`Backend URL: ${backendUrl}/transaction`);
            const response = await axios.post(`${backendUrl}/category/register/${userId}`, userData);

            toast.success('Category added successfully!');
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                toast.error('There was an error adding the category.');
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }

            const decodedToken: DecodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            console.log(`Fetching categories for user ID: ${userId}`);
            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.get(`${backendUrl}/category/${userId}`);
            return response.data;
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


