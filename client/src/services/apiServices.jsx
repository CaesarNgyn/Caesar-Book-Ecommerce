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

export const postCreateUser = (userData) => {
  return axios.post('api/v1/users', {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
  })
}

export const postCreateManyUser = (userData) => {
  console.log("user data sent", userData)

  return axios.post('api/v1/users/bulk-create', {
    users: userData.map(user => ({
      fullName: user.fullName,
      email: user.email,
      password: import.meta.env.VITE_DEFAULT_USER_PASSWORD,
      phone: user.phone.toString(),
    })),
  }
  )
}


export const patchUpdateUser = (userData) => {
  return axios.patch(`api/v1/users`, {
    _id: userData.id,
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
  })
}

export const deleteUser = (userId) => {
  return axios.delete(`api/v1/users/${userId}`)
}





