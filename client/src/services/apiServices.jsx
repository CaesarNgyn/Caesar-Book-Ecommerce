import axios from '../utils/axiosCustomize'

export const postRegister = (userData) => {
  return axios.post('api/v1/auth/register', {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
  })
}

export const postLogin = (userData) => {
  return axios.post('api/v1/auth/login', {
    username: userData.username,
    password: userData.password,
  })
}

export const fetchAccount = () => {
  return axios.get('api/v1/auth/account')
}

export const postLogout = () => {
  return axios.post('api/v1/auth/logout')
}

export const fetchUserWithPagination = (current, pageSize) => {
  return axios.get(`api/v1/users?current=${current}&pageSize=${pageSize}`)
}




