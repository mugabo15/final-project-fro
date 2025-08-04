import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl) {
  console.error("Backend URL is not defined in the environment variables.");
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: { FirstName: string;LastName: string; email: string; password: string;Dob: string; }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/user/signup`, userData);
      
      
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

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
   
    try {
      const response = await axios.post<{ token: string }>(`${backendUrl}/user/login`, userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Decode the token and save the decoded information in local storage
      const decodedToken = jwtDecode(token);
      localStorage.setItem('user', JSON.stringify(decodedToken));

    return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const response = await axios.get(`${backendUrl}/users`);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: { name: string; email: string }) => {
    const response = await axios.put(`${backendUrl}/users`, userData);
    return response.data;
  }
);

// ... existing code ...

// ... existing code ...

