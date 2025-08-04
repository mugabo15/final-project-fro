import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchSubCategory = createAsyncThunk(
    'subcategory/fetchSubCategory',
async (payload: { categoryId: string }, { rejectWithValue }) => {
      try {
        // Retrieve selectedCategoryId from localStorage
        // const categoryId = localStorage.getItem('selectedCategoryId');
        // if (!categoryId) {
        //   throw new Error('No category selected. Please select a category first.');
        // }
  
        // Make the API call with the retrieved categoryId
        const response = await axios.get<{ subCategories: any[] }>(`${backendUrl}/category/${payload.categoryId}/subcategories`);
        console.log('Subcategories:', response.data);
        
        return response.data.subCategories;
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
  export const createSubCategory = createAsyncThunk(
    'subcategory/createSubCategory',
    async (payload: { name: string; category_id: string }, { rejectWithValue }) => {
      try {
        // Make the API call with the payload
        const response = await axios.post(`${backendUrl}/category/subcategory`, payload);
        console.log('Subcategory created:', response.data);
        toast.success('SubCategory added successfully!');
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          console.log(error.response.data.error);
          toast.error('There was an error adding the subcategory.');
          return rejectWithValue(error.response.data.message);
        } else {
            toast.error('There was an error adding the subcategory.');
          return rejectWithValue(error.message);
        }
      }
    }
  );