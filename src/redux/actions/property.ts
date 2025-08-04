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
export const addProperty = createAsyncThunk(
    'Property/addProperty',
    async (property: FormData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }

            const decodedToken: DecodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            console.log(`Fetching categories for user ID: ${user_id}`);
            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.post(`${backendUrl}/property/create/${user_id}`, property);
            toast.success('Property added successfully!');
            return response.data;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                toast.error('There was an error adding the property.');
                return rejectWithValue(error.response.data.message);
            } else {
                toast.error('There was an error adding the property.');
                return rejectWithValue(error.message);

            }
        }
    });

export const fetchProperty = createAsyncThunk(
    'Property/fetchProperty',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const user_id = decodedToken.id;
            console.log(`Fetching Propertys for user ID: ${user_id}`);
            console.log(`Backend URL: ${backendUrl}/Property`);
            const response = await axios.get<{
                data: any; propertys: any[]
            }>(`${backendUrl}/Property/my-listings/${user_id}`);
            console.log("real data", response.data);

            return response.data.data;
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

export const fetchAdminProperty = createAsyncThunk(
    'Property/fetchAdminProperty',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const user_id = decodedToken.id;
            console.log(`Fetching Propertys for user ID: ${user_id}`);
            console.log(`Backend URL: ${backendUrl}/Property/all`);
            const response = await axios.get<{
                data: any; propertys: any[]
            }>(`${backendUrl}/Property/all`);
            console.log("admin data", response.data);

            return response.data.data;
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
interface UpdatePropertyPayload {
    Title: string;
    Description: string;
    price: string;
    location: string;
}

export const updateProperty = createAsyncThunk(
    'Property/updateProperty',
    async (property: UpdatePropertyPayload, { rejectWithValue }) => {
        try {
            const id = localStorage.getItem('productId');
            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.put(`${backendUrl}/property/update/${id}`, property);
            toast.success('Property updated successfully!');
            console.log("updated data", response.data);
            const updtData = response.data
            return updtData;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                toast.error('There was an error updating the property.');
                return rejectWithValue(error.response.data.message);
            } else {
                toast.error('There was an error updating the property.');
                return rejectWithValue(error.message);
            }
        }
    }
);
export const adminUpdateProperty = createAsyncThunk(
    'Property/adminupdateProperty',
    async (id: string) => {
        try {
            

            const response = await axios.put(`${backendUrl}/property/admin-update/${id}`);
            toast.success('Property confirmed successfully!');
            console.log("status updated data", response.data);
            const updtData = response.data
            return updtData;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                toast.error('There was an error confirming the property.');
                return (error.response.data.message);
            } else {
                toast.error('There was an error confirming the property.');
                return (error.message);
            }
        }
    }
);
export const getAllProperty = createAsyncThunk(
    'Property/getAllProperty',
    async () => {
        try {
            // const id = localStorage.getItem('productId');

            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.get(`${backendUrl}/property`);
            console.log("all frm reduc", response.data);
            return response.data;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log("error while getting all property", error.response.data.message);
                toast.error('There was an error adding the property.');
                return (error.response.data.message);
            } else {
                toast.error('There was an error adding the property.');
                return (error.message);

            }
        }
    });
export const getProperty = createAsyncThunk(
    'Property/getProperty',
    async () => {
        try {
            const id = localStorage.getItem('productId');

            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.get<{ existingProperty: any }>(`${backendUrl}/property/${id}`);
            console.log("single frm reduc", response.data.existingProperty);
            const singleData = response.data.existingProperty;
            return singleData;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log("error while getting single property", error.response.data.message);
                toast.error('There was an error adding the property.');
                return (error.response.data.message);
            } else {
                toast.error('There was an error adding the property.');
                return (error.message);

            }
        }
    }
);

export const deleteProperty = createAsyncThunk(
    'Property/deleteProperty',
    async (id: string) => {
        try {
           

            console.log(`Backend URL: ${backendUrl}/category`);

            await axios.delete(`${backendUrl}/property/${id}`);
            // console.log("single frm reduc", response.data.existingProperty);
            // const singleData = response.data.existingProperty;
            toast.success('Property Removed successfully!');

            // return singleData;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log("error while deleting property", error.response.data.message);
                toast.error('property cant be deleted at this time');
                return (error.response.data.message);
            } else {
                toast.error('property cant be deleted at this time');
                return (error.message);

            }
        }
    }
);

export const getConfirmedProperties = createAsyncThunk(
    'Property/getConfirmedProperties',
    async () => {
        try {
            const response = await axios.get<{ data: any }>(`${backendUrl}/property/`);
            // console.log("single frm reduc", response.data.existingProperty);
            const confirmedData = response.data.data;
            return confirmedData;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log("error while getting single property", error.response.data.message);
                toast.error('There was an error adding the property.');
                return (error.response.data.message);
            } else {
                toast.error('There was an error adding the property.');
                return (error.message);

            }
        }
    }
);