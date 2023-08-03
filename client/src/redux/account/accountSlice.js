import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: ""
  },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLogin: (state, action) => {
      state.isAuthenticated = true,
        state.user = action.payload,
        state.isLoading = false
    },
    doGetAccount: (state, action) => {
      state.isAuthenticated = true,
        state.user = action.payload,
        state.isLoading = false
    },
    doLogout: (state, action) => {
      localStorage.removeItem('access_token')
      state.isAuthenticated = false,
        state.user = {
          email: "",
          phone: "",
          fullName: "",
          role: "",
          avatar: "",
          id: ""
        }
    }

  }

});

export const { doLogin, doGetAccount, doLogout } = accountSlice.actions;
export default accountSlice.reducer;