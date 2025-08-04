import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface DecodedToken {
    id: string;
}

export const createBooking = createAsyncThunk(
    'Property/createBooking',
    async (property: { checkIn: string; checkOut: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }

            const decodedToken: DecodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            const propId = localStorage.getItem('productId');

            if (!propId) {
                return rejectWithValue("Property ID is missing.");
            }

            console.log(`Booking for user ID: ${userId}, Property ID: ${propId}`);
            console.log(`Backend URL: ${backendUrl}/booking/book/${userId}/${propId}`);

            const response = await axios.post(`${backendUrl}/booking/book/${userId}/${propId}`, property);
            toast.success('Booking created successfully!');
            return response.data;
        } catch (error: any) {
            console.error("Booking Error:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'Booking failed.');
                return rejectWithValue(error.response.data.message);
            } else {
                toast.error('There was an error creating the booking.');
                return rejectWithValue(error.message);
            }
        }
    }
);

export const rentersBookings = createAsyncThunk(
    'Property/rentersBookings',
    async () => {
        try {
            // const id = localStorage.getItem('productId');
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
            const decodedToken: DecodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            console.log(`Backend URL: ${backendUrl}/category`);

            const response = await axios.get<{ data: any }>(`${backendUrl}/booking/bookings/${userId}/`);
            return response.data.data;
        }
        catch (error: any) {
            if (error.response && error.response.data) {
                console.log("error while getting renters booking", error.response.data.message);
                toast.error('There was an error fetching renters booking.');
                return (error.response.data.message);
            } else {
                toast.error('There was an fetching .');
                return (error.message);

            }
        }
    });

    export const cancelBooking = createAsyncThunk(
        'Property/cancelBooking',
        async (id: string) => {
            try {
               
    
                console.log(`Backend URL: ${backendUrl}/category`);
    
                await axios.put(`${backendUrl}/booking/booking-cancel/${id}`);
                // console.log("single frm reduc", response.data.existingProperty);
                // const singleData = response.data.existingProperty;
                toast.success('Booking Canceled successfully!');
    
                // return singleData;
            }
            catch (error: any) {
                if (error.response && error.response.data) {
                    console.log("error while deleting property", error.response.data.message);
                    toast.error('There was an error deleting the property.');
                    return (error.response.data.message);
                } else {
                    toast.error('There was an error deleting the property.');
                    return (error.message);
    
                }
            }
        }
    );
    export const confirmBooking = createAsyncThunk(
        'Property/confirmBooking',
        async (id: string) => {
            try {
               
    
                console.log(`Backend URL: ${backendUrl}/category`);
    
                await axios.put(`${backendUrl}/booking/confirm/${id}`);
                // console.log("single frm reduc", response.data.existingProperty);
                // const singleData = response.data.existingProperty;
                toast.success('Booking confirmed successfully!');
    
                // return singleData;
            }
            catch (error: any) {
                if (error.response && error.response.data) {
                    console.log("error while confirming booking", error.response.data.message);
                    toast.error('There was an error confirming booking.');
                    return (error.response.data.message);
                } else {
                    toast.error('There was an error confirming booking.');
                    return (error.message);
    
                }
            }
        }
    );

    export const hostBookings = createAsyncThunk(
        'Property/hostBookings',
        async () => {
            try {
                // const id = localStorage.getItem('productId');
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found");
                }
                const decodedToken: DecodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                console.log(`Backend URL: ${backendUrl}/category`);
    
                const response = await axios.get<{ bookings: any }>(`${backendUrl}/booking/host-bookings/${userId}/`);
                return response.data;
            }
            catch (error: any) {
                if (error.response && error.response.data) {
                    console.log("error while getting renters booking", error.response.data.message);
                    toast.error('There was an error fetching renters booking.');
                    return (error.response.data.message);
                } else {
                    toast.error('There was an fetching .');
                    return (error.message);
    
                }
            }
        });