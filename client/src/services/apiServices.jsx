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

export const fetchUserWithQuery = (query) => {
  return axios.get(`api/v1/users?${query}`)
}


export const fetchUserByID = (id) => {
  return axios.get(`api/v1/users/${id}`)
}



