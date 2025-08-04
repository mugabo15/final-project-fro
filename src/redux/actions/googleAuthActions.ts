import axios from 'axios';
import { GOOGLE_AUTH_SUCCESS, GOOGLE_AUTH_FAILURE } from '../types';

// Define backend URL from environment variable
const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Google Authentication Action
 * @param {string} code - Authorization code received from Google OAuth
 */
export const googleAuth = (code: any) => async (dispatch: (arg0: { type: any; payload: any; }) => void) => {
  try {
    const response = await axios.get(`${API_URL}/auth/google/callback?code=${code}`);
    
    const { user, token } = response.data as { user: any; token: string }; // Assuming your backend returns user data and a JWT token

    // Save token to localStorage
    localStorage.setItem('token', token);

    dispatch({
      type: GOOGLE_AUTH_SUCCESS,
      payload: user,
    });

  } catch (error:any) {
    dispatch({
      type: GOOGLE_AUTH_FAILURE,
      payload: error.response?.data?.message || 'Google Authentication Failed',
    });
  }
};
