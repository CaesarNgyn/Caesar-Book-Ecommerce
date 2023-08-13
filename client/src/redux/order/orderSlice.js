import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carts: []
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    doAddBook: (state, action) => {
      let carts = state.carts
      const data = action.payload
      let isExistedBook = carts.findIndex(cart => cart._id === data._id)
      if (isExistedBook !== -1) {
        carts[isExistedBook].quantity = carts[isExistedBook].quantity + data.quantity
        if (carts[isExistedBook].quantity >= carts[isExistedBook].detail.quantity) {
          carts[isExistedBook].quantity = carts[isExistedBook].detail.quantity
        }
      } else {
        carts.push({ quantity: data.quantity, _id: data._id, detail: data.detail })
      }
      state.carts = carts
    },
    doUpdateBook: (state, action) => {
      let carts = state.carts
      const data = action.payload
      let isExistedBook = carts.findIndex(cart => cart._id === data._id)
      if (isExistedBook !== -1) {
        carts[isExistedBook].quantity = data.quantity
        if (carts[isExistedBook].quantity >= carts[isExistedBook].detail.quantity) {
          carts[isExistedBook].quantity = carts[isExistedBook].detail.quantity
        }
      } else {
        carts.push({ quantity: data.quantity, _id: data._id, detail: data.detail })
      }
      state.carts = carts
    },
    doDeleteBook: (state, action) => {
      state.carts = state.carts.filter(cart => cart._id !== action.payload._id)
    }
  }

})


export const { doAddBook, doUpdateBook, doDeleteBook } = orderSlice.actions;
export default orderSlice.reducer;