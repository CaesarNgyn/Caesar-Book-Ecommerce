import axios from 'axios';
import dotenv from 'dotenv'

const baseURL = import.meta.env.VITE_BACKEND_URL

// Create a custom instance of Axios
const customAxios = axios.create({
  baseURL, // Set the base URL for all requests

});


// Add interceptors for request and response (optional)
customAxios.interceptors.request.use(
  (config) => {
    // Modify the request config before it is sent
    console.log('Request is being sent:', config);

    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => {
    // Handle successful responses

    return response && response.data ? response.data : response;
  },
  (error) => {
    // Handle response error
    console.error('Response error:', error);
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default customAxios;