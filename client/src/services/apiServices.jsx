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


export const patchUpdateUser = (id, fullName, email, phone, avatar) => {
  console.log(">>dâtuopdate", id, fullName, email, phone, avatar)
  return axios.patch(`api/v1/users`, {
    _id: id,
    fullName: fullName,
    email: email,
    phone: phone,
    avatar: avatar
  })
}

export const deleteUser = (userId) => {
  return axios.delete(`api/v1/users/${userId}`)
}

export const fetchBookWithQuery = (query) => {
  return axios.get(`api/v1/books?${query}`)
}

export const fetchBookByID = (id) => {
  return axios.get(`api/v1/books/${id}`)
}


export const getCategory = () => {
  return axios.get(`api/v1/database/category`)
}

export const postUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImgUpload', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "folder_type": "book"
    },
  });

}

export const postCreateBook = (author, mainText, price, quantity, sold, category, thumbnail, slider) => {
  console.log(">>slider api", slider)
  console.log(">>thumb api", thumbnail)

  return axios.post('api/v1/books', {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider
  })
}

export const patchUpdateBook = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.patch(`api/v1/books`, {
    _id: id,
    thumbnail: thumbnail,
    slider: slider,
    mainText: mainText,
    author: author,
    price: price,
    sold: sold,
    quantity: quantity,
    category: category
  })
}

export const deleteBook = (bookId) => {
  return axios.delete(`api/v1/books/${bookId}`)
}

export const postCreateOrder = (orderData) => {
  return axios.post('api/v1/orders', { ...orderData })
}

export const getOrdersHistory = () => {
  return axios.get('api/v1/orders/history')
}

export const postUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImgUpload', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "folder_type": "avatar"
    },
  });
}

export const postChangeUserPassword = (email, oldpassword, newpassword) => {
  return axios.post(`api/v1/users/password`, {
    email: email,
    oldpassword: oldpassword,
    newpassword: newpassword
  })
}