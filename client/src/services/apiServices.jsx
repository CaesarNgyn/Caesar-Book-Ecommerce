import axios from '../utils/axiosCustomize'

const postRegister = (userData) => {
  return axios.post('api/v1/auth/register', {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
  })
}

export { postRegister }