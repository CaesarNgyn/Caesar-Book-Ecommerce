import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isLoggedIn: false,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: "",
    tempAvatar: ""
  },
};



const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLogin: (state, action) => {
      state.isAuthenticated = true,
        state.user = action.payload,
        state.isLoading = false,
        state.isLoggedIn = true
    },
    doGetAccount: (state, action) => {
      state.isAuthenticated = true,
        state.user = action.payload,
        state.isLoading = false
    },
    doLogout: (state, action) => {
      localStorage.removeItem('access_token')
      state.isAuthenticated = false,
        state.isLoggedIn = false
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
      }
    },
    doUploadAvatar: (state, action) => {
      state.user.tempAvatar = action.payload.avatar
    },
    doUpdateUserInfo: (state, action) => {
      state.user.email = action.payload.email
      state.user.phone = action.payload.phone
      state.user.fullName = action.payload.fullName
      state.user.avatar = action.payload.avatar
    }
  }
});

export const { doLogin, doGetAccount, doLogout, doUpdateUserInfo, doUploadAvatar } = accountSlice.actions;
export default accountSlice.reducer;