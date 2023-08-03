import axios from 'axios';
import dotenv from 'dotenv'

const baseURL = import.meta.env.VITE_BACKEND_URL

// Create a custom instance of Axios
const customAxios = axios.create({
  baseURL, // Set the base URL for all requests
  withCredentials: true //so that client can set cookies sent from server
});

//every request from now will be sent with bearer token
customAxios.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }



// Add interceptors for request and response (optional)
customAxios.interceptors.request.use(
  (config) => {
    // Modify the request config before it is sent
    // console.log('Request is being sent:', config);
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
    const originalRequest = error.config;
    if (error.response.status === 401 && error.response.data.message === "Không tồn tại refresh token") {
      window.location.href = '/login'
    }
    if (error.response.status === 401 && error.response.data.message === "Token không hợp lệ"
    ) {
      console.log("Error response code: ", error.response.status)
      localStorage.removeItem('access_token')
      // console.log("refresh_token:", refresh_token)

      return customAxios
        .get("api/v1/auth/refresh")
        .then((response) => {
          // console.log(" >>> RESPONSE:", response)
          const new_access_token = response.data.access_token;
          localStorage.setItem('access_token', new_access_token)
          // console.log("new access token: ", new_access_token)
          originalRequest.headers["Authorization"] = `Bearer ${localStorage.getItem('access_token')}`;
          // console.log("org Request: ", originalRequest)

          // console.log("org header: ", originalRequest.headers)
          return customAxios(originalRequest);
        }).catch((err) => {
          throw err
        })

    }
    console.error('Response error:', error.response);
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default customAxios;